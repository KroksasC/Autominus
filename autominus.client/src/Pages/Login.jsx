import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/LoginAndRegistration.css";
import Swal from 'sweetalert2';
import NavBar from "../components/NavBar";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberme, setRememberme] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "rememberme") setRememberme(e.target.checked);
    };

    const handleRegisterClick = () => {
        navigate("/r");
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Užpildykite visus laukus.");
            return;
        }


        try {
            const response = await fetch("/log", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Needed for cookies (if using session cookies)
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Neteisingi prisijungimo duomenys.");
            }

            const data = await response.json();
            console.log("Response Data:", data);

            // Store user info
            if (data.userId) {
                localStorage.setItem("userId", data.userId);
            }
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            if (data.email) {
                localStorage.setItem("email", data.email);
            }
            console.log(localStorage.getItem("userId"));
            window.location.href = "/";
        } catch (error) {
            console.error(error);
            Swal.fire('Oops!', 'Įvyko klaida, bandykite dar kartą!', 'error');
        }
    };

    return (
        <div>
            <NavBar className="NavBar" />
        <div className="containerbox">
        <h3 className="login-heading1">Prisijungti</h3>
        <form onSubmit={handleSubmit}>
                <div>
                    <label className="forminput" htmlFor="email">
                        El. paštas:
                    </label>
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
                    <div className= "password-wrapper">
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
                <div className="checkbox-container">
                      <label htmlFor="rememberme">
                        <input
                          type="checkbox"
                          id="rememberme"
                          name="rememberme"
                          checked={rememberme}
                          onChange={handleChange}
                        />
                        <span>Prisiminti mane</span>
                      </label>
                </div>
                <div>
                    <button type="submit">Prisijungti</button>
                </div>
                <div>
                    <button type="button" onClick={handleRegisterClick}>
                        Registruotis
                    </button>
                </div>
            </form>
            {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}

export default Login;