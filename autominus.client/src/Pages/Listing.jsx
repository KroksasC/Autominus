import { useState, useEffect } from "react";
import FetchCars from "../API/FetchCars";
import PropTypes from "prop-types";
import NavBar from "../components/NavBar";
import { useParams } from "react-router-dom";
import "../Styles/Listing.css";
import UserCard from "../components/UserCard";
import EditDeleteButtons from "../components/EditDeleteButtons";

function Listing() {
    const [carList, setCarList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const data = await FetchCars();
                setCarList(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const car = carList.find((car) => car.id.toString() === id);

    if (!car) {
        return <div>Automobilis nerastas</div>;
    }

    const formattedDate = car.technicalInspectionValidUntil?.slice(0, 10) || "Nenurodyta";
    const uploadTime = car.createdAt?.slice(0, 10) || "Nenurodyta";
    let accident = "Taip";
    let negotiable = "Ne";

    if (car.accidentHistory?.toString() === "false") accident = "Ne";
    if (car.negotiable?.toString() === "true") negotiable = "Taip";

    return (
        <div>
            <NavBar className="NavBar" />
            <br></br>
            <div className="flex-container">
                <div>
                    <table className="info-table">
                        <thead>
                            <tr>
                                <th colSpan="2">
                                    <div className="table-header">
                                        <h1>{car.brand} {car.model} {car.year}</h1>
                                        <EditDeleteButtons car={car} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="info-body">
                            <tr>
                                <td><strong>Kaina:</strong></td>
                                <td>{car.price} &euro;</td>
                            </tr>
                            <tr>
                                <td><strong>Rida:</strong></td>
                                <td>{car.mileage} km</td>
                            </tr>
                            <tr>
                                <td><strong>Pavarų dėžė:</strong></td>
                                <td>{car.transmission}</td>
                            </tr>
                            <tr>
                                <td><strong>Kuro tipas:</strong></td>
                                <td>{car.fuelType}</td>
                            </tr>
                            <tr>
                                <td><strong>Variklis:</strong></td>
                                <td>{car.engineCapacity} l, {car.horsepower} AG ({parseInt((car.horsepower * 0.745699872), 10)}KW)</td>
                            </tr>
                            <tr>
                                <td><strong>Varantieji ratai:</strong></td>
                                <td>{car.drivetrain}</td>
                            </tr>
                            <tr>
                                <td><strong>Spalva:</strong></td>
                                <td>{car.color}</td>
                            </tr>
                            <tr>
                                <td><strong>Durų skaičius:</strong></td>
                                <td>{car.doors}</td>
                            </tr>
                            <tr>
                                <td><strong>Sėdimos vietos:</strong></td>
                                <td>{car.seats}</td>
                            </tr>
                            <tr>
                                <td><strong>Valstybiniai numeriai:</strong></td>
                                <td>{car.registrationNumber}</td>
                            </tr>
                            <tr>
                                <td><strong>VIN:</strong></td>
                                <td>{car.vin}</td>
                            </tr>
                            <tr>
                                <td><strong>Automobilio būklė:</strong></td>
                                <td>{car.condition}</td>
                            </tr>
                            <tr>
                                <td><strong>Daužtas:</strong></td>
                                <td>{accident}</td>
                            </tr>
                            <tr>
                                <td><strong>Kaina derinama:</strong></td>
                                <td>{negotiable}</td>
                            </tr>
                            <tr>
                                <td><strong>Technikinė apžiūra galioja iki:</strong></td>
                                <td>{formattedDate}</td>
                            </tr>
                            <tr>
                                <td><strong>Skelbimas įkeltas:</strong></td>
                                <td>{uploadTime}</td>
                            </tr>
                            <tr>
                                <td><strong>Automobilio vieta:</strong></td>
                                <td>{car.location}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br></br>
                    <div className="item_width">
                        <div className="car-post-header">
                            <p className="desription">Aprašymas</p>
                            <p>{car.description} </p>
                        </div>
                    </div>
                    <br></br>
                    <UserCard user={car.user} />
                    <br></br>
                </div>
                <ul>
                    <li><img src="https://th.bing.com/th/id/OIP.cjUjzALkEKobv8G4Evr6GQHaEK?rs=1&pid=ImgDetMain" alt={car.brand} className="pic_width"></img></li>
                    <li><img src="https://th.bing.com/th/id/OIP.cjUjzALkEKobv8G4Evr6GQHaEK?rs=1&pid=ImgDetMain" alt={car.brand} className="pic_width"></img></li>
                    <li><img src="https://th.bing.com/th/id/OIP.cjUjzALkEKobv8G4Evr6GQHaEK?rs=1&pid=ImgDetMain" alt={car.brand} className="pic_width"></img></li>
                    {car.imageUrls?.map((url, index) => (
                        <li key={index}>
                            {/* src={url} */}
                            <img src="https://th.bing.com/th/id/OIP.cjUjzALkEKobv8G4Evr6GQHaEK?rs=1&pid=ImgDetMain" className="pic_width" alt={`Car ${index}`} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

Listing.propTypes = {
    car: PropTypes.shape({
        accidentHistory: PropTypes.bool,
        bodyType: PropTypes.string,
        brand: PropTypes.string,
        color: PropTypes.string,
        condition: PropTypes.string,
        createdAt: PropTypes.string,
        description: PropTypes.string,
        doors: PropTypes.number,
        drivetrain: PropTypes.string,
        engineCapacity: PropTypes.number,
        fuelType: PropTypes.string,
        horsepower: PropTypes.number,
        id: PropTypes.number,
        imageUrls: PropTypes.arrayOf(PropTypes.string),
        location: PropTypes.string,
        mileage: PropTypes.number,
        model: PropTypes.string,
        negotiable: PropTypes.bool,
        price: PropTypes.number,
        registrationNumber: PropTypes.string,
        seats: PropTypes.number,
        technicalInspectionValidUntil: PropTypes.string,
        transmission: PropTypes.string,
        vin: PropTypes.string,
        year: PropTypes.number,
        user: PropTypes.object
    })
};

export default Listing;