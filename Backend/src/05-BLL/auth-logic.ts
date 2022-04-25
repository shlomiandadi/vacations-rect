import jwt from "../01-Utils/jwt";
import ClientError from "../03-Models/client-error";
import CredentialsModel from "../03-Models/credentials-model";
import UserModel from "../03-Models/user-model";
import dal from "../04-DAL/dal";
import { v4 as uuid } from "uuid";
import cryptoHelper from "../01-Utils/crypto-helper";
import { OkPacket } from "mysql";

async function register(user: UserModel): Promise<string> {
    const errors = user.validatePost();
    if (errors) {
        throw new ClientError(400, errors);
    }

    const isUsername = await dal.execute(`SELECT username from users where username = "${user.username}"`);
    if (isUsername.length > 0) {
        throw new ClientError(400, 'Please choose other username');
    }

    user.password = cryptoHelper.hash(user.password);
    user.uuid = uuid();
    const sql = `INSERT INTO users VALUES(DEFAULT, '${user.uuid}', '${user.firstName}', '${user.lastName}', '${user.username}', '${user.password}', DEFAULT)`;
    const info: OkPacket = await dal.execute(sql);
    if (info.affectedRows === 0) {
        return null;
    }

    user.id = info.insertId;
    delete user.password;

    // Generate new token: 
    const token = jwt.getNewToken(user);

    return token;
}

async function login(credentials: CredentialsModel): Promise<string> {
    const errors = credentials.validatePost();
    if (errors) {
        throw new ClientError(400, errors);
    }
    credentials.password = cryptoHelper.hash(credentials.password);
    const users = await dal.execute(`SELECT * from users where username = "${credentials.username}" AND password = "${credentials.password}"`);
    if (users.length === 0) throw new ClientError(401, "Incorrect username or password");  
    const user = users[0];
    delete user.password;
    const token = jwt.getNewToken(user);
    return token;
}

async function usernameCheck(username: string) {
    const isUsername = await dal.execute(`SELECT username from users where username = "${username}"`);
    if (isUsername.length > 0) {
        return isUsername[0].username;
    }
}


export default {
    register,
    login,
    usernameCheck
};