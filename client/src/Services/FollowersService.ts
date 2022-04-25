import axios from "axios";
import FollowerModel from "../Models/FollowerModel";
import VacationModel from "../Models/VacationModel";
import { addFollowersAction, deleteFollowersAction, fetchFollowersAction } from "../Redux/FollowersState";
import { authStore, followersStore } from "../Redux/Store";
import config from "../Utils/Config";

class FollowersService {

    public async getAllFollowers(): Promise<FollowerModel[]> {
        if (followersStore.getState().followers.length === 0) {
            const response = await axios.get<FollowerModel[]>(config.urls.followers + authStore.getState().user.uuid);
            const followers = response.data;
            followersStore.dispatch(fetchFollowersAction(followers));
            return followers;
        }
        else {
            const followers = followersStore.getState().followers;
            return followers;
        }
    }

    public async addFollower(follower: any): Promise<FollowerModel> {
        const myFormData = new FormData();
        myFormData.append("userId", follower.userId.toString());
        myFormData.append("vacationId", follower.vacationId.toString());
        const response = await axios.post<FollowerModel>(config.urls.followers, myFormData);
        const addedFollower = response.data;
        followersStore.dispatch(addFollowersAction(addedFollower));
        return addedFollower;
    }

    public async deleteFollower(userId: number, vacationId: number): Promise<void> {
        await axios.delete(config.urls.followers + userId + "/" + vacationId);
        followersStore.dispatch(deleteFollowersAction(vacationId));
    }

    public async getNumberOfFollows(vacationId: number): Promise<VacationModel[]> {
        const response = await axios.get<VacationModel[]>(config.urls.followers + "/count-follows/" + vacationId);
        const followersNumbers = response.data;
        return followersNumbers;
    }

}

// Single object:
const followersService = new FollowersService();

export default followersService;