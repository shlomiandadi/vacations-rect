import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import Plane from "../Plane/Plane";
import "./Header.css";

function Header(): JSX.Element {
    return (
        <div className="Header">
            <Plane />
            <AuthMenu />
            <h1 style={{fontSize :'40px' , marginTop:'6px'}} className="font-effect-3d">Vacation</h1>
        </div>
    );
}

export default Header;