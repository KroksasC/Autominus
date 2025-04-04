async function FetchCars() {
    try {
        const response = await fetch('car'); // Adjust endpoint as needed
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch cars:", error);
        return []; // Return empty array on error
    }
}

export default FetchCars;