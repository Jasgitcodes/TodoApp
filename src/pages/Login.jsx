import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleAuthProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";


export default function LoginPage(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(false);

    const signInWithEmailAndPasswordHandler = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // console.log("User logged in successfully");
            alert("User Logged In Successfully");
            props.setIsAuth(true)
            navigate("/");
        } catch (err) {
            alert("user not found, please sign up");
            navigate("/SignUp");
            console.log(err);
        }
    }

    const signInWithGoogle = async (e) => {
        e.preventDefault();
        try {
            await signInWithPopup(auth, googleAuthProvider);
            navigate("/");
            props.setIsAuth(true)
        } catch (err) {
            {
                alert("Error signing in with Google");
                console.log(err)

            }
        }
    }
    return (

        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="bg-gray-200/50 p-8 mx-24 rounded-lg shadow-md w-full max-w-sm md:max-w-md">
                <div className="mb-6 text-center">

                    <h1 className="text-xl font-bold md-2">
                        Todo App | Login
                    </h1>
                    <p className="text-gray-600 text-sm italic">Enter Your Login Details</p>
                </div>
                <form className="space-y-6">
                    <div>
                        <label className="block mb-1 font-medium" htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium" htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        onClick={signInWithEmailAndPasswordHandler}
                    >
                        Sign In
                    </button>
                    <button
                        type="submit"
                        className='w-full bg-green-400 text-white py-2 rounded-lg hover:bg-green-500 transition-colors'
                        onClick={signInWithGoogle}
                    >
                        Sign in With Google
                    </button>
                    <Link to={"/Signup"} className="flex justify-center -mt-2">
                        <p className="text-gray-600 text-md italic font-light">Don't have an Account?</p>
                    </Link>
                </form>

            </div>
        </div>
    )
}