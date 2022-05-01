import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { authStore } from "../../../Redux/Store";
import "./AuthMenu.css";

function AuthMenu() {
    const [state, setState] = useState({user: authStore.getState().user });
    const unsubscribe = authStore.subscribe(() => {
        setState({
            user: authStore.getState().user  
        });
    });
    useEffect(() => {
        return () => {
            unsubscribe();
        }
    }, [unsubscribe]);

  return (
    <div className="AuthMenu">
        {!state?.user &&<><span>Hello Guest</span></> }
        {state?.user && <><span>Hello {state?.user.username}</span>
        <span>||</span>
        </> }
        {state.user && (  <NavLink to="/logout" className="AuthMenu-link">Logout</NavLink>)}

        {/* {!state.user && (  <NavLink to="/login" className="AuthMenu-link">Login</NavLink>)} */}
        {/* {!state.user && (  <NavLink to="/register" className="AuthMenu-link">Register</NavLink>)} */}
    </div>
  )
}
export default AuthMenu
