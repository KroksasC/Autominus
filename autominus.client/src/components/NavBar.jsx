import "../Styles/NavBar.css"
import filtersImg from "../images/filters.png";
import addPostImg from "../images/addPost.png";
import notificationsImg from "../images/notifications.png";
import settingsImg from "../images/settings.png"

export function NavBar() {
    return <div className="navBar">
        <div><img src={filtersImg} alt="filter-window"></img></div>
        <div><p>AUTOMINUS</p></div>
        <div className="buttons">
            <div><img src={addPostImg} alt="add-post"></img></div>
            <div><img src={notificationsImg} alt="notifications"></img></div>
            <div><img src={settingsImg} alt="settings"></img></div>
        </div>
    </div>
}

export default NavBar;