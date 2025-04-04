import "../Styles/NavBar.css";
import filtersImg from "../images/filters.png";
import addPostImg from "../images/addPost.png";
import notificationsImg from "../images/notifications.png";
import settingsImg from "../images/settings.png";
import loginRegisterImg from "../images/loginNavBarPhoto.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FilterWindow } from "./FilterWindow";
import PropTypes from "prop-types"


export function NavBar({ onFiltersChange }) {
    const [showFilters, setShowFilters] = useState(false);
    const [currentFilters, setCurrentFilters] = useState(null);

    const handleApplyFilters = (filters) => {
        setCurrentFilters(filters);
        onFiltersChange(filters); // Pass filters to parent component
    };

    return (
        <div className="navBar">
            <div className="filter button" onClick={() => setShowFilters(true)}>
                <img src={filtersImg} alt="filter-window" />
            </div>

            {showFilters && (
                <FilterWindow
                    onClose={() => setShowFilters(false)}
                    onApplyFilters={handleApplyFilters}
                    initialFilters={currentFilters}
                />
            )}

            <Link to="/" className="Home button">
                <p>AUTOMINUS</p>
            </Link>
            <div className="buttons">
                <Link to="/Posting" className="Post button">
                    <img src={addPostImg} alt="add-post" />
                </Link>
                <div className="Notifications button">
                    <img src={notificationsImg} alt="notifications" />
                </div>
                <div className="Settings button">
                    <img src={settingsImg} alt="settings" />
                </div>
                <Link to="/l" className="LoginRegister-button">
                    <img src={loginRegisterImg} alt="LoginRegister" />
                </Link>
            </div>
        </div>
    );
}

NavBar.propTypes = {
    onFiltersChange: PropTypes.func.isRequired,
};


export default NavBar;