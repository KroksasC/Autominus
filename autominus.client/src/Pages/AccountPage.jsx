import { useNavigate } from "react-router-dom";

//Cia galima kurti account page
function AccountPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userId");
        navigate("/");
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default AccountPage;
