import express, { NextFunction, Request, Response } from "express";
import CredentialsModel from "../03-Models/credentials-model";
import UserModel from "../03-Models/user-model";
import logic from "../05-BLL/auth-logic";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = new UserModel(request.body);
        const token = await logic.register(user);
        response.status(201).json(token);
    }
    catch (err: any) {
        next(err);
    }
});

// POST /api/auth/login
router.post("/login", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const credentials = new CredentialsModel(request.body);
        const token = await logic.login(credentials);
        response.status(201).json(token);
    }
    catch (err: any) {
        next(err);
    }
});

// POST /api/auth/:user
router.get("/:username", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const username = request.params.username;
        const isUsername = await logic.usernameCheck(username);
        response.status(201).json(isUsername);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;



