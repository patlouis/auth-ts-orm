export class HttpException extends Error {
    message: string;
    errorCode: ErrorCode;
    statusCode: number;
    errors: any;

    constructor(message: string, errorCode: ErrorCode, statusCode: number, error: any) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = error;
    }
}

export enum ErrorCode {
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    INVALID_PASSWORD = 'INVALID_PASSWORD',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY'
}