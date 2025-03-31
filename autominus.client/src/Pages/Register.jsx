import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/LoginAndRegistration.css";
import Swal from 'sweetalert2';

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/l");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "confirmPassword") setConfirmPassword(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
        } else if (password !== confirmPassword) {
            setError("Passwords do not match.");
        } else {
            setError("");
            fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            })
                .then((data) => {
                    console.log(data);
                    if (data.ok) {
                        Swal.fire("Successful register.", 'Your action was successful. Now, login', 'success');
                        navigate("/l");
                    } else {
                        Swal.fire('Oops!', 'Something went wrong, try again!', 'error');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    Swal.fire('Oops!', 'Something went wrong, try again!', 'error');
                });
        }
    };

    return (
        <div className="containerbox">
            <h3>Register</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                </div>
                <div>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                </div>
                <div>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                </div>
                <div>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
                <div>
                    <button type="button" onClick={handleLoginClick}>
                        Go to Login
                    </button>
                </div>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default Register;