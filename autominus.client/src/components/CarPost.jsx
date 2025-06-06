import PropTypes from "prop-types";
import "../Styles/CarPost.css";
import { Link } from "react-router-dom";
import FavoriteToggleButton from "../components/FavoriteToggle";

function CarPost({ car }) {
    const carImage = car.imageUrls && car.imageUrls.length > 0
        ? car.imageUrls[0]
        : "https://via.placeholder.com/300x200?text=No+Image";

    const handleButtonClick = (e) => {
        e.preventDefault(); // prevent navigation
        e.stopPropagation(); // prevent link click
    };

    return (
        <Link to={`/${car.id}`} style={{ textDecoration: 'none' }}>
            <div className="car-post">
                <div className="info">
                    <p className="brand">{car.brand}</p>
                    <p className="model">{car.model}</p>
                    <p className="year">{car.year}</p>
                    <p className="price">{car.price}&euro;</p>
                </div>
                <div className="image-wrapper">
                    <img src={carImage} alt="Car" />
                    <div className="favorite-button" onClick={handleButtonClick}>
                        <FavoriteToggleButton car={car} />
                    </div>
                </div>
            </div>
        </Link>
    );
}

CarPost.propTypes = {
    car: PropTypes.shape({
        brand: PropTypes.string.isRequired,
        model: PropTypes.string.isRequired,
        year: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        id: PropTypes.number.isRequired,
        imageUrls: PropTypes.array.isRequired,
    }).isRequired,
};

export default CarPost;
