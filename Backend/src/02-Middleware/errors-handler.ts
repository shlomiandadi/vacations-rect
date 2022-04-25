import { NextFunction, Request, Response } from "express";
import ClientError from "../03-Models/client-error";

function errorsHandler(err: any, request: Request, response: Response, next: NextFunction): void {

    if(err instanceof Error) {
        response.status((err as any).status || 500).send(err.message);
        return;
    }

    // Client error: 
    if(err instanceof ClientError) {
        response.status(err.status).send(err.message);
        return;
    }

    next(); 
}

export default errorsHandler;