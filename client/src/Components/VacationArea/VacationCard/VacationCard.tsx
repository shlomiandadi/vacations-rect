import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import { authStore } from "../../../Redux/Store";
import vacationsService from "../../../Services/VacationsService";
import config from "../../../Utils/Config";
import "./VacationCard.css";
import followersService from "../../../Services/FollowersService";
import FollowerModel from "../../../Models/FollowerModel";
import notifyService from "../../../Services/NotifyService";
import { IconButton } from "@mui/material";
import { MdOutlineHighlightOff, MdModeEditOutline } from "react-icons/md";
import { FcLike } from "react-icons/fc";

function VacationCard(props: any): JSX.Element {
    let isAdmin: boolean = authStore?.getState()?.user?.isAdmin ? true : false;

    const [isFollowed, setIsFollowed] = useState(props.vacation?.isFollowed);
    const [iconColor, setIconColor] = useState(props.vacation?.isFollowed ? "red" : "");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFollowers = async () => {
            const follows = await followersService.getAllFollowers();
            follows.forEach((follower: FollowerModel) => {
                if (follower.vacationId === props.vacation?.id) {
                    setIsFollowed(true);
                    setIconColor("red");
                }
            });
        }
        fetchFollowers()
    }, [followersService, props.vacation, setIsFollowed, setIconColor]);

    const deleteVacation = async (id: number) => {
        try {
            const answer = window.confirm("Are you sure?");
            if (!answer) return;
            await vacationsService.deleteVacation(id);
            navigate("/home")
        }
        catch (err) {
            console.error(err);
        }
    };

    const editVacation = (id: number) => {
        navigate("/vacations/edit/" + id);
    };

    async function followVacation() {
        try {
            const follow = new FollowerModel();
            follow.vacationId = props.vacation?.id;
            follow.userId = authStore.getState().user?.id;

            // if the vacation is already followed by the user - unfollow it 
            if (isFollowed) {
                const userId = authStore.getState().user?.id;
                const vacationId = props.vacation.id;
                await followersService.deleteFollower(userId, vacationId);
                props.vacation.followersCount--;
                setIconColor("");
                setIsFollowed(false);
                props.changeStatus(props.vacation);
                return;
            }
            // if the vacation is not followed by the user - follow it
            setIsFollowed(true);
            await followersService.addFollower(follow);
            props.vacation.followersCount++;
            if (isNaN(props.vacation.followersCount)) {
                props.vacation.followersCount = 1;
            }
            setIconColor("red");
            props.changeStatus(props.vacation);
        }
        catch (err) {
            notifyService.error(err);
        }
    }

    return (
        <div className="VacationCard Box">
            <div>
                <div className="title"><b>{props.vacation.destination}</b></div>
                <div className='buttons'>
                    {!isAdmin
                        ? (<>
                            <span>{props.vacation.followersCount}</span>
                            <IconButton aria-label="settings" onClick={followVacation} style={{ color: iconColor }}>
                                <FcLike title="Follow" className='like' />
                            </IconButton>
                            <br />
                        </>)
                        : (
                            <>
                                <IconButton aria-label="settings" onClick={() => editVacation(props.vacation.id)}>
                                    <MdModeEditOutline title="Edit" />
                                </IconButton>
                                <IconButton aria-label="settings" onClick={() => deleteVacation(props.vacation.id)}>
                                    <MdOutlineHighlightOff title="Delete" />
                                </IconButton>
                            </>)}
                </div>
                <img src={config.urls.vacationImages + props.vacation.imageName} alt='' />
                <div className="description">{props.vacation.description}</div>
                <div className='bottom-vacation-card'>
                    <div>
                        <b>From:</b> {new Date(props.vacation.fromDate).toDateString().slice(0, 16)} &#160; - &#160; <b>To:</b> {new Date(props.vacation.toDate).toDateString()}
                        <h3 style={{ marginTop: '10px' }}><b>{props.vacation.price}$</b></h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default VacationCard;
