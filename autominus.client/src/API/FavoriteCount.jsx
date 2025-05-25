async function GetFavoriteCount(carId) {
    try {
        // Add full URL or ensure correct base path
        const response = await fetch(`https://localhost:7193/Car/favorites/${carId}`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        // Verify content type before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error("Response wasn't JSON");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching favorite count:", error);
        throw error;
    }
}
export default GetFavoriteCount;