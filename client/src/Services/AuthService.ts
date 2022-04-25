import { authStore } from '../Redux/Store';
import axios from "axios";
import UserModel from "../Models/UserModel";
import config from "../Utils/Config";
import { loginAction, logoutAction, registerAction } from '../Redux/AuthState';
import CredentialsModel from '../Models/CredentialsModel';
import jwtDecode from 'jwt-decode';


class AuthService {

    public async register(user: UserModel): Promise<void> {
        const response = await axios.post<string>(config.urls.register, user);
        const token = response.data;
        authStore.dispatch(registerAction(token));
    }

    public async login(credentials: CredentialsModel): Promise<void> {
        const response = await axios.post<string>(config.urls.login, credentials);
        const token = response.data;
        authStore.dispatch(loginAction(token));
    }

    public logout(): void {
        authStore.dispatch(logoutAction());
    }

    public isLoggedIn(): boolean {
        return authStore.getState().token !==null;
    }

    public getUser(): any {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedData = jwtDecode(token);
            const user = (decodedData as any).user;
            return user;
        }
    }

    public async checkUsername(username: string) {
        const response = await axios.get<string>(config.urls.usernameVerify + username);
        const isUsername = response.data;
        if (isUsername) {
            return username;
        }
    }
}

const authService = new AuthService();

export default authService;