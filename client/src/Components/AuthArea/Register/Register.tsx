import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import UserModel from "../../../Models/UserModel";
import authService from "../../../Services/AuthService";
import "./Register.css";
import notifyService from "../../../Services/NotifyService";

interface RegisterProps {
    changeStatus: (status: string) => void;
}


function Register(props: RegisterProps): JSX.Element {

    const { register, handleSubmit, formState, setValue } = useForm<UserModel>({ mode: "onBlur" });
    const navigator = useNavigate();

    async function VerifyUsername(username: any) {
        try {
            const isUsername = await authService.checkUsername(username);
            if (isUsername) return false;
            if (!isUsername) return true;
        } catch (err: any) {
            notifyService.error(err);
        }
    }

    async function submit(user: UserModel) {
        try {
            await authService.register(user);
            notifyService.success("You are registered");
            navigator("/vacations");

        }
        catch (err: any) {
            notifyService.error(err);
        }
    }

    return (
        <div className="Register Box">

            <h2>Register</h2>

            <form onSubmit={handleSubmit(submit)}>

                <div onClick={() => props.changeStatus("login")}><b>Have an account? <u>Login </u></b></div><br />

                <label>First name: </label>
                <input type="text" autoFocus {...register("firstName", {
                    required: { value: true, message: "Missing first name" },
                    minLength: { value: 2, message: "First name must be minimum 2 chars" },
                    maxLength: { value: 128, message: "First name can't exceed 128 chars" },
                })} />
                <span>{formState.errors.firstName?.message}</span>

                <label>Last name: </label>
                <input type="text" {...register("lastName", {
                    required: { value: true, message: "Missing last name" },
                    minLength: { value: 2, message: "Last name must be minimum 2 chars" },
                    maxLength: { value: 128, message: "Last name can't exceed 128 chars" },
                })} />
                <span>{formState.errors.lastName?.message}</span>


                <label>Username: </label>
                <input type="text" {...register("username", {
                    required: { value: true, message: "Missing username" },
                    minLength: { value: 2, message: "Username must be minimum 2 chars" },
                    maxLength: { value: 128, message: "Username can't exceed 128 chars" },
                    validate: { value: async username => await VerifyUsername(username) === true || "Please Choose other username" },
                })} />
                <span>{formState.errors.username?.message}</span>

                <label>Password: </label>
                <input type="password" {...register("password", {
                    required: { value: true, message: "Missing password" },
                    minLength: { value: 4, message: "Password must be minimum 4 chars" },
                    maxLength: { value: 128, message: "Password can't exceed 128 chars" },
                })} />
                <span>{formState.errors.password?.message}</span>
                <button>Register</button>
            </form>
        </div>
    );
}
export default Register;
