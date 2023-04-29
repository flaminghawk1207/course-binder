import { Dispatch, SetStateAction, useState } from "react";
import jwt from 'jsonwebtoken'
import { User } from "~/types/User";
import { useForm } from 'react-hook-form';

export type userSetter = Dispatch<SetStateAction<User | null>>
interface signUpForm {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string,
}

const SignUpComponent = ({ redirectToSignIn } : {redirectToSignIn: () => void}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<signUpForm>();

    const signup = async (data: signUpForm) => {
        const res = await fetch('/api/signup', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(t => t.json())

        if(!res.error) {
            redirectToSignIn()
        } else {
            alert(res.error)
            console.log(res.error)
        }
    }

    return (
        <div>
            <label>First Name:</label>
            <input 
                {...register("firstName", { 
                    required: "This field is required", 
                })}
                type="text"/>
            <br/>
            {errors.firstName && 
            <><span className='text-red-700'>{errors.firstName.message}</span><br /></>}

            <label>Last Name:</label>
            <input 
                {...register("lastName", { 
                    required: "This field is required", 
                })}
                type="text"/>
            <br/>
            {errors.lastName && errors.lastName.type == "required" && 
            <><span className='text-red-700'>This field is required</span><br /></>}

            <label>Email:</label>
            <input 
                {...register("email", { 
                    required: "This field is required",
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/i,
                        message: "Invalid email address", }
                })}
                type="text"/>
            <br/>
            {errors.email && errors.email.type == "required" && 
            <><span className='text-red-700'>This field is required</span><br /></>}
            {errors.email && errors.email.type == "pattern" && 
            <><span className='text-red-700'>{errors.email.message}</span><br /></>}
            {errors.email && errors.email.type == "used" && 
            <><span className='text-red-700'>{errors.email.message}</span><br /></>}

            <label>Password:</label>
            <input 
                {...register("password", { 
                    required: "This field is required",
                    pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number",
                    }
                })}
                type="text"/>
            <br/>
            {errors.password && errors.password.type == "required" && 
            <><span className='text-red-700'>This field is required</span><br /></>}
            {errors.password && errors.password.type == "pattern" && 
            <><span className='text-red-700'>{errors.password.message}</span><br /></>}

            <label>Role:</label>
            <select 
                {...register("role", { 
                    required: "This field is required", 
                })}>
                <option value="admin">Admin</option>
                <option value="hod">HOD</option>
                <option value="faculty">Faculty</option>
            </select>
            <br/>
            {errors.role && 
            <><span className='text-red-700'>This field is required</span><br /></>}
            <button onClick={handleSubmit(signup)}>Sign Up</button>
        </div>
    )
}

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
        // call the api and get JWT
        const res = await fetch('/api/signin', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(t => t.json())
    
        // Set the user from the returned JWT
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
    const [signIn, setSignIn] = useState(true);

    return (
        <div className="h-screen w-full flex mx-auto items-center">
            <div id="login-form-container" className="w-2/3 h-2/3 lg:w-1/2 mx-auto bg-red-200 shadow-lg rounded px-8 py-12">
                <div id="login-button-group" className="flex mb-4 w-full bg-blue-500">
                    <button
                    className={`${
                        signIn
                        ? "bg-indigo-500 text-white"
                        : "bg-indigo-200 text-indigo-700"
                    } py-2 px-4 rounded-l flex-1`}
                    onClick={() => setSignIn(true)}
                    >
                    Sign In
                    </button>
                    <button
                    className={`${
                        !signIn
                        ? "bg-indigo-500 text-white"
                        : "bg-indigo-200 text-indigo-700"
                    } py-2 px-4 rounded-r flex-1`}
                    onClick={() => setSignIn(false)}
                    >
                    Sign Up
                    </button>
                </div>
                {signIn ? <SignInComponent setUser={setUser} /> : <SignUpComponent redirectToSignIn={() => setSignIn(true)} />}
            </div>
        </div>
    )
}

export default LoginComponent;