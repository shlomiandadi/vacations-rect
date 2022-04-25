import FollowerModel from "../Models/FollowerModel";

export class FollowersState {
    public followers: FollowerModel[] = [];
}

export enum FollowersActionType {
    FetchFollowers = "FetchFollowers",
    AddFollowers = "AddFollowers",
    FollowersTotalCount = "FollowsTotalCount",
    DeleteFollowers = "DeleteFollowers",
}

export interface FollowersAction {
    type: FollowersActionType;
    payload?: any;
}

export function fetchFollowersAction(followers: FollowerModel[]): FollowersAction {
    return { type: FollowersActionType.FetchFollowers, payload: followers };
}
export function addFollowersAction(followerToAdd: FollowerModel): FollowersAction {
    return { type: FollowersActionType.AddFollowers, payload: followerToAdd };
}
export function followersTotalCountAction(followerCount: FollowerModel): FollowersAction {
    return { type: FollowersActionType.FollowersTotalCount, payload: followerCount };
}
export function deleteFollowersAction(idToDelete: number): FollowersAction {
    return { type: FollowersActionType.DeleteFollowers, payload: idToDelete };
}

export function followersReducer(currentFollowersState: FollowersState = new FollowersState(), action: FollowersAction): FollowersState {

    const newFollowersState = { ...currentFollowersState };

    switch (action.type) {

        case FollowersActionType.FetchFollowers:

            newFollowersState.followers = action.payload;
            break;

        case FollowersActionType.AddFollowers:
            newFollowersState.followers.push(action.payload);
            break;

        case FollowersActionType.DeleteFollowers:
            const indexToDelete = newFollowersState.followers.findIndex(f => f.vacationId === action.payload);
            newFollowersState.followers.splice(indexToDelete, 1);
            break;

    }

    return newFollowersState;
}