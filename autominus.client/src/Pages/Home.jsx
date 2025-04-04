import { useState, useEffect } from "react";
import CarPost from "../components/CarPost";
import PropTypes from "prop-types";
import NavBar from "../components/NavBar";
import FetchCars from "../API/FetchCars";
import SearchBar from "../components/SearchBar";

function Home() {
    const [carList, setCarList] = useState([]);
    const [filteredCarList, setFilteredCarList] = useState([]);
    const [filters, setFilters] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");


    // Fetch cars on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await FetchCars();
                setCarList(data);
                setFilteredCarList(data);
                setError(null);
            } catch (error) {
                console.error("Error fetching cars:", error);
                setError("Failed to load cars. Please try again later.");
                setCarList([]);
                setFilteredCarList([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Apply filters whenever they change
    useEffect(() => {
        if (!carList.length) return;

        // If no filters are selected, show all cars
        if (!filters || Object.values(filters).every(val => val === null || val === "" || val === undefined)) {
            setFilteredCarList(carList);
            return;
        }

        let filtered = carList.filter(car => {
            // Brand filter
            if (filters.brand && car.brand.toLowerCase() !== filters.brand.toLowerCase()) {
                return false;
            }

            // Model filter
            if (filters.model && car.model.toLowerCase() !== filters.model.toLowerCase()) {
                return false;
            }

            // Year range filter
            const carYear = parseInt(car.year);
            if (filters.fromYear && carYear < parseInt(filters.fromYear)) {
                return false;
            }
            if (filters.toYear && carYear > parseInt(filters.toYear)) {
                return false;
            }

            // Fuel type filter
            if (filters.fuelType && car.fuelType.toLowerCase() !== filters.fuelType.toLowerCase()) {
                return false;
            }

            // Transmission filter
            if (filters.transmission && car.transmission.toLowerCase() !== filters.transmission.toLowerCase()) {
                return false;
            }

            // Horsepower range filter
            const carHorsepower = parseInt(car.horsepower);
            if (filters.fromHorsepower && carHorsepower < parseInt(filters.fromHorsepower)) {
                return false;
            }
            if (filters.toHorsepower && carHorsepower > parseInt(filters.toHorsepower)) {
                return false;
            }

            // Doors range filter
            const carDoors = parseInt(car.doors);
            if (filters.fromDoors && carDoors < parseInt(filters.fromDoors)) {
                return false;
            }
            if (filters.toDoors && carDoors > parseInt(filters.toDoors)) {
                return false;
            }

            // Seats range filter
            const carSeats = parseInt(car.seats);
            if (filters.fromSeats && carSeats < parseInt(filters.fromSeats)) {
                return false;
            }
            if (filters.toSeats && carSeats > parseInt(filters.toSeats)) {
                return false;
            }

            // Body type filter
            if (filters.bodyType && car.bodyType.toLowerCase() !== filters.bodyType.toLowerCase()) {
                return false;
            }

            // Color filter
            if (filters.color && car.color.toLowerCase() !== filters.color.toLowerCase()) {
                return false;
            }

            // Condition filter
            if (filters.condition && car.condition.toLowerCase() !== filters.condition.toLowerCase()) {
                return false;
            }

            // Accident history filter
            if (filters.accidentHistory !== null && car.accidentHistory !== filters.accidentHistory) {
                return false;
            }

            // Price range filter
            const carPrice = parseFloat(car.price);
            if (filters.fromPrice && carPrice < parseFloat(filters.fromPrice)) {
                return false;
            }
            if (filters.toPrice && carPrice > parseFloat(filters.toPrice)) {
                return false;
            }

            return true;
        });

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(car => {
                return (
                    car.brand.toLowerCase().includes(term) ||
                    car.model.toLowerCase().includes(term) ||
                    (car.description && car.description.toLowerCase().includes(term)) ||
                    car.color.toLowerCase().includes(term) ||
                    car.vin.toLowerCase().includes(term) ||
                    car.registrationNumber.toLowerCase().includes(term)
                );
            });
        }

        setFilteredCarList(filtered);
    }, [filters, carList]);

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    if (isLoading) {
        return <div className="Home">Loading...</div>;
    }

    if (error) {
        return (
            <div className="Home">
                <NavBar className="NavBar" onFiltersChange={handleFiltersChange} />
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="Home">
            <NavBar className="NavBar" onFiltersChange={handleFiltersChange} />
            <SearchBar onSearch={handleSearch} />
            <div className="car-posts">
                {filteredCarList.length === 0 ? (
                    <p style={{ color: 'black' }}>No cars found</p>
                ) : (
                    filteredCarList.map(car => (
                        <CarPost key={car.id} car={car} />
                    ))
                )}
            </div>
        </div>
    );
}

Home.propTypes = {
    car_list: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired
        })
    ).isRequired,
};

export default Home;