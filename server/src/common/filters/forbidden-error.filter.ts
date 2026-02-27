import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ForbiddenException,
} from '@nestjs/common';
import { ForbiddenError } from '@casl/ability';

@Catch(ForbiddenError)
export class ForbiddenErrorFilter implements ExceptionFilter {
  catch(exception: ForbiddenError<any>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Convert CASL ForbiddenError to NestJS ForbiddenException
    const nestException = new ForbiddenException(
      exception.message || 'Access denied',
    );

    response.status(403).json({
      statusCode: 403,
      message: nestException.message,
      error: 'Forbidden',
    });
  }
}
