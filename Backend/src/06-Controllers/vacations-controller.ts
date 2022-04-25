import express, { NextFunction, Request, Response } from "express";
import VacationModel from "../03-Models/vacation-model";
import logic from "../05-BLL/vacations-logic";
import path from "path";
import verifyToken from "../02-Middleware/verify-token";
import verifyAdmin from "../02-Middleware/verify-admin";

const router = express.Router();

// Get all vacations
router.get("/", verifyToken, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const vacations = await logic.getAllVacations();
        response.json(vacations);
    }
    catch (err: any) {
        next(err);
    }
});

// Get one vacations
router.get("/:id", verifyToken, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        const vacation = await logic.getOneVacation(id);
        response.json(vacation);
    }
    catch (err: any) {
        next(err);
    }
});

// Add new vacation
router.post("/",verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.image = request.files?.image;
        const vacation = new VacationModel(request.body);
        const addedVacation = await logic.addVacation(vacation);
        response.status(201).json(addedVacation);
    }
    catch (err: any) {
        next(err);
    }
});

// Update a vacation
router.put("/:id",verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        request.body.id = id;
        request.body.image = request.files?.image;       
        const vacation = new VacationModel(request.body);        
        const updatedVacation = await logic.updateFullProduct(vacation);       
        response.json(updatedVacation);
    }
    catch (err: any) {
        next(err);
    }
});

// DELETE vacation
router.delete("/:id",verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        await logic.deleteVacation(id);
        response.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});


// user want the image for the frontend
// GET /api/movies/images/:imagename
router.get("/images/:imageName", (request: Request, response: Response, next: NextFunction) => {
    try {

        const imageName = request.params?.imageName;
        const absolutePath = path.join(__dirname, "..", "Assets", "Images", "vacations", imageName);
        response.sendFile(absolutePath);  

    }
    catch (err: any) {
        next(err); 
    }
});


export default router;