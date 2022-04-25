import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import CredentialsModel from "../../../Models/CredentialsModel";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import "./Login.css";

interface LoginProps {
    changeStatus: (status: string) => void;
}

function Login(props: LoginProps): JSX.Element {

    const navigator = useNavigate();
    const { register, handleSubmit, formState, setValue } = useForm<CredentialsModel>();

    async function submit(credentials: CredentialsModel) {
        try {
            await authService.login(credentials);
            notifyService.success("You are now logged in");
            navigator("/vacations");

        }
        catch (err: any) {
            notifyService.error(err);
        }
    }

    return (
        < div className="Login Box" >
            <h2>Login</h2>

            <form onSubmit={handleSubmit(submit)}>

                <label>Username: </label>
                <input type="text" {...register("username", {
                    required: { value: true, message: "Missing username" },
                    minLength: { value: 2, message: "Username must be minimum 2 chars" },
                    maxLength: { value: 50, message: "Username can't exceed 50 chars" },
                })} />
                <span>{formState.errors.username?.message}</span>

                <label>Password: </label>
                <input type="password" {...register("password", {
                    required: { value: true, message: "Missing password" },
                    minLength: { value: 2, message: "Password must be minimum 2 chars" },
                    maxLength: { value: 128, message: "Password can't exceed 128 chars" },
                })} />
                <span>{formState.errors.password?.message}</span>

                <button>Login</button>

                <div onClick={() => props.changeStatus("register")}><b>Don't have an account yet? <u>Register</u></b></div>

            </form>

        </div >
    );
}

export default Login;
