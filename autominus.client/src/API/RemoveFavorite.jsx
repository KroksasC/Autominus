async function RemoveCarFromFavorites(carId) {
    const userId = localStorage.getItem("userId");
    try {
        const response = await fetch(`user/favorite/remove/${userId}/${carId}`, {
            method: "PUT"
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error removing car from favorites:", error);
        throw error;
    }
}

export default RemoveCarFromFavorites;