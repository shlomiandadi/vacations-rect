import "./Page404.css";
import break1 from '../../../Assets/Images/design/MnQWcWb6SrY.svg';
import { NavLink } from "react-router-dom";

function Page404(): JSX.Element {
    return (
        <div className="Page404">

            <div className="box">
                <img src={break1} width="112" height="112" alt=''/>
                <p style={{ fontWeight: '700' }}>This Page Isn't Available</p>

                <p style={{ fontWeight: '400' }}>The link may be broken, or the page may have been removed. Check to see if the link you're trying to open is correct.</p>

                <NavLink to="/vacations">Go Back</NavLink>

            </div>

        </div>
    );
}

export default Page404;
