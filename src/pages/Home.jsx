import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getFirestore } from "firebase/firestore";
import { db, auth } from "../firebase"
import { useEffect } from "react";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp
} from "firebase/firestore";

export default function HomePage({ isAuth }) {
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);
    const db = getFirestore();
    const todosCollectionRef = collection(db, "todos");
    const queryRef = query(todosCollectionRef, orderBy("createdAt"));

    const deletebtn = async (id) => {
        const todoDoc = doc(db, "todos", id);
        await deleteDoc(todoDoc);
    };

    // ✅ Listen for logged-in user
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setEmail(user.email);
            } else {
                setEmail("");
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(queryRef, (snapshot) => {

            setTodos(snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })));
        });
        return unsubscribe;
    }, []);

    const addTodo = async (e) => {
        e.preventDefault();
        try {
            if (title && description) {
                await addDoc(todosCollectionRef, {
                    title,
                    description,
                    createdAt: serverTimestamp(),
                    author: {
                        name: auth.currentUser.email,
                        id: auth.currentUser.uid
                    }
                });
                setTitle("");
                setDescription("");
            } else { alert("Please fill in all fields") }
        } catch (err) {
            console.log("Error adding todo:", err);
        }
    };


    useEffect(() => {
        if (!isAuth) {
            navigate("/signup") //react-router-dom
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-200/20   w-full mx-auto flex flex-col justify-start items-center gap-6 mb-8 rounded-sm">
            <div className="w-full ">


                <nav className="p-4 w-full max-w-3xl text-md mx-auto flex justify-between items-center border-b">
                    <div>

                        <Link to="/"> <h1 className="text-2xl font-bold">Todo App</h1> </Link>
                    </div>
                    <div className="flex gap-6 justify-between items-center">

                        <div className="">{email}</div>
                        <button
                            id='logout'
                            className="px-4 py-2 shadow-md hover:bg-gray-100 transition-all ease-in duration-150 rounded-xl"
                            onClick={() => {
                                auth.signOut();
                                navigate("/login");
                            }}
                        >
                            Logout
                        </button>
                        <Link to={"/login"}>Login</Link>
                        <Link to={"/signup"}>SignUp</Link>
                    </div>
                </nav>
            </div>
            <div className="max-w-3xl flex flex-col bg-gray-200 mt-10 p-6 gap-3 rounded-md shadow w-full">
                <h3 className="text-xl font-semibold mb-2 ">Add Your Todo</h3>
                <div className="flex flex-col py-2 gap-6 text-md">
                    <input
                        type="text"
                        placeholder="Title..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="p-3 rounded-md shadow-sm w-full bg-white"
                    />
                    <textarea
                        name="Description"
                        placeholder="Description..."
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="p-3 rounded-md shadow-sm w-full bg-white">
                    </textarea>
                    <button
                        className="cursor-pointer  border-green-400 border bg-gray-50  self-center hover:bg-green-400 hover:text-white text-black px-6 py-2 w-2/4 rounded-md transition-all ease-in-out duration-150"
                        onClick={addTodo}
                    >
                        Add Todo
                    </button>
                </div>
            </div>
            <div className="max-w-3xl flex flex-col bg-gray-200  p-6 gap-3 rounded-md shadow w-full">
                {todos.map((todo, index) => {
                    return (
                        isAuth && todo.author.id === auth.currentUser.uid && (
                            <div key={todo.id} className="bg-white p-4 rounded-md shadow-md flex flex-col gap-3">
                                <h3 className="font-semibold text-xl">{todo.title}</h3>
                                <p>{todo.description}</p>
                                {
                                    isAuth && todo.author.id === auth.currentUser.uid && (<footer onClick={() => deletebtn(todo.id)}>&#128465;</footer>)
                                }
                            </div>
                        )
                    )
                })}

            </div>
        </div>

    )
}
