import { Response, Request, NextFunction } from "express"
import { ErrorCode, HttpException } from "../exceptions/root";
import { InternalException } from "../exceptions/internal.exception";

export const asyncHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next);
        } catch(error: any) {
            let exception: HttpException;
            if(error instanceof HttpException) {
                exception = error;
            } else {
                exception = new InternalException('Internal Server Error', ErrorCode.INTERNAL_EXCEPTION, error);
            }
            next(exception);
        }
    }
}
