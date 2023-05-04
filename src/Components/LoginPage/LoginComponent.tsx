import { Dispatch, SetStateAction, useState } from "react";
import { User } from "~/types/User";
import { useForm } from 'react-hook-form';

export type userSetter = Dispatch<SetStateAction<User | null>>

interface signInForm {
    email: string,
    password: string,
}
const SignInComponent = ({ setUser, setResetPwd,setLoading } : { setUser: userSetter, setResetPwd: any, setLoading:any}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<signInForm>();

    const signin = async (data: signInForm) => {
        setLoading(true);
        // call the signin API and get the user info
        const res = await fetch('/api/signin', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(t => t.json())
    
        // Set the user from the info in response
        if(!res.error) {
            setUser({
                name: res.name as string,
                email: res.email as string,
                role: res.role as string,
            })
        } else {
            alert(res.error.code)
            console.log(res.error)
        }
        setLoading(false);
    }

    return (
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
            <button onClick={handleSubmit(signin)}>Sign In</button>
            <br/>
            <button onClick={() => setResetPwd(true)}>Forgot password?</button>
        </div>
    )
}

const ForgotPwd = ({ setResetPwd } : {setResetPwd: any}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{email: string}>();

    const handleResetPwd = async (data: {email: string}) => {
        // call the signin API and get the user info
        const res = await fetch('/api/forgotPwd', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(t => t.json())
    
        // Set the user from the info in response
        if(!res.error) {
            alert("Please find the reset link sent to your mail")
        } else {
            alert(res.error.code)
            console.log(res.error)
        }
    }

    return (
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
            <button onClick={handleSubmit(handleResetPwd)}>Send Reset Mail</button>
            <br/>
            <button onClick={() => setResetPwd(false)}>Sign In</button>
        </div>
    )
}

const LoginComponent = ({ setUser, setLoading} : { setUser: userSetter,setLoading: any }) => {
    const [resetPwd, setResetPwd] = useState(false);
    return (
        <div className="h-screen w-full flex mx-auto items-center">
            <div id="login-form-container" className="w-2/3 h-2/3 lg:w-1/2 mx-auto bg-red-200 shadow-lg rounded px-8 py-12">
                {!resetPwd ? <SignInComponent setUser={setUser} setLoading={setLoading} setResetPwd={setResetPwd}/>
                            : <ForgotPwd setResetPwd={setResetPwd}/>}
                
            </div>
        </div>
    )
}

export default LoginComponent;