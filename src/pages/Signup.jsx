import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { auth, googleAuthProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function SignupPage(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const signUpWithEmailAndPassword = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created Successfully");
            props.setIsAuth(true)
            navigate("/");
        } catch (err) {
            if (err.code === "auth/weak-password") {
                setError("Password should be at least 6 characters.");
                // alert("Password should be at least 6 characters.");
            }
            else if (err.code === "auth/email-already-in-use") {
                setError("Email already exists. Please login instead.");
                // alert("Email already exists. Please login instead.");
            }
            else if (err.code === "auth/invalid-email") {
                setError("Invalid email format.");
                // alert("Invalid email format.");
            }
            else {
                setError("Error signing up. Please try again.");
                // alert("Error signing up. Please try again.");
            }
            console.log("Error signing up with email and password", err);
        }
    }

    const signUpWithGoogle = async (e) => {
        e.preventDefault();
        try {
            await signInWithPopup(auth, googleAuthProvider);
            props.setIsAuth(true)
            navigate("/");
        } catch (err) {
            console.log(err)
        };
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="bg-gray-200/50 p-8 mx-24 rounded-lg shadow-md w-full max-w-sm md:max-w-md">
                <div className="mb-6 text-center">

                    <h1 className="text-xl font-bold md-2">
                        Todo App | Sign Up
                    </h1>
                    <p className="text-gray-600 text-sm italic">provide your details to register</p>
                </div>
                {error && <p className="text-red-500 bg-red-50 text-center  rounded-md shadow-md mx-auto w-[80%] px-4 py-1  border-l-4 border-red-500 italic text-md mb-3">{error}</p>}
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
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        onClick={signUpWithEmailAndPassword}
                    >
                        Sign Up
                    </button>
                    <button
                        className='w-full bg-green-400 text-white py-2 rounded-lg hover:bg-green-500 transition-colors'
                        onClick={signUpWithGoogle}
                    >
                        Sign Up With Google
                    </button>
                    <Link to={"/Login"} className="flex justify-center -mt-2">
                        <p className="text-gray-600 text-md italic font-light">Already have an Account?</p>
                    </Link>
                </form>

            </div>
        </div>
    )
}