
import earth from "../../../Assets/Images/design/plane.gif";
import "./Home.css";
import { useState } from "react";
import Register from "../../AuthArea/Register/Register";
import Login from "../../AuthArea/Login/Login";
import VacationCard from "../../VacationArea/VacationCard/VacationCard";

// interface HomeProps {
//     type: string;
// }

function Home(): JSX.Element {
    const [status, setStatus] = useState<string>("login");
    return (
        <div className="Home" >
            {/* <img src={earth} alt="cruise" /> */}

            {status === "login" && <Login changeStatus={(status: string) => setStatus(status)} />}

            {status === "register" && <Register changeStatus={(status: string) => setStatus(status)} />}
        </div>
    );
}

export default Home;

// function Home(): JSX.Element {
//     const [status, setStatus] = useState<string>("login");

//     return (
//         <div className="Home" >
//             {/* <img src={earth} alt="cruise" /> */}

//             {status === "login" && <Login changeStatus={(status: string) => setStatus(status)} />}

//             {status === "register" && <Register changeStatus={(status: string) => setStatus(status)} />}
//         </div>

//     );
// }

// export default Home;
