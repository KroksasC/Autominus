import { useState, useEffect } from "react";
import CarPost from "../components/CarPost";
import NavBar from "../components/NavBar";
import FetchCars from "../API/FetchCars";
import IsCarFavoriteByUser from "../API/CheckCarIsFavorite";
import { StatusView } from "../components/StatusView";

function Home() {
    const [favoriteCars, setFavoriteCars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchFavoriteCars = async () => {
            if (!userId) {
                setError("User not logged in.");
                setIsLoading(false);
                return;
            }

            try {
                const allCars = await FetchCars();

                const favoriteChecks = await Promise.all(
                    allCars.map(async (car) => {
                        const isFav = await IsCarFavoriteByUser(car.id);
                        return isFav ? car : null;
                    })
                );

                const filtered = favoriteChecks.filter(Boolean); // remove nulls
                setFavoriteCars(filtered);
                setError(null);
            } catch (err) {
                console.error("Error loading favorite cars:", err);
                setError("Unable to load favorites. Try again later.");
                setFavoriteCars([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavoriteCars();
    }, [userId]);

    if (isLoading) {
        return <div className="Home">Kraunama...</div>;
    }

    if (error) {
        return (
            <div className="Home">
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="Home">
            <StatusView className="StatusView" />
            <NavBar className="NavBar" />
            <div className="car-posts">
                {favoriteCars.length === 0 ? (
                    <p style={{ color: 'black' }}>Jūsų mėgstamų automobilių nėra.</p>
                ) : (
                    favoriteCars.map(car => (
                        <CarPost key={car.id} car={car} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;
