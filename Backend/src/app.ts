import express, { NextFunction, Request, Response } from "express";
import vacationsController from "./06-Controllers/vacations-controller";
import followersController from "./06-Controllers/followers-controller";
import authController from "./06-Controllers/auth-controller";

import errorsHandler from "./02-Middleware/errors-handler";
import ClientError from "./03-Models/client-error";
import cors from "cors";
import config from "./01-Utils/config";
import expressFileUpload from "express-fileupload";
import socketLogic from "./05-BLL/socket-logic";

const server = express();
// delete me
server.use(cors());
server.use(express.json());
server.use(expressFileUpload());

server.use("/api/vacations", vacationsController);
server.use("/api/followers", followersController);
server.use("/api/auth", authController);

server.use("*", (request: Request, response: Response, next: NextFunction) => {
    const error = new ClientError(404, "Route not found");
    next(error);
});

server.use(errorsHandler);

const httpServer = server.listen(config.port, () => console.log("Listening..."));

socketLogic.initSocketIo(httpServer);
