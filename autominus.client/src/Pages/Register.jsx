import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/LoginAndRegistration.css";
import Swal from 'sweetalert2';
import NavBar from "../components/NavBar";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password || !confirmPassword) {
            setError("Užpildykite visus laukus.");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Įveskite tinkamą el. pašto adresą.");
        } else if (password !== confirmPassword) {
            setError("Slaptažodžiai nesutampa.");
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
                        Swal.fire("Registracija sėkminga.", 'Jūs sėkmingai prisiregistravote. Dabar prisijunkite.', 'success');
                        navigate("/l");
                    } else {
                        Swal.fire('Oops!', 'Įvyko klaida, bandykite dar kartą!', 'error');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    Swal.fire('Oops!', 'Įvyko klaida, bandykite dar kartą!', 'error');
                });
        }
    };

    return (
        <div>
            <NavBar className="NavBar" />
        <div className="containerbox">
        <h3 className="login-heading">Registracija</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">El. paštas:</label>
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
                    <label htmlFor="password">Slaptažodis:</label>
                    </div>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                        />
                        <span className="toggle-password" onClick={togglePasswordVisibility}>
                            {showPassword ? "🙈" : "👁️"}
                        </span>
                    </div>
                <div>
                    <label htmlFor="confirmPassword">Patvirtinkite slaptažodį:</label>
                    </div>
                    <div className="password-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleChange}
                        />
                        <span className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                            {showConfirmPassword ? "🙈" : "👁️"}
                        </span>
                    </div>
                <div>
                    <button type="submit">Registruotis</button>
                </div>
                <div>
                    <button type="button" onClick={handleLoginClick}>
                        Prisijungti
                    </button>
                    </div>

            </form>
            {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}

export default Register;