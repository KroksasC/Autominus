async function EditCarListing(carData, carID) {
    const userId = localStorage.getItem("userId");
    if (userId == carData.user.id) {
        try {
            const response = await fetch(`car/${carID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(carData),
            });
            if (!response.ok) {
                // Try to get error details from response
                const errorResponse = await response.json().catch(() => null);
                const errorMessage = errorResponse?.message ||
                    `HTTP error! Status: ${response.status}`;
                throw new Error(errorMessage);
            }

            // Handle different response types
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                return {
                    success: true,
                    data,
                    status: response.status
                };
            }

            // For non-JSON responses
            return {
                success: true,
                status: response.status,
                message: 'Car updated successfully'
            };

        } catch (error) {
            console.error("Error editing car listing:", error);
            return {
                success: false,
                error: error.message,
                status: error.response?.status || 500
            };
        }
    }
}

export default EditCarListing;