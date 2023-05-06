import { type NextPage } from "next";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { apiReq } from "~/utils";
import { useContext } from "react";
import { UserContext } from "~/contexts/UserProvider";

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

    const handleLogin = async (data: signInForm) => {
        // call the signin API and get the user info
        const res = await apiReq('login', data)
    
        // Set the user from the info in response
        if(!res.error) {
            login({
                name: res.name as string,
                email: res.email as string,
                role: res.role as string,
            })
            router.push("/");
        } else {
            alert(res.error.code)
            console.log(res.error)
        }
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