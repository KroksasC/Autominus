async function postCarListing(carData) {
    try {
        const response = await fetch(`car`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(carData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error posting car listing:", error);
        throw error;
    }
}

export default postCarListing;