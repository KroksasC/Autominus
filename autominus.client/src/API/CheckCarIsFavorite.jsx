async function IsCarFavoriteByUser(carId) {
    const userId = localStorage.getItem("userId");
    try {
        const response = await fetch(`user/favorite/${userId}/${carId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const isFavorite = await response.json();
        return isFavorite;
    } catch (error) {
        console.error("Error checking favorite status:", error);
        throw error;
    }
}

export default IsCarFavoriteByUser;