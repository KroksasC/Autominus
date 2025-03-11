import FetchCars from "../API/FetchCars";
import PropTypes from "prop-types"
import NavBar from "../components/NavBar";
import { useParams } from "react-router-dom";
import "../Styles/Listing.css"


function Listing() {
    const car_list = FetchCars();
    const { id } = useParams();

    const car = car_list.find((car) => car.id.toString() === id)

    if (!car) {
        return <div>{id}</div>;
    }

    return (
        <div>
            <NavBar className="NavBar" />
            <div>
                <p>{car.brand} {car.model}</p>
                <p>Pagaminta: {car.year}</p>
                <p>Kaina: {car.price}&euro;</p>
                <p>Spalva: {car.color}</p>
                <p>Durų skaičius: {car.doors}</p>
                <p>Varantieji ratai: {car.drivetrain}</p>
                <p>Kuro tipas: {car.fuelType}</p>
                <p>Variklio talpa: {car.engineCapacity} l.</p>
                <p>Galia: {car.horsepower} AG ({parseInt((car.horsepower * 0.745699872), 10)} KW)</p>
                <img src="https://th.bing.com/th/id/OIP.cjUjzALkEKobv8G4Evr6GQHaEK?rs=1&pid=ImgDetMain" alt={car.brand}></img>
            </div>
        </div>
    );
}

Listing.propTypes = {
    car: PropTypes.shape({
        brand: PropTypes.string.isRequired,
        model: PropTypes.string.isRequired,
        year: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        imageUrls: PropTypes.array.isRequired
    }).isRequired,
};

export default Listing;
