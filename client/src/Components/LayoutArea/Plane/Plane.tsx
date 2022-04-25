import "./Plane.css";
import cloud1 from "../../../Assets/Images/design/cloud1.png";
import cloud2 from "../../../Assets/Images/design/cloud2.png";
import plane from "../../../Assets/Images/design/plane.png";

function Plane(): JSX.Element {
    return (
        <div className="Plane">
            <div className="container">
                <div className="cloud1"><img src={cloud1} alt='cloud1'/></div>
                <div className="cloud2"><img src={cloud2} alt='cloud2' /></div>
                <div className="cloud3"><img src={cloud1} alt='cloud3'/></div>
                <div className="cloud4"><img src={cloud2} alt='cloud4'/></div>
                <div className="plane"><img src={plane} alt='plane'/></div>
            </div>
        </div>
    );
}

export default Plane;
