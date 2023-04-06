import { useState } from "react";
import jwt from 'jsonwebtoken'
import { useRouter } from "next/router";

const SignUpComponent = () => {
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [role, setRole] = useState<string>("faculty")

    const router = useRouter();

    const signup = async () => {
        const res = await fetch('/api/signup', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email, password, role })
        }).then(t => t.json())
        console.log(res)

        const created = res.created
        if(created) {
            // To return to the sign-in page
            // Possibly can be replaced with switch "tabs" in login component
            router.reload();
        } else {
            alert(res.message);
        }
    }

    return (
        <div>
            <label>First Name:</label>
            <input type="text" name="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
            <br/>
            <label>Last Name:</label>
            <input type="text" name="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
            <br/>
            <label>Email:</label>
            <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <br/>
            <label>Password:</label>
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <br/>
            <label>Role:</label>
            {["admin", "hod", "faculty"].map(curr_role => 
                    <div key={curr_role}>
                        <input type="radio" name="role" value={curr_role} 
                                checked={role == curr_role} onChange={(e) => setRole(e.target.value)}/>
                        {curr_role}
                    </div>
            )}
            <button onClick={signup}>Sign Up</button>
        </div>
    )
}

const SignInComponent = ({ setUser }) => {
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
            console.log(tokenDecoded)
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

const LoginComponent = ({ setUser }) => {
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