import { Routes, Route, Navigate } from "react-router-dom";
import Page404 from "../Page404/Page404";
import Logout from "../../AuthArea/Logout/Logout";
import authService from "../../../Services/AuthService";
import { useEffect, useState } from "react";
import { authStore } from "../../../Redux/Store";
import VacationList from "../../VacationArea/VacationList/VacationList";
import AddVacation from "../../VacationArea/AddVacation/AddVacation";
import EditVacation from "../../VacationArea/EditVacation/EditVacation";
import Home from "../../HomeArea/Home/Home";
import Graph from "../../GraphArea/Graph/Graph";

function Routing(): JSX.Element {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(authService.getUser()?.isAdmin);

    useEffect(() => {
        setIsLoggedIn(authService.isLoggedIn());
        setIsAdmin(authStore.getState().user?.isAdmin);
        const unsubscribeMe = authStore.subscribe(() => {
            setIsLoggedIn(authService.isLoggedIn());
            setIsAdmin(authStore.getState().user?.isAdmin);
        });
        return () => unsubscribeMe();
    }, []);

    return (
        <Routes>
            <Route path="/home" element={!isLoggedIn ? <Home /> : <Navigate to="/vacations" />} />
            {/* <Route path="/home" element={<VacationList />} /> */}
            <Route path="/vacations" element={isLoggedIn ? <VacationList /> : <Navigate to="/home" />} />
            <Route path="/vacations/new" element={isAdmin ? <AddVacation /> : <Navigate to="/home" />} />
            <Route path="/vacations/edit/:id" element={isAdmin ? <EditVacation /> : <Navigate to="/home" />} />
            <Route path="/vacations/graph" element={isAdmin ? <Graph /> : <Navigate to="/home" />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<Page404 />} />
        </Routes>
    );
}

export default Routing;
