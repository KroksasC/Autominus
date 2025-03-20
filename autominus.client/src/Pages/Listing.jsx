import FetchCars from "../API/FetchCars";
import PropTypes from "prop-types"
import NavBar from "../components/NavBar";
import { useParams } from "react-router-dom";
import "../Styles/Listing.css"
import UserCard from "../components/UserCard"; 
import EditDeleteButtons from "../components/EditDeleteButtons"; 


function Listing() {
    const car_list = FetchCars();
    const { id } = useParams();

    const car = car_list.find((car) => car.id.toString() === id)

    if (!car) {
        return <div>Automobilis nerastas</div>;
    }

    const formattedDate = car.technicalInspectionValidUntil.slice(0, 10);
    const uploadTime = car.createdAt.slice(0, 10);
    let accident = "Taip";
    let negotiable = "Ne";

    if (car.accidentHistory.toString() == "false") accident = "Ne";
    if (car.negotiable.toString() == "true") negotiable = "Taip";

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
                                        <EditDeleteButtons />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="info-body">
                            <tr>
                                <td><strong>Kaina:</strong></td>
                                <td>{car.price}&euro;</td>
                            </tr>
                            <tr>
                                <td><strong>Rida:</strong></td>
                                <td>{car.mileage} Km</td>
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
                                <td>{car.engineCapacity} l, {car.horsepower} AG ({parseInt((car.horsepower * 0.745699872), 10)} KW)</td>
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
                        <p><strong>Aprašymas</strong></p>
                        <p>{car.description} </p>
                    </div>
                    <br></br>
                    <UserCard user={car.user} />
                    <br></br>
                </div>
                <ul>
                    <li><img src="https://th.bing.com/th/id/OIP.cjUjzALkEKobv8G4Evr6GQHaEK?rs=1&pid=ImgDetMain" alt={car.brand} className="pic_width"></img></li>
                    <li><img src="https://th.bing.com/th/id/OIP.cjUjzALkEKobv8G4Evr6GQHaEK?rs=1&pid=ImgDetMain" alt={car.brand} className="pic_width"></img></li>
                    <li><img src="https://th.bing.com/th/id/OIP.cjUjzALkEKobv8G4Evr6GQHaEK?rs=1&pid=ImgDetMain" alt={car.brand} className="pic_width"></img></li>
                    {car.imageUrls.map((url, index) => (
                        <li key={index}>
                            {/* src={url} */}
                            <img src="https://th.bing.com/th/id/OIP.cjUjzALkEKobv8G4Evr6GQHaEK?rs=1&pid=ImgDetMain" className="pic_width" /> 
                        </li>
                    ))}
                </ul>
                
            </div>

            

        </div>

    );
}

Listing.propTypes = {
    car: PropTypes.shape({
        accidentHistory: PropTypes.bool.isRequired,
        bodyType: PropTypes.string.isRequired,
        brand: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        condition: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired, // ISO Date string
        description: PropTypes.string.isRequired,
        doors: PropTypes.number.isRequired,
        drivetrain: PropTypes.string.isRequired,
        engineCapacity: PropTypes.number.isRequired,
        fuelType: PropTypes.string.isRequired,
        horsepower: PropTypes.number.isRequired,
        id: PropTypes.number.isRequired,
        imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
        location: PropTypes.string.isRequired,
        mileage: PropTypes.number.isRequired,
        model: PropTypes.string.isRequired,
        negotiable: PropTypes.bool.isRequired,
        price: PropTypes.number.isRequired,
        registrationNumber: PropTypes.string.isRequired,
        seats: PropTypes.number.isRequired,
        technicalInspectionValidUntil: PropTypes.string.isRequired, // ISO Date string
        transmission: PropTypes.string.isRequired,
        vin: PropTypes.string.isRequired,
        year: PropTypes.number.isRequired
    }).isRequired,
};

export default Listing;
