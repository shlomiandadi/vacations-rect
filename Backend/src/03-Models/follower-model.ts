import Joi from "joi";

class FollowerModel {
    public userId: number;
    public vacationId: number;

    public constructor(follower: FollowerModel) {
        this.userId = follower.userId;
        this.vacationId = follower.vacationId;
    }

    // Post Validation Schema
    private static postValidationSchema = Joi.object({
        userId: Joi.number().required().integer(),
        vacationId: Joi.number().required().integer(),
    });

    // Validate Post;
    public validatePost() {
        const result = FollowerModel.postValidationSchema.validate(this, { abortEarly: false });
        return result.error?.message;
    }
}

export default FollowerModel;