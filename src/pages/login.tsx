import { type NextPage } from "next";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { apiReq } from "~/utils";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "~/contexts/UserProvider";
import { ROLE } from "~/types";

interface signInForm {
    email: string,
    password: string,
}

const Login: NextPage = () => {
    const { login } = useContext(UserContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<signInForm>();

    let router = useRouter();
    const [isLoading, setLoading] = useState(false);
    if (isLoading) {
        return (<div role="status" className="h-screen flex items-center justify-center scale-200">
                    <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-red-200" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        if(!res.errorType) {
            login({
                firstName: res.firstName as string,
                lastName: res.lastName as string,
                email: res.email as string,
                role: res.role as ROLE,
            })
            router.push("/");
        } else {
            alert(res.message)
            console.log(res.error)
        }
        setLoading(false);
    }

    return (
        <div className="h-screen w-full flex mx-auto items-center">
            <div id="login-form-container" className="w-2/3 h-2/3 lg:w-1/2 mx-auto bg-red-200 shadow-lg rounded px-8 py-12">
                <div>
                    <label>Email:</label>
                    <input 
                        {...register("email", { 
                            required: "This field is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/i,
                                message: "Invalid email address", }
                        })}
                        type="text" name="email"/>
                    <br/>
                    {errors.email && errors.email.type == "required" && 
                    <><span className='text-red-700'>This field is required</span><br /></>}
                    {errors.email && errors.email.type == "pattern" && 
                    <><span className='text-red-700'>{errors.email.message}</span><br /></>}
                    <br/>
                    <label>Password:</label>
                    <input 
                        {...register("password", { 
                            required: "This field is required"
                        })}
                        type="text"/>
                    <br/>
                    <button onClick={handleSubmit(handleLogin)}>Sign In</button>
                    <br/>
                    <Link href={'/forgotPassword'}>Forgot password?</Link>
                </div>
            </div>
        </div>

    )
}

export default Login;