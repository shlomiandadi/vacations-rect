import { createStore } from "redux";
import { authReducer } from "./AuthState";
import { vacationsReducer } from "./VacationsState";
import { followersReducer } from "./FollowersState";

const vacationsStore = createStore(vacationsReducer);
export default vacationsStore;

export const authStore = createStore(authReducer);

export const followersStore = createStore(followersReducer);

