// PostCars.js

export const PostCars = async (formData) => {
    try {
        const response = await fetch('car', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert("Car listing posted successfully!");
        } else {
            alert("Failed to post the car listing. Please try again.");
        }
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
};
