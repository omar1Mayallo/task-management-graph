import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

export interface File {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: File,
    folder: string,
    oldImgPublicId?: string
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise(async (resolve, reject) => {
      // 1) Upload Image To specific folder to cloudinary
      const upload = v2.uploader.upload_stream({ folder }, async (error, result) => {
        if (error) {
          console.log('Error while uploading', error);
          throw new InternalServerErrorException('Error while uploading');
        }

        // 2) If The User already has avatar and try to update it to a new one .. delete old img from cloudinary first
        if (oldImgPublicId) {
          try {
            await v2.uploader.destroy(oldImgPublicId);
          } catch (deleteError) {
            console.log('Error while deleting old avatar', deleteError);
            throw new InternalServerErrorException('Error while deleting old avatar');
          }
        }

        resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await v2.uploader.destroy(publicId);
    } catch (error) {
      console.log('Error while deleting', error);
      throw new InternalServerErrorException('Error while deleting');
    }
  }
}
