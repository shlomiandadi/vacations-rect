import { io, Socket } from 'socket.io-client';
import VacationModel from '../Models/VacationModel';
import vacationsStore, { authStore } from '../Redux/Store';
import { addVacationAction, deleteVacationAction, updateVacationAction } from '../Redux/VacationsState';
import config from '../Utils/Config';

class SocketIoService {

    private socket: any
    public isAdmin: boolean = authStore?.getState()?.user?.isAdmin ? true : false;

    // connect to socket sserver:
    public connect(): void {
        this.socket = io(config.urls.socketServer);

        //listen to adding a vacation by admin ( it send vacation)
        this.socket.on("admin-add-vacation", (vacation: VacationModel) => {         
            if(this.isAdmin) return; 
            vacationsStore.dispatch(addVacationAction(vacation));
        });

        //listen to adding a vacation by admin ( it send vacation)
        this.socket.on("admin-update-vacation", (vacation: VacationModel) => {         
            vacationsStore.dispatch(updateVacationAction(vacation));

        });

        //listen to adding a vacation by admin ( it send vacation)
        this.socket.on("admin-delete-vacation", (id: number) => {
            if(this.isAdmin) return;
            vacationsStore.dispatch(deleteVacationAction(id));
        });
    }
    public disConnect(): void {
        this.socket.disconnect();
    }
}

const socketIoService = new SocketIoService();

export default socketIoService;