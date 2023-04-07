import { useState } from "react";
import jwt from 'jsonwebtoken'
import { useRouter } from "next/router";
import { userSetter } from "~/types/User";
import Select from 'react-select'
import { useForm } from 'react-hook-form';

interface signUpForm {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string,
}

const SignUpComponent = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<signUpForm>();

    const router = useRouter();

    const signup = async (data: signUpForm) => {
        const res = await fetch('/api/signup', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(t => t.json())

        const created = res.created
        if(created) {
            // To return to the sign-in page
            // Possibly can be replaced with switch "tabs" in login component
            router.reload();
        } else {
            setError('email', { type: "used", message: "Email already in use"})
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

const SignInComponent = ({ setUser } : { setUser: userSetter }) => {
    // temporary state before login
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const signin = async (email: string, password: string) => {
        // call the api and get JWT
        const res = await fetch('/api/signin', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        }).then(t => t.json())
    
        const token = res.token

        // Set the user from the returned JWT
        if(token) {
            const tokenDecoded = jwt.decode(token) as { [key: string]: string }
            setUser({
                id: tokenDecoded.id as string,
                name: tokenDecoded.name as string,
                email: tokenDecoded.email as string,
                token: token as string,
                role: tokenDecoded.role as string,
            })
        } else {
            alert("Invalid credentials")
        }
    }

    return (
        <div>
            <label>Email:</label>
            <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <br/>
            <label>Password:</label>
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <br/>
            <input type="button" value="Login" onClick={() => signin(email, password)}/>
        </div>
    )
}

const LoginComponent = ({ setUser } : { setUser: userSetter }) => {
    const [signIn, setSignIn] = useState(true);

    // Probably use MUI?
    const getScreen = () => {
        if(signIn) {
            return <SignInComponent setUser={setUser}/>
        } else {
            return <SignUpComponent/>
        }
    }

    return (
        <>
            <button onClick={() => setSignIn(!signIn)}>Switch</button>
            {getScreen()}
        </>
    )
}

export default LoginComponent;