import PropTypes from "prop-types"
function CarPost({ car }) {
    return (
        <div className="car-post">
            <h3>{car.brand}</h3>
            <p>{car.model}</p>
            <p>{car.year}</p>
            <p>{car.price}</p>
        </div>
    );
}

CarPost.propTypes = {
    car: PropTypes.shape({
        brand: PropTypes.string.isRequired,
        model: PropTypes.string.isRequired,
        year: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
    }).isRequired,
};

export default CarPost;
