import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../Styles/AccountPage.css";
import NavBar from "../components/NavBar";

function AccountPage() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalField, setModalField] = useState("");
    const [modalKey, setModalKey] = useState("");
    const [modalValue, setModalValue] = useState("");
    const [fields, setFields] = useState({
        email: "",
        password: "********",
        firstName: "-",
        lastName: "-",
        phone: "-",
        city: "-",
        street: "-",
        address: "-"
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) return;

        fetch(`https://localhost:7193/User/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Nepavyko gauti duomenų");
                return res.json();
            })
            .then(data => {
                setFields({
                    email: data.email || "",
                    password: "********",
                    firstName: data.firstName || "-",
                    lastName: data.lastName || "-",
                    phone: data.phoneNumber || "-",
                    city: data.city || "-",
                    street: data.street || "-",
                    address: data.address || "-"
                });
            })
            .catch(err => {
                console.error("Klaida gaunant vartotojo duomenis:", err);
            });
    }, []);

    const openModal = (key, label) => {
        setModalKey(key);
        setModalField(label);
        setModalValue(fields[key]);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalField("");
        setModalKey("");
        setModalValue("");
    };

    const fieldMapToServer = {
        phone: "phoneNumber",
        firstName: "firstName",
        lastName: "lastName",
        city: "city",
        street: "street",
        address: "address"
    };

    const saveModal = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) return;

        try {
            const res = await fetch(`https://localhost:7193/User/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const originalUser = await res.json();
            const keyForServer = fieldMapToServer[modalKey] || modalKey;

            // naudoti jau atnaujintus fields reikšmes
            const updatedUser = {
                ...originalUser,
                firstName: fields.firstName,
                lastName: fields.lastName,
                city: fields.city,
                street: fields.street,
                address: fields.address,
                phoneNumber: fields.phone,
                [keyForServer]: modalValue, // perrašo tą vieną keistą reikšmę

                normalizedEmail: originalUser.normalizedEmail || "",
                normalizedUserName: originalUser.normalizedUserName || "",
                emailConfirmed: originalUser.emailConfirmed ?? true,
                passwordHash: originalUser.passwordHash || "",
                securityStamp: originalUser.securityStamp || "",
                concurrencyStamp: originalUser.concurrencyStamp || "",
                phoneNumberConfirmed: originalUser.phoneNumberConfirmed ?? true,
                twoFactorEnabled: originalUser.twoFactorEnabled ?? false,
                lockoutEnd: originalUser.lockoutEnd ?? null,
                lockoutEnabled: originalUser.lockoutEnabled ?? false,
                accessFailedCount: originalUser.accessFailedCount ?? 0
            };

            const putRes = await fetch(`https://localhost:7193/User/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedUser)
            });

            if (!putRes.ok) throw new Error("Nepavyko išsaugoti");

            setFields(prev => ({ ...prev, [modalKey]: modalValue }));
            closeModal();
            console.log("✅ Duomenys atnaujinti");
        } catch (err) {
            console.error("❌ Klaida išsaugant:", err.message);
            alert("Nepavyko išsaugoti. Žr. konsolę.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        navigate("/");
    };
    
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Ar tikrai norite ištrinti paskyrą? Šis veiksmas negalimas!");
        if (!confirmDelete) return;
    
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
    
        if (!token || !userId) {
            alert("Prisijungimo duomenys nerasti. Prisijunkite iš naujo.");
            return;
        }
    
        try {
            const deleteRes = await fetch(`https://localhost:7193/User/${userId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
    
            if (!deleteRes.ok) throw new Error("Nepavyko ištrinti paskyros");
    
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            navigate("/");
            alert("Paskyra sėkmingai ištrinta.");
    
        } catch (err) {
            console.error("❌ Klaida trinant paskyrą:", err.message);
            alert("Nepavyko ištrinti paskyros. Bandykite dar kartą.");
        }
    };
    

    return (
        <div>
            <NavBar className="NavBar" />
            <div className="account-page">
                <h1 className="page-title">Profilio nustatymai</h1>

                <div className="section">
                    <h2 className="section-title">Prisijungimo nustatymai</h2>
                    <div className="field">
                        <label>El. paštas:</label>
                        <div className="field-value">
                            <span>{fields.email}</span>
                            <button className="edit-button" disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>Keisti</button>
                        </div>
                    </div>
                    <div className="field">
                        <label>Slaptažodis:</label>
                        <div className="field-value">
                            <span>{fields.password}</span>
                            <button className="edit-button" disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>Keisti</button>
                        </div>
                    </div>
                </div>

                <div className="section">
                    <h2 className="section-title">Vartotojo duomenys</h2>
                    <div className="field">
                        <label>Vardas:</label>
                        <div className="field-value">
                            <span>{fields.firstName}</span>
                            <button className="edit-button" onClick={() => openModal("firstName", "Vardas")}>Keisti</button>
                        </div>
                    </div>
                    <div className="field">
                        <label>Pavardė:</label>
                        <div className="field-value">
                            <span>{fields.lastName}</span>
                            <button className="edit-button" onClick={() => openModal("lastName", "Pavardė")}>Keisti</button>
                        </div>
                    </div>
                    <div className="field">
                        <label>Telefonas:</label>
                        <div className="field-value">
                            <span>{fields.phone}</span>
                            <button className="edit-button" onClick={() => openModal("phone", "Telefonas")}>Keisti</button>
                        </div>
                    </div>
                    <div className="field">
                        <label>Miestas:</label>
                        <div className="field-value">
                            <span>{fields.city}</span>
                            <button className="edit-button" onClick={() => openModal("city", "Miestas")}>Keisti</button>
                        </div>
                    </div>
                    <div className="field">
                        <label>Gatvė:</label>
                        <div className="field-value">
                            <span>{fields.street}</span>
                            <button className="edit-button" onClick={() => openModal("street", "Gatvė")}>Keisti</button>
                        </div>
                    </div>
                    <div className="field">
                        <label>Adresas (namo numeris):</label>
                        <div className="field-value">
                            <span>{fields.address}</span>
                            <button className="edit-button" onClick={() => openModal("address", "Adresas (namo numeris)")}>Keisti</button>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", marginTop: "2rem", gap: "1rem" }}>
                    <button className="logout-button" onClick={handleLogout}>Atsijungti</button>
                    <button className="delete-button" onClick={handleDeleteAccount}>Naikiniti paskyrą</button>
                </div>

                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>Redaguoti: {modalField}</h3>
                            <input
                                type="text"
                                value={modalValue}
                                onChange={(e) => setModalValue(e.target.value)}
                                className="modal-input"
                            />
                            <div className="modal-buttons">
                                <button onClick={saveModal} className="save-button">Išsaugoti</button>
                                <button onClick={closeModal} className="cancel-button">Atšaukti</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AccountPage;