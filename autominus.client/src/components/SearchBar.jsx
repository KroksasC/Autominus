import { useState } from "react";
import "../Styles/SearchBar.css";
import PropTypes from "prop-types";

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <div className="search-bar-container">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search cars by brand, model, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
        </div>
    );
}

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
};


export default SearchBar;