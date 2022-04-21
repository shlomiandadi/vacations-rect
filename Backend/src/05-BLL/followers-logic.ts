import { OkPacket } from "mysql";
import ClientError from "../03-Models/client-error";
import FollowerModel from "../03-Models/follower-model";
import dal from "../04-DAL/dal";

// get all followed vacations by user's uuid
async function getAllFollowedVacations(uuid: string): Promise<FollowerModel[]> {
    const sql = `SELECT U.id, V.vacationId
                FROM Followers AS F JOIN users AS U JOIN vacations AS V 
                ON F.userId = U.id AND F.vacationId = V.vacationId
                WHERE U.uuid = '${uuid}'`;
    const follows = await dal.execute(sql);
    return follows;
}

// follow a new vacation
async function addFollowVacation(follow: FollowerModel): Promise<FollowerModel> {
    const errors = follow.validatePost();
    if (errors) {
        throw new ClientError(400, errors);
    }
    const sql = `INSERT INTO Followers(vacationId, userId) VALUES(${follow.vacationId}, ${follow.userId})`;
    const addedFollow = await dal.execute(sql);
    return addedFollow;
}

async function unfollowVacation(userId: number, vacationId: number): Promise<void> {
    const sql = `DELETE FROM Followers WHERE userId = ${userId} AND vacationId =${vacationId}`;
    const info: OkPacket = await dal.execute(sql);
}

// get numbers of followers for a vacation 
async function getNumberOfFollows(vacationId: number): Promise<number> {
    const sql = `SELECT COUNT(F.vacationId) AS 'followersCount', V.vacationId, V.destination
                FROM Followers AS F JOIN vacations AS V
                ON F.vacationId = V.vacationId
                WHERE F.vacationId = ${vacationId}`;
    // const sql = `SELECT COUNT(vacationId) AS followersCount FROM Followers WHERE vacationId =${vacationId}`;
    const numberOfFollows = await dal.execute(sql);
    return numberOfFollows;
}

export default {
    getAllFollowedVacations,
    addFollowVacation,
    getNumberOfFollows,
    unfollowVacation
};
