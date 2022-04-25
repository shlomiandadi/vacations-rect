import "./AddVacation.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import vacationsService from "../../../Services/VacationsService";
import VacationModel from "../../../Models/VacationModel";
import { NavLink } from "react-router-dom";
import { authStore } from "../../../Redux/Store";
import notifyService from "../../../Services/NotifyService";

function AddVacation(): JSX.Element {
    const isAdmin: boolean = authStore.getState().user?.isAdmin ? true : false;
    const navigate = useNavigate();
    const { register, handleSubmit, formState } = useForm<VacationModel>({ mode: 'all' });
    const [msgDate, setMsgDate] = useState('');

    async function submit(vacation: any) {
        try {
            if (vacation.fromDate > vacation.toDate) {
                setMsgDate(`To date must be greater than from date`);
                return;
        }
            await vacationsService.addVacation(vacation);
            notifyService.success("vacation has been added");
            navigate("/vacations");
        }
        catch (err: any) {
            notifyService.error(err);
        }
    }

    function today(): string {
        return new Date().toISOString().split("T")[0];
    }

    function twoDaysFromToday(): string {
        return (new Date(new Date().getTime() + (2 * 24 * 60 * 60 * 1000))).toISOString().split("T")[0];
    }

    return (
        <div className="AddVacation Box">

            {isAdmin && (
                <div className="link">
                    <NavLink to="/vacations">Vacations</NavLink>
                    <br />
                    <NavLink to="/vacations/graph">Graph</NavLink>
                </div>
            )}

            <h2>Add vacation</h2>

            <form onSubmit={handleSubmit(submit)}>

                <label>Destination: </label>
                <input type="text" {...register("destination", {
                    required: { value: true, message: "Missing destination" },
                    minLength: { value: 2, message: "destination must be minimum 2 chars" },
                    maxLength: { value: 50, message: "destination can't exceed 50 chars" }
                })} />
                <span>{formState.errors.destination?.message}</span>

                <label>Description: </label>
                <input type="text" {...register("description", {
                    required: { value: true, message: "Missing description" },
                    minLength: { value: 2, message: "description must be minimum 2 chars" },
                    maxLength: { value: 1500, message: "description can't exceed 1500 chars" }
                })} />
                <span>{formState.errors.description?.message}</span>

                <label>Image:</label>
                <input type="file" accept="image/*" {...register("image")} required />
                <span>{formState.errors.image?.message}</span>

                <label>From Date: </label>
                <input type="date" min={today()} {...register("fromDate", {
                    required: { value: true, message: "Missing from Date" }
                })} />

                <span>{formState.errors.toDate?.message}</span>


                <label>To Date: </label>
                <input type="date" min={twoDaysFromToday()} {...register("toDate", {
                    required: { value: true, message: "Missing to Date" }
                })} />

                <span>{formState.errors.toDate?.message}</span>
                <span>{msgDate}</span>

                <label>Price: </label>
                <input type="number" {...register("price", {
                    required: { value: true, message: "Missing price" },
                    min: { value: 50, message: "price must be minimum 50$" },
                    max: { value: 30000, message: "price can't exceed 30,000$ " }
                })} step="0.01" />
                <span>{formState.errors.price?.message}</span>

                <button>Add</button>

            </form>
            <NavLink to="/vacations">Back   </NavLink>

        </div>
    );
}

export default AddVacation;
