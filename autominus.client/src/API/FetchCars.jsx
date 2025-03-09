import { useEffect, useState } from 'react';

function FetchCars() {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        async function fetchCars() {
            try {
                const response = await fetch('car'); // Adjust endpoint as needed
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setCars(data);
            } catch (error) {
                console.error("Failed to fetch cars:", error);
            }
        }

        fetchCars();
    }, []);
    console.log(cars);
    return cars;
}

export default FetchCars;
