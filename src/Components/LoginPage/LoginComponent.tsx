import { Dispatch, SetStateAction } from "react";
import { User } from "~/types/User";
import { useForm } from 'react-hook-form';

export type userSetter = Dispatch<SetStateAction<User | null>>

interface signInForm {
    email: string,
    password: string,
}
const SignInComponent = ({ setUser } : { setUser: userSetter }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<signInForm>();

    const signin = async (data: signInForm) => {
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
            })
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
            <label>Password:</label>
            <input 
                {...register("password", { 
                    required: "This field is required"
                })}
                type="text"/>
            <br/>
            <button onClick={handleSubmit(signin)}>Sign In</button>
        </div>
    )
}

const LoginComponent = ({ setUser } : { setUser: userSetter }) => {
    return (
        <div className="h-screen w-full flex mx-auto items-center">
            <div id="login-form-container" className="w-2/3 h-2/3 lg:w-1/2 mx-auto bg-red-200 shadow-lg rounded px-8 py-12">
                <SignInComponent setUser={setUser} />
            </div>
        </div>
    )
}

export default LoginComponent;