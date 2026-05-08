import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

export const currentUser = createParamDecorator(
  (field: unknown, cxt: ExecutionContext): User => {
    const request = cxt.switchToHttp().getRequest();
    return request.user;
  },
);

export const userId = createParamDecorator(
  (_field: unknown, cxt: ExecutionContext): string => {
    const request = cxt.switchToHttp().getRequest();
    return request.user?.id;
  },
);
