import "../Styles/NavBar.css"
import filtersImg from "../images/filters.png";
import addPostImg from "../images/addPost.png";
import notificationsImg from "../images/notifications.png";
import settingsImg from "../images/settings.png"
import loginRegisterImg from "../images/loginNavBarPhoto.png"
import { Link } from "react-router-dom"

export function NavBar() {
    return (
        <div className="navBar">
            <div className="filter button"><img src={filtersImg} alt="filter-window"></img></div>
            <Link to="/" className="Home button"><p>AUTOMINUS</p></Link>
            <div className="buttons">
                <Link to="/Posting" className="Post button"><img src={addPostImg} alt="add-post"></img></Link>
                <div className="Notifications button"><img src={notificationsImg} alt="notifications"></img></div>
                <div className="Settings button"><img src={settingsImg} alt="settings"></img></div>
                <Link to= "/l" className="LoginRegister-button"><img src={loginRegisterImg} alt="LoginRegister"></img></Link>
            </div>
        </div>
    );
}

export default NavBar;