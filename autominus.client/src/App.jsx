import { useEffect, useState } from 'react';
import Home from "./Pages/Home"

function App() {
    const [cars, setCars] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchCars();
        fetchUsers();
    }, []);

    async function fetchCars() {
        try {
            const response = await fetch('car'); // Adjust endpoint if needed
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setCars(data);
        } catch (error) {
            console.error("Failed to fetch cars:", error);
        }
    }
    async function fetchUsers() {
        try {
            const response = await fetch('user'); // Adjust endpoint if needed
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    }
    console.log(cars);
    return (
        <div>
            <Home car_list={cars} />
        </div>
        //<div>
        //    <h1>Car Listings</h1>
        //    <p>This component fetches and displays a list of cars.</p>

        //    {cars.length === 0 ? (
        //        <p><em>Loading or no cars available...</em></p>
        //    ) : (
        //        <table className="table table-striped">
        //            <thead>
        //                <tr>
        //                    <th>Brand</th>
        //                    <th>Model</th>
        //                    <th>Year</th>
        //                    <th>Mileage</th>
        //                    <th>Fuel Type</th>
        //                    <th>Transmission</th>
        //                    <th>Price</th>
        //                </tr>
        //            </thead>
        //            <tbody>
        //                {cars.map(car => (
        //                    <tr key={car.id}>
        //                        <td>{car.brand}</td>
        //                        <td>{car.model}</td>
        //                        <td>{car.year}</td>
        //                        <td>{car.mileage} km</td>
        //                        <td>{car.fuelType}</td>
        //                        <td>{car.transmission}</td>
        //                        <td>${car.price.toFixed(2)}</td>
        //                    </tr>
        //                ))}
        //            </tbody>
        //        </table>
        //    )}
        //</div>
    );
}

export default App;