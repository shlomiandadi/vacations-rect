import { useEffect } from "react";
import { useNavigate } from "react-router";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";

function Logout(): JSX.Element {

    const navigate = useNavigate();

    useEffect(() => {
        authService.logout();
        notifyService.success("Logout succeed");
        navigate("/home");
    }, [navigate, authService, notifyService]);

    // return null

    return  (
        <div>
            Logout
        </div>
    );
}

export default Logout;
