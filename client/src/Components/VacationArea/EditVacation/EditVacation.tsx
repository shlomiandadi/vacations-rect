import "./EditVacation.css";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import VacationModel from "../../../Models/VacationModel";
import vacationsService from "../../../Services/VacationsService";
import { NavLink } from "react-router-dom";
import notifyService from "../../../Services/NotifyService";

function EditVacation(): JSX.Element {

    const params: any = useParams();
    const id = +params.id;
    const navigate = useNavigate();
    const { register, handleSubmit, formState, setValue } = useForm<VacationModel>();
    const [msgDate, setMsgDate] = useState('');

    useEffect( () => {
        const fetchEditVacation = async () => {
            try {
                const vacation = await vacationsService.getOneVacation(id);
                setValue('destination', vacation.destination);
                setValue('description', vacation.description);
                setValue('fromDate', vacation.fromDate);
                setValue('toDate', vacation.toDate);
                setValue('price', vacation.price);
            } catch (err: any) {
                notifyService.error(err.message);
            }
        }
        fetchEditVacation();
    }, [id, setValue]);


    async function submit(vacation: any) {
        try {
            if (new Date(vacation.fromDate) > new Date(vacation.toDate)) {
                setMsgDate(`To date must be greater than from date`)
                return;
            }
            vacation.id = id;
            const updatedVacation = await vacationsService.updateVacation(vacation);
            notifyService.success(`${updatedVacation.destination} Vacation has been updated`);
            navigate("/vacations");
        }
        catch (err: any) {
            notifyService.error(err.message);
        }
    }

    return (
        <div className="EditVacation Box">

            <h2>Edit Vacation</h2>

            <form onSubmit={handleSubmit(submit)}>

                <label>Destination: </label>
                <input type="text"  {...register("destination", {
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
                <input type="file" accept="image/*" {...register("image")}
                />

                <label>From Date: </label>
                <input type="date" {...register("fromDate", {
                    required: { value: true, message: "Missing fromDate" },
                })} />
                <span>{formState.errors.fromDate?.message}</span>
                <span>{msgDate}</span>


                <label>To Date: </label>
                <input type="date" {...register("toDate", {
                    required: { value: true, message: "Missing toDate" },
                })} />
                <span>{formState.errors.toDate?.message}</span>


                <label>Price: </label>
                <input type="number" {...register("price", {
                    required: { value: true, message: "Missing price" },
                    min: { value: 50, message: "price must be minimum 50$" },
                    max: { value: 30000, message: "price can't exceed 30,000$" }
                })} step="0.01" />
                <span>{formState.errors.price?.message}</span>

                <NavLink to="/vacations">Back   </NavLink>
                <button>Edit</button>

            </form>

        </div>
    );
}

export default EditVacation;
