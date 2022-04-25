import { UploadedFile } from "express-fileupload";
import Joi from "joi";

class VacationModel {
    public id: number;
    public description: string;
    public destination: string;
    public imageName: String;
    public image: UploadedFile; 
    public fromDate: string;
    public toDate: string;
    public price: number;

    public constructor(vacation: VacationModel) {
        this.id = vacation.id;
        this.description = vacation.description;
        this.destination = vacation.destination;
        this.image = vacation.image;
        this.imageName = vacation.imageName;
        this.fromDate = vacation.fromDate;
        this.toDate = vacation.toDate;
        this.price = vacation.price;
    }

    // Post Validation Schema
    private static postValidationSchema = Joi.object({
        id: Joi.forbidden(),
        description: Joi.string().trim().required().min(2).max(1500),
        destination: Joi.string().trim().required().min(2).max(50),
        fromDate: Joi.string().required(),
        toDate: Joi.string().required(),
        imageName: Joi.forbidden(),
        image: Joi.object().required(),
        price: Joi.number().required().min(2).max(30000),
    });

    // Put Validation Schema
    private static putValidationSchema = Joi.object({
        id: Joi.number().required().positive().integer(),
        description: Joi.string().trim().required().min(2).max(1500),
        destination: Joi.string().trim().required().min(2).max(50),
        fromDate: Joi.string().required(),
        toDate: Joi.string().required(),
        imageName: Joi.forbidden(),
        image: Joi.object().optional(),
        price: Joi.number().required().min(2).max(30000),
    });

    // Validate Post;
    public validatePost() {
        const result = VacationModel.postValidationSchema.validate(this, { abortEarly: false });
        return result.error?.message;
    }

    // Validate Put;
    public validatePut() {
        const result = VacationModel.putValidationSchema.validate(this, { abortEarly: false });
        return result.error?.message;
    }
}

export default VacationModel;