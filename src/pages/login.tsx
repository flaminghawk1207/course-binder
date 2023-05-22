import { type NextPage } from "next";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { apiReq } from "~/utils";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "~/contexts/UserProvider";
import { ROLE } from "~/types";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Key from "@mui/icons-material/Key";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Markunread from "@mui/icons-material/Markunread";
import { Typography } from "@mui/material";

interface signInForm {
    email: string,
    password: string,
}

const Login: NextPage = () => {
    const { user, login } = useContext(UserContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<signInForm>();

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user]);

    let router = useRouter();
    const [isLoading, setLoading] = useState(false);
    if (isLoading) {
        return (<div role="status" className="h-screen flex items-center justify-center scale-200">
                    <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-tertiary-color" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>);
    }

    const handleLogin = async (data: signInForm) => {
        setLoading(true);

        // call the signin API and get the user info
        const res = await apiReq('login', data)
    
        // Set the user from the info in response
        if(!res.error) {
            login({
                firstName: res.firstName as string,
                lastName: res.lastName as string,
                email: res.email as string,
                role: res.role as ROLE,
                department: res.department as string,
            })
        } else {
            alert(res.message)
            console.log(res.error)
        }
        setLoading(false);
    }

    return (        
            <div id="login-form-container" className="flex flex-col items-center justify-center h-screen bg-tertiary-color ">
                <Typography className="text-5xl mb-10 font-bold">Course Binder</Typography>
                <AccountCircle fontSize="large" className = "mb-10 text-7xl" /> 

                    <TextField
                        label="Email ID"
                        type="text"
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Markunread/>
                              </InputAdornment>
                            ),
                          }}                       
                        {...register("email", {
                            required: "This field is Required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/i,
                                message: "Invalid email address",
                            }
                        })}
                        error={errors.email !== undefined}
                        helperText={errors.email?.message}                        
                        />
                    <br />
                    <br />
                    <TextField
                        label="Password"
                        type="password"
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Key/>
                              </InputAdornment>
                            ),
                          }}
                        {...register("password", {
                            required: "This field is required"
                        })} />
                    <br />
                    <br />
                    <Button variant="outlined" className="bg-secondary-color text-primary-txt hover:bg-hovercolor " onClick={handleSubmit(handleLogin)}>Login</Button>
                    <br />
                    <Link href={'/forgotPassword'} id="forgotPasswordLink">
                        <div className="text-sky-500 underline text-base" >Forgot Password?</div>
                    </Link>
                </div>

    )
}

export default Login;