﻿import { useState, useEffect } from "react";
import FetchCars from "../API/FetchCars";
import FavoriteCount from "../API/FavoriteCount";
import PropTypes from "prop-types";
import NavBar from "../components/NavBar";
import { useParams } from "react-router-dom";
import "../Styles/Listing.css";
import UserCard from "../components/UserCard";
import EditDeleteButtons from "../components/EditDeleteButtons";
import CarLocationMap from "../components/CarLocationMap";
import CarGallery from "../components/CarGallery";
import FavoriteToggleButton from "../components/FavoriteToggle";
import { Link } from "react-router-dom";

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

    const car = carList.find((car) => car.id.toString() === id);

    const [carCount, setCarCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const count = await FavoriteCount(id);
                setCarCount(count);
            } catch (error) {
                console.error("Failed to load favorite count:", error);
                setCarCount(0); // Fallback value
            }
        };
        fetchCount();
    }, [id]);

    useEffect(() => {
        const carId = parseInt(id); // ensure it's a number
        const key = 'viewedCars';
        const viewed = JSON.parse(localStorage.getItem(key) || '[]');
        if (!viewed.includes(carId)) {
            const updated = [carId, ...viewed.filter((v) => v !== carId)].slice(0, 20);
            localStorage.setItem(key, JSON.stringify(updated));
        }

    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

   

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

    const userOtherCars = carList.filter(
        (otherCar) => otherCar.user?.id === car.user?.id && otherCar.id !== car.id
    );


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
                        {Description(car.description)}
                    </div>
                    <br></br>
                    <UserCard user={car.user} />
                    <a style={{ fontSize: '0.9rem', color: 'gray' }}>
                        Skelbimas įsimintas {carCount} kartų
                    </a>
                    <br></br>
                    <div className="map-container">
                        <CarLocationMap city={car.city} />
                    </div>
                </div>
                <div>
                <CarGallery car={car}/>
                
                <ul>
                    {userOtherCars.length > 0 && (
                        <div className="other-posts-section">
                            <h3>Kiti šio vartotojo skelbimai</h3>
                            <div className="other-posts-grid">
                                {userOtherCars.map((otherCar) => (
                                    <Link to={`/${otherCar.id}`} key={otherCar.id} className="other-post-card">
                                        {otherCar.imageUrls?.[0] && (
                                            <img
                                                src={otherCar.imageUrls[0]}
                                                alt={`${otherCar.brand} ${otherCar.model}`}
                                                className="other-post-image"
                                            />
                                        )}
                                        <div className="other-post-info">
                                            <h4>{otherCar.brand} {otherCar.model} {otherCar.year}</h4>
                                            <p>{otherCar.price} €</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                    </ul>
                </div>
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