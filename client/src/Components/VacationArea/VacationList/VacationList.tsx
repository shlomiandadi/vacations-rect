import { Component, useEffect, useState } from "react";
import "./VacationList.css";
import { NavLink } from "react-router-dom";
import VacationCard from "../VacationCard/VacationCard";
import vacationsService from "../../../Services/VacationsService";
import VacationModel from "../../../Models/VacationModel";
import vacationsStore, { authStore } from "../../../Redux/Store";
import followersService from "../../../Services/FollowersService";
import { FetchVacationsAction } from "../../../Redux/VacationsState";
import notifyService from "../../../Services/NotifyService";


const VacationList = () => {
    let unsubscribeMe: any = undefined;
    const isAdmin: boolean = authStore.getState().user?.isAdmin && true;

    const [vacations, setVacations] = useState<VacationModel[]>([]);

    useEffect(() => {
        const fetchVacations = async () => {
            try {
                const vacations = await vacationsService.getAllVacations();
                const follows = await followersService.getAllFollowers();
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
                setVacations(sortedVacations);

                unsubscribeMe = vacationsStore.subscribe(async () => {
                    const vacations = await vacationsService.getAllVacations();
                    const follows = await followersService.getAllFollowers();
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
                    setVacations(sortedVacations);
                });
            }
            catch (err: any) {
                notifyService.error(err);
            }
        }

        fetchVacations()

        return () => {
            unsubscribeMe && unsubscribeMe();
        }
    }, [])


    const vacationsSorted = (vacations: VacationModel[]) => {
        const vacations1 = vacations.filter(vac => vac.isFollowed === true)
        const vacations2 = vacations.filter(vac1 => !vac1.isFollowed)
        const sortedVacations = vacations1.concat(vacations2);
        return sortedVacations;
    }

    return (
        <div className="VacationList">
            {isAdmin && (
                <div className="link">
                    <NavLink to="/vacations/new">New Vacation</NavLink>
                    <br />
                    <NavLink to="/vacations/graph">Graph</NavLink>
                </div>
            )}
            {vacations?.map(vacation =>
                <VacationCard
                    key={vacation.id}
                    vacation={vacation}
                    changeStatus={(vacation: VacationModel) => {
                        vacation.isFollowed = !vacation.isFollowed;
                        setVacations(vacationsSorted(vacations));
                    }}
                />)}
        </div>
    );
}

export default VacationList;
