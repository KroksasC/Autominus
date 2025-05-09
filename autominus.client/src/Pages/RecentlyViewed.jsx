import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/RecentlyViewed.css";
import NavBar from "../components/NavBar";

export default function RecentlyViewed() {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        const ids = JSON.parse(localStorage.getItem("viewedCars") || "[]");

        Promise.all(
            ids.map((id) =>
                fetch(`/car/${id}`)
                    .then((res) => (res.ok ? res.json() : null))
                    .catch(() => null)
            )
        ).then((results) => {
            setCars(results.filter((c) => c !== null));
        });
    }, []);

    return (
        <div>
            <NavBar className="NavBar" />
            <div className="recently-viewed-container">
                <h2 className="recently-viewed-title">Peržiūrėtų skelbimų istorija</h2>
                {cars.length === 0 ? (
                    <p className="recently-viewed-empty">Nėra peržiūrėtų skelbimų.</p>
                ) : (
                    <ul className="recently-viewed-list">
                        {cars.map((car) => (
                            <li key={car.id} className="recently-viewed-item">
                                <Link to={`/${car.id}`} className="recently-viewed-link">
                                    {car.imageUrls?.[0] && (
                                        <img
                                            src={car.imageUrls[0]}
                                            alt={`${car.brand} ${car.model}`}
                                            className="recently-viewed-image"
                                        />
                                    )}
                                    <div>
                                        <h4>{car.brand} {car.model} ({car.year})</h4>
                                        <p>{car.price} &euro;</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
