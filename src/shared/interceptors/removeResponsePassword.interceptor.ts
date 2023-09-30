import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemoveResponsePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (typeof data === 'object') {
          if (
            data.hasOwnProperty('user') &&
            typeof data.user === 'object' &&
            data.user.hasOwnProperty('password')
          ) {
            // Clone the user object without the 'password' field
            const userWithoutPassword = { ...data.user };
            delete userWithoutPassword.password;

            // Create a new object without "password" in the 'user' obj
            return { ...data, user: userWithoutPassword };
          }
        }
        return data;
      })
    );
  }
}
