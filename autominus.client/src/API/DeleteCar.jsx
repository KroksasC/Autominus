async function DeleteCar(carID) {
    try {
        const response = await fetch(`car/${carID}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

    } catch (error) {
        console.error("Error deleting car:", error);
        throw error;
    }
}

export default DeleteCar;