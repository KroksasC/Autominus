import CarPost from "../components/CarPost"; 
import PropTypes from "prop-types"

function Home({ car_list }) {
    return (
        <div>
            <div className="car-posts">
                {car_list.length === 0 ? (
                    <p>Loading cars...</p>
                ) : (
                    car_list.map(car => <CarPost key={car.id} car={car} />) 
                )}
            </div>
        </div>
    );
}

Home.propTypes = {
    car_list: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired
        })
    ).isRequired,
};

export default Home;
