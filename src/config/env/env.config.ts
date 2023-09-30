import { ConfigModuleOptions } from '@nestjs/config';
import envValidationSchema from './env.schema';

const envConfig: ConfigModuleOptions = {
  isGlobal: true,
  validationSchema: envValidationSchema
};
export default envConfig;
