import express, { NextFunction, Request, Response } from "express";
import FollowerModel from "../03-Models/follower-model";
import logic from "../05-BLL/followers-logic";
import verifyUser from "../02-Middleware/verify-user";
import verifyToken from "../02-Middleware/verify-token";

const router = express.Router();

//get all followed vacations for a specific user
router.get("/:uuid", verifyToken, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const uuid = request.params.uuid;
        const follows = await logic.getAllFollowedVacations(uuid);
        if (!follows) {
            response.status(404).send(`No follows were found`);
        }
        response.json(follows);
    }
    catch (err: any) {
        next(err);
    }
});

// Follow a vacation
router.post("/", verifyUser, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const follow = new FollowerModel(request.body);
        const addedFollower = await logic.addFollowVacation(follow);
        response.status(201).json(addedFollower);
    }
    catch (err: any) {
        next(err);
    }
});

// Unfollow vacation
router.delete("/:userId/:vacationId", verifyUser, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const vacationId = +request.params.vacationId;
        const userId = +request.params.userId;
        await logic.unfollowVacation(userId, vacationId);
        response.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});

// get number of follows for each vacation - /api/vacations/follows/count-follows/2
router.get("/count-follows/:vacationId", verifyToken, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const vacationId = +request.params.vacationId;
        const numberOfFollows = await logic.getNumberOfFollows(vacationId);
        response.json(numberOfFollows);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;