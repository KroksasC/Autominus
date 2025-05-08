import React, { useEffect, useState } from "react";
import IsCarFavoriteByUser from "../API/CheckCarIsFavorite";
import AddCarToFavorites from "../API/AddFavorite";
import RemoveCarFromFavorites from "../API/RemoveFavorite";
// Import images directly
import favFull from "../images/FavFull.png";
import favEmpty from "../images/FavEmpty.png";

const FavoriteToggleButton = ({ car }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");


    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const status = await IsCarFavoriteByUser(car.id);
                setIsFavorite(status);
            } catch (error) {
                console.error("Failed to fetch favorite status", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteStatus();
    }, [car.id, userId]);

    const handleToggleFavorite = async () => {
        if (!userId) {
            console.log("User not logged in");
            return;
        }

        try {
            setLoading(true);
            if (isFavorite) {
                await RemoveCarFromFavorites(car.id);
            } else {
                await AddCarToFavorites(car.id);
            }
            setIsFavorite(prev => !prev);
        } catch (error) {
            console.error("Error toggling favorite", error);
        } finally {
            setLoading(false);
        }
    };

    if (!userId) return null;
  //  if (loading) return <div>Loading...</div>;

    return (
        <button
            onClick={handleToggleFavorite}
            style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
            }}
            disabled={loading}
        >
            <img
                src={isFavorite ? favFull : favEmpty}
                alt={isFavorite ? "Remove from favorites" : "Add to favorites"}
                style={{
                    width: "32px",
                    height: "32px",
                    opacity: loading ? 0.5 : 1
                }}
            />
        </button>
    );
};

export default FavoriteToggleButton;