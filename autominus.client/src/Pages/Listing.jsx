import { useState, useEffect } from "react";
import FetchCars from "../API/FetchCars";
import PropTypes from "prop-types";
import NavBar from "../components/NavBar";
import { useParams } from "react-router-dom";
import "../Styles/Listing.css";
import UserCard from "../components/UserCard";
import EditDeleteButtons from "../components/EditDeleteButtons";
import CarLocationMap from "../components/CarLocationMap";
import CarGallery from "../components/CarGallery";
import PhotoView from "../components/CarPhotoView";
import FavoriteToggleButton from "../components/FavoriteToggle";


function TableRow(left, right, extra = "") {
    if (right != null && right != 0 && right != "Nenurodyta") {
        return (
            <tr>
                <td><strong>{left}</strong></td>
                <td>{right} {extra}</td>
            </tr>
        );
    }
}

function Description(descripton) {
    if (descripton != null && descripton != 0 && descripton != "Nenurodyta") {
        return (
            <div className="car-post-header">
                <p className="desription">Aprašymas</p>
                <p>{descripton} </p>
            </div>
        );
    }
}

function TableRowEngine(engineCap, hP) {
    if (engineCap != 0 && hP != 0 && engineCap != null && hP!= null) {
        return (
            <tr>
                <td><strong>Variklis:</strong></td>
                <td>{engineCap} l, {hP} KW</td>
            </tr>
        );
    }
    if (engineCap != 0 && engineCap != null) {
        return (
            <tr>
                <td><strong>Variklis:</strong></td>
                <td>{engineCap} l</td>
            </tr>
        );
    }
    if (hP != 0 && hP != null) {
        return (
            <tr>
                <td><strong>Variklis:</strong></td>
                <td>{hP} KW</td>
            </tr>
        );
    }
}

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
    let accident = 0;
    let negotiable = 0;

    if (car.accidentHistory?.toString() === "false") accident = "Ne";
    if (car.accidentHistory?.toString() === "true") accident = "Taip";
    if (car.negotiable?.toString() === "false") negotiable = "Ne";
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
                                <th colSpan="3">
                                    <div className="table-header">
                                        <FavoriteToggleButton car={car} />
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
                            {TableRow("Rida:", car.mileage, "km")}
                            {TableRow("Pavarų dėžė:", car.transmission)}
                            {TableRow("Kuro tipas:", car.fuelType)}
                            {TableRowEngine(car.engineCapacity, car.horsepower)}
                            {TableRow("Varantieji ratai:", car.drivetrain)}
                            {TableRow("Spalva:", car.color)}
                            {TableRow("Durų skaičius:", car.doors)}
                            {TableRow("Sėdimos vietos:", car.seats)}
                            {TableRow("Valstybiniai numeriai:", car.registrationNumber)}
                            {TableRow("VIN:", car.vin)}
                            {TableRow("Automobilio būklė:", car.condition)}
                            {TableRow("Daužtas:", accident)}
                            {TableRow("Kaina derinama:", negotiable)}
                            {TableRow("Technikinė apžiūra galioja iki:", formattedDate)}
                            {TableRow("Skelbimas įkeltas:", uploadTime)}
                            {TableRow("Automobilio vieta:", car.location)}
                        </tbody>
                    </table>
                    <br></br>
                    <div className="item_width">
                        {Description(car.description) }
                    </div>
                    <br></br>
                    <UserCard user={car.user} />
                    <br></br>
                    <div className="map-container">
                        <CarLocationMap city={car.city} />
                    </div>
                </div>
                <CarGallery car={car} />
                

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