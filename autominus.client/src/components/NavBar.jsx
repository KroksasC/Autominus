import "../Styles/NavBar.css";
import filtersImg from "../images/newFilter.png";
import addPostImg from "../images/newAdd.png";
import loginRegisterImg from "../images/newProfile.png";
import { Link } from "react-router-dom";
import { FilterWindow } from "./FilterWindow";
import PropTypes from "prop-types"
import { useState } from "react";
import favImg from "../images/FavNav.png";




export function NavBar({ onFiltersChange }) 
{
    const [showFilters, setShowFilters] = useState(false);
    const [currentFilters, setCurrentFilters] = useState(null);


    const handleApplyFilters = (filters) => 
        {
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

            <Link to="/" className="Home">
            <h3 className="login-heading"> 
                <span>AUTOMINUS</span> 
                </h3>
            </Link>

            <div className="buttons">
                <Link to="/Posting" className="Post button">
                    <img src={addPostImg} alt="add-post" />
                </Link>
                <Link to="/Favorites" className="Post button">
                    <img src={favImg} alt="Favorites" className="favorites-icon"/>
                </Link>


                {localStorage.getItem("userId") ?
                (
                    <Link to="/AccountPage" className="LoggedIn-button">
                        <img src={loginRegisterImg} alt="LoginRegister" />
                    </Link>
                ) : 
                    <Link to="/l" className="LoginRegister-button">
                        <img src={loginRegisterImg} alt="LoginRegister" />
                    </Link>
                }
            </div>
        </div>
    );
}

NavBar.propTypes = {
    onFiltersChange: PropTypes.func.isRequired,
};


export default NavBar;