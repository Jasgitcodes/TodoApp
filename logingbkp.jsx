import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFirestore } from "firebase/firestore";
import { auth } from "../firebase";
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";

export default function HomePage() {
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);

    const navigate = useNavigate();
    const db = getFirestore();
    const todosCollectionRef = collection(db, "todos");

    // ✅ Auth Listener
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) setEmail(user.email);
            else setEmail("");
        });
        return unsubscribe;
    }, []);

    // ✅ Query Reference (must be before useEffect)
    const queryRef = query(todosCollectionRef, orderBy("createdAt"));

    // ✅ Fetch todos once (NO duplicates)
    useEffect(() => {
        const unsubscribe = onSnapshot(queryRef, (snapshot) => {
            const todosData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTodos(todosData);
        });

        return unsubscribe;
    }, []);

    // ✅ Add todo
    const addTodo = async (e) => {
        e.preventDefault();
        try {
            if (!title || !description) return alert("Please fill in all fields");

            await addDoc(todosCollectionRef, {
                title,
                description,
                createdAt: serverTimestamp(),
                author: {
                    email: auth.currentUser.email,
                    id: auth.currentUser.uid,
                },
            });

            setTitle("");
            setDescription("");

        } catch (err) {
            console.log("Error adding todo:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-200/20 w-full mx-auto flex flex-col gap-6 mb-8">

            {/* ✅ Navbar */}
            <nav className="p-4 w-full max-w-3xl mx-auto flex justify-between items-center border-b">
                <Link to="/"><h1 className="text-2xl font-bold">Todo App</h1></Link>

                <div className="flex gap-6 items-center">
                    <div>{email}</div>
                    <button
                        className="px-4 py-2 shadow-md hover:bg-gray-100 rounded-xl"
                        onClick={() => {
                            auth.signOut();
                            navigate("/login");
                        }}
                    >
                        Logout
                    </button>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">SignUp</Link>
                </div>
            </nav>

            {/* ✅ Add Todo */}
            <div className="max-w-3xl bg-gray-200 mt-10 p-6 rounded-md shadow w-full">
                <h3 className="text-xl font-semibold mb-2">Add Your Todo</h3>

                <div className="flex flex-col gap-6">
                    <input
                        type="text"
                        placeholder="Title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="p-3 rounded-md bg-white"
                    />

                    <textarea
                        placeholder="Description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="p-3 rounded-md bg-white"
                    />

                    <button
                        onClick={addTodo}
                        className="border border-green-400 bg-gray-50 hover:bg-green-400 hover:text-white px-6 py-2 w-2/4 self-center rounded-md"
                    >
                        Add Todo
                    </button>
                </div>
            </div>

            {/* ✅ Todo List */}
            <div className="max-w-3xl bg-gray-200 p-6 rounded-md shadow w-full">
                <h3 className="text-xl font-bold mb-2">Todo(s)</h3>

                {todos.map((todo) => (
                    <div key={todo.id} className="bg-white p-4 rounded-md shadow-md mb-3">
                        <h3 className="font-semibold text-xl">{todo.title}</h3>
                        <p>{todo.description}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}
