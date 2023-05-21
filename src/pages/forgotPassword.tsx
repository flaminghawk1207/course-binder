import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { apiReq } from "~/utils";

const ForgotPassword: NextPage = () => {
    let router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{email: string}>();

    const handleResetPwd = async (data: {email: string}) => {
        // call the signin API and get the user info
        const res = await apiReq('forgotPwd', data)
    
        // Set the user from the info in response
        if(!res.error) {
            alert("Please find the reset link sent to your mail")
            router.push("/");
        } else {
            alert(res.error.code)
            console.log(res.error)
        }
    }

    return (
        <div className="bg-primary-color h-screen w-full flex mx-auto items-center">
            <div id="login-form-container" className="w-2/3 h-2/3 lg:w-1/2 mx-auto bg-secondary-color shadow-lg rounded px-8 py-12 flex items-center justify-center">
                <div>
                    <h1 className="mb-2 mt-0 text-3xl font-small leading-tight text-primary-txt flex flex justify-center">Reset Password</h1>
                    <br/>
                    <label className="text-xl justify-center">Email:</label>
                    <input className="w-3/4"
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
                    <button className="bg-primary-color hover:bg-hovercolor text-black py-2 px-4 rounded" onClick={handleSubmit(handleResetPwd)}>Send Reset Mail</button>

                    <Link className="bg-primary-color hover:bg-hovercolor text-black py-2 px-4 rounded w-1/2 ml-10" href={"/login"}>Sign In</Link>
                    
                </div>
            </div>
        </div>
        
    )
}

export default ForgotPassword;