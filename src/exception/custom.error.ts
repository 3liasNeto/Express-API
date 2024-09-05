import { Request, Response, NextFunction,  } from "express";
import type { ErrorRequestHandler } from "express";

export enum HttpCode {
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500
}

type ErrorProps = {
    res: Response;
    req: Request;
    err: Error;
    next: NextFunction;
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {};

class ServerError {
    static ErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
        const errCode = err.statusCode || HttpCode.INTERNAL_SERVER_ERROR;
        const errMessage = err.message || "Internal Server Error";
        
        res.status(errCode).json({
            success: false,
            status: errCode,
            message: errMessage,
            stack: process.env.NODE_ENV === 'development' ? err.stack : {}
        })
    }
}