import {Request, Response, NextFunction, RequestHandler} from 'express';

export const Greeter = (name: string) => `👋 Hello, ${name}!`;

const dsMiddleware = function (req: Request, res: Response, next: NextFunction): RequestHandler {
    console.log(`dsMiddleware >>>`);
    next();
}

export default dsMiddleware;
