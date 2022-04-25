import { Component, useEffect } from "react";
import "./VacationList.css";
import { NavLink } from "react-router-dom";
import VacationCard from "../VacationCard/VacationCard";
import vacationsService from "../../../Services/VacationsService";
import VacationModel from "../../../Models/VacationModel";
import vacationsStore, { authStore } from "../../../Redux/Store";
import followersService from "../../../Services/FollowersService";
import { FetchVacationsAction } from "../../../Redux/VacationsState";
import { Unsubscribe } from "redux";
import notifyService from "../../../Services/NotifyService";
import React from 'react'
interface VacationListState {
    vacations: VacationModel[];
}
class VacationList extends Component<{}, VacationListState> {
    // private unsubscribeMe: Unsubscribe;
    private unsubscribeMe: any;
    public status: VacationModel | undefined;
    public isAdmin: boolean = authStore.getState().user?.isAdmin ? true : false;
    
    public async componentDidMount() {
        try {
            const vacations = await vacationsService.getAllVacations();
            // get follows data from the server:
            const follows = await followersService.getAllFollowers();
            // for each vacation check if it's followed by the user. if it is - set its isFollowed property to "true" 
            follows.forEach((vacFollow) => {
                vacations.forEach((vac) => {
                    if (vacFollow.vacationId === vac.id) {
                        vac.isFollowed = true;
                    };
                });
            });

            vacationsStore.dispatch(FetchVacationsAction(vacations));

            const vacations1 = vacations.filter(vac => vac.isFollowed === true)
            const vacations2 = vacations.filter(vac1 => !vac1.isFollowed)
            const sortedVacations = vacations1.concat(vacations2);
            this.setState({ vacations: sortedVacations });
          

            //  listen for changes in redux socket
            this.unsubscribeMe = vacationsStore.subscribe(async () => {
                const vacations = await vacationsService.getAllVacations();
                // get follows data from the server:
                const follows = await followersService.getAllFollowers();
                // for each vacation check if it's followed by the user. if it is - set its isFollowed property to "true"
                follows.forEach((vacFollow) => {
                    vacations.forEach((vac) => {
                        if (vacFollow.vacationId === vac.id) {
                            vac.isFollowed = true;
                        };
                    });
                });

                vacationsStore.dispatch(FetchVacationsAction(vacations));

                const vacations1 = vacations.filter(vac => vac.isFollowed === true)
                const vacations2 = vacations.filter(vac1 => !vac1.isFollowed)
                const sortedVacations = vacations1.concat(vacations2);
                this.setState({ vacations: sortedVacations });
            });
        }
        catch (err: any) {
            notifyService.error(err);
        }
    }

    public vacationsSorted(vacations: VacationModel[]) {
        const vacations1 = vacations.filter(vac => vac.isFollowed === true)
        const vacations2 = vacations.filter(vac1 => !vac1.isFollowed)
        const sortedVacations = vacations1.concat(vacations2);
        return sortedVacations;
    }

    public componentWillUnmount(): void {
        this.unsubscribeMe();        
    }

    public render(): JSX.Element {
        return (
            <div className="VacationList">

                {this.isAdmin && (
                    <div className="link">
                        <NavLink to="/vacations/new">New Vacation</NavLink>
                        <br />
                        <NavLink to="/vacations/graph">Graph</NavLink>
                    </div>
                )}
                {this.state?.vacations?.map(v => <VacationCard key={v.id} vacation={v} changeStatus={(vacation: VacationModel) => {
                    vacation.isFollowed = !vacation.isFollowed;
                    const arr: VacationModel[] = this.vacationsSorted([...this.state.vacations]);
                    this.setState({ vacations: arr });
                }} />)}
            </div>
        );
    }
}

export default VacationList;
