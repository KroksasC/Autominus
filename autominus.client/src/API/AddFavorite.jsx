async function AddCarToFavorites(carId) {
    const userId = localStorage.getItem("userId");
    try {
        const response = await fetch(`user/favorite/add/${userId}/${carId}`, {
            method: "PUT",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error adding car to favorites:", error);
        throw error;
    }
}

export default AddCarToFavorites;