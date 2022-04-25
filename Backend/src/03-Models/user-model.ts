const Joi = require("joi");

class UserModel {
    public id: number;
    public uuid: string;
    public firstName: string;
    public lastName: string;
    public username: string;
    public password: string;
    public isAdmin: boolean;

    public constructor(user: UserModel) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.password = user.password;
        this.isAdmin = user.isAdmin;

    }

    private static postValidationSchema = Joi.object({
        id: Joi.forbidden(),
        username: Joi.string().required().min(2).max(50),
        password: Joi.string().required().min(4).max(128),
        firstName: Joi.string().required().min(2).max(50),
        lastName: Joi.string().required().min(2).max(50),
        isAdmin: Joi.optional()
    });

    validatePost() {
       const result = UserModel.postValidationSchema.validate(this, { abortEarly: false }); 
        return result.error ? result.error.message : null; 
    }
}

export default UserModel;

