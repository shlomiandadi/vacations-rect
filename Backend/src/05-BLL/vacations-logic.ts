import { OkPacket } from "mysql";
import dal from "../04-DAL/dal";
import { v4 as uuid } from "uuid";
import ClientError from "../03-Models/client-error";
import VacationModel from "../03-Models/vacation-model";
import safeDelete from "../01-Utils/safe-delete";
import followsLogic from "./followers-logic";
import socketLogic from "./socket-logic";

async function getAllVacations(): Promise<VacationModel[]> {
    const sql = `SELECT vacationId AS id, description, destination , imageName , DATE_FORMAT(fromDate, "%Y-%m-%d") as fromDate , DATE_FORMAT(toDate, "%Y-%m-%d") as toDate , price FROM Vacations`;
    const vacations = await dal.execute(sql);
    // get the number of followers for each vacation
    for (const vacation of vacations) {
        const vacationInd = await followsLogic.getNumberOfFollows(vacation.id);
        const vac = vacationInd[0];
        vacation.followersCount = vac.followersCount;
    }
    return vacations;
}

async function getOneVacation(id: number): Promise<VacationModel> {
    const sql = `SELECT vacationId AS id, description, destination , imageName ,DATE_FORMAT(fromDate, "%Y-%m-%d") as fromDate , DATE_FORMAT(toDate, "%Y-%m-%d") as toDate , price FROM Vacations WHERE vacationId = ${id} `;
    const vacations = await dal.execute(sql);
    const vacation = vacations[0];
    vacation.followersCount = await followsLogic.getNumberOfFollows(vacation.id);
    return vacation;
}

async function addVacation(vacation: VacationModel): Promise<VacationModel> {
    const errors = vacation.validatePost();
    if (errors) {
        throw new ClientError(400, errors)
    }
    // Save the image to disk:
    // 1. Take the original extension (tiff, jpg, jpeg, gif, png, bmp, ....... ): 
    const extension = vacation.image.name.substr(vacation.image.name.lastIndexOf(".")); 
    // 2. Create uuid file name including the original extension: 
    vacation.imageName = uuid() + extension;
    // 3. Save the image to the disk:
    await vacation.image.mv("./src/Assets/Images/vacations/" + vacation.imageName);
    // 4. Delete the image from the model so it won't get back to user:
    delete vacation.image;

    const sql = `INSERT INTO Vacations
    VALUES(DEFAULT ,"${vacation.description}", "${vacation.destination}","${vacation.imageName}", "${vacation.fromDate}","${vacation.toDate}",${vacation.price})`;
    const info: OkPacket = await dal.execute(sql);
    vacation.id = info.insertId;

    // socket.io:
    socketLogic.emitAddVacation(vacation);
    return vacation;
}

async function updateFullProduct(vacation: VacationModel): Promise<VacationModel> { 
    const errors = vacation.validatePut();
    if (errors) {
        throw new ClientError(400, errors)
    }
    // Get existing database product: 
    const dbVacation = await getOneVacation(vacation.id);

    // 1. Set image name
    vacation.imageName = dbVacation.imageName;
    // 2. If we have an image to update:
    if (vacation.image) {
        //3. Delete prev image from disk:
        // fs.unlinkSync("./src/00-DB/Images/" + vacation.imageName)
        safeDelete("./src/Assets/Images/vacations/" + vacation.imageName);
        //4. take the original extension (tiff, jpg, jpeg, gif, png , bmp,....)
        const extension = vacation.image.name.substr(vacation.image.name.lastIndexOf(".")); 
        //5. create uuid file name including the original exptension:
        vacation.imageName = uuid() + extension;
        //6. save the image to the disk:
        await vacation.image.mv("./src/Assets/Images/vacations/" + vacation.imageName);
        //7. Delete the image from the model so it wont get back to user
        delete vacation.image;
    }

    const sql = `UPDATE Vacations SET 
        description =  "${vacation.description}",
        destination = "${vacation.destination}",
        imageName = "${vacation.imageName}",
        fromDate = "${vacation.fromDate}",
        toDate = "${vacation.toDate}",
        price = ${vacation.price}
        WHERE vacationId = ${vacation.id}`;          
    const info: OkPacket = await dal.execute(sql);
    
    // socket.io:
    socketLogic.emitUpdateVacation(vacation);
    
    return vacation;
}

async function deleteVacation(id: number): Promise<void> {
    if (id === -1) {
        throw new ClientError(404, `id ${id} not found`);
    }
    const dbVacation = await getOneVacation(id);
    safeDelete("./src/Assets/Images/vacations/" + dbVacation.imageName);
    const sql = "DELETE FROM VacationS WHERE vacationId = " + id;
    const info: OkPacket = await dal.execute(sql);
    // socket.io:
    socketLogic.emitDeleteVacation(id);
}

export default {
    getAllVacations,
    getOneVacation,
    addVacation,
    updateFullProduct,
    deleteVacation
};
