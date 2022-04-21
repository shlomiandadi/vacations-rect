const Joi = require("joi");

class CredentialsModel {
    public username: string;
    public password: string;

    public constructor(credentials: CredentialsModel) {
        this.username = credentials.username;
        this.password = credentials.password;
    }
    
    private static postValidationSchema = Joi.object({
        username: Joi.string().required().min(2).max(50),
        password: Joi.string().required().min(4).max(128),
    });
        
    // Validate Post;
    public validatePost() {
        const result = CredentialsModel.postValidationSchema.validate(this, { abortEarly: false });
        return result.error?.message;
    }
}

export default CredentialsModel;