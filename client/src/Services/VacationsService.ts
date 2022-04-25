import axios from "axios";
import VacationModel from "../Models/VacationModel";
import { addVacationAction, deleteVacationAction, FetchVacationsAction, updateVacationAction } from "../Redux/VacationsState";
import config from "../Utils/Config";
import vacationsStore from "../Redux/Store";
class VacationsService {

    public async getAllVacations(): Promise<VacationModel[]> {
        if (vacationsStore.getState().vacations.length === 0) {
            const response = await axios.get<VacationModel[]>(config.urls.vacations);
            const vacations = response.data;
            vacationsStore.dispatch(FetchVacationsAction(vacations)); // Send downloaded vacations to Redux.
            return vacations;
        }
        else {
            const vacations = vacationsStore.getState().vacations;
            return vacations;
        }
    }

    public async getOneVacation(id: number): Promise<VacationModel> {
        const vacations = vacationsStore.getState().vacations;
        const vacation = vacations.find(v => v.id === id);
        if (vacation) {
            return vacation;
        }
        const response = await axios.get<VacationModel>(config.urls.vacations + id);
        return response.data;
    }

    public async addVacation(vacation: any): Promise<VacationModel> {
        const myFormData = new FormData();
        myFormData.append("description", vacation.description);
        myFormData.append("destination", vacation.destination);
        myFormData.append("fromDate", vacation.fromDate);
        myFormData.append("toDate", vacation.toDate);
        myFormData.append("price", vacation.price.toString());
        myFormData.append("image", vacation.image.item(0));

        const response = await axios.post<VacationModel>(config.urls.vacations, myFormData); 
        const addedVacation = response.data;
        vacationsStore.dispatch(addVacationAction(addedVacation));
        return addedVacation;
    }

    public async updateVacation(vacation:any): Promise<VacationModel> {
        const myFormData = new FormData();
        myFormData.append("description", vacation.description);
        myFormData.append("destination", vacation.destination);
        myFormData.append("fromDate", vacation.fromDate);
        myFormData.append("toDate", vacation.toDate);
        myFormData.append("price", vacation.price.toString());
        myFormData.append("image", vacation.image.item(0)); 
        const response = await axios.put<VacationModel>(config.urls.vacations + vacation.id, myFormData); 
        const updatedVacation = response.data;       
        vacationsStore.dispatch(updateVacationAction(updatedVacation));
        return updatedVacation;
    }

    public async deleteVacation(id: number): Promise<void> {
        await axios.delete(config.urls.vacations + id); 
        vacationsStore.dispatch(deleteVacationAction(id));
    }

}

// Single object:
const vacationsService = new VacationsService();

export default vacationsService;