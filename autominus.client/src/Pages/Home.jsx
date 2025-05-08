import { useState, useEffect } from "react";
import CarPost from "../components/CarPost";
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
    const [currentPage, setCurrentPage] = useState(0); // NEW

    const groupSize = 2;

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

    useEffect(() => {
        let filtered = [...carList];

        if (filters && !Object.values(filters).every(val => val === null || val === "" || val === undefined)) {
            filtered = filtered.filter(car => {
                if (filters.brand && car.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
                if (filters.model && car.model.toLowerCase() !== filters.model.toLowerCase()) return false;

                const carYear = parseInt(car.year);
                if (filters.fromYear && carYear < parseInt(filters.fromYear)) return false;
                if (filters.toYear && carYear > parseInt(filters.toYear)) return false;

                if (filters.fuelType && car.fuelType.toLowerCase() !== filters.fuelType.toLowerCase()) return false;
                if (filters.transmission && car.transmission.toLowerCase() !== filters.transmission.toLowerCase()) return false;

                const carHorsepower = parseInt(car.horsepower);
                if (filters.fromHorsepower && carHorsepower < parseInt(filters.fromHorsepower)) return false;
                if (filters.toHorsepower && carHorsepower > parseInt(filters.toHorsepower)) return false;

                const carDoors = parseInt(car.doors);
                if (filters.fromDoors && carDoors < parseInt(filters.fromDoors)) return false;
                if (filters.toDoors && carDoors > parseInt(filters.toDoors)) return false;

                const carSeats = parseInt(car.seats);
                if (filters.fromSeats && carSeats < parseInt(filters.fromSeats)) return false;
                if (filters.toSeats && carSeats > parseInt(filters.toSeats)) return false;

                if (filters.bodyType && car.bodyType.toLowerCase() !== filters.bodyType.toLowerCase()) return false;
                if (filters.color && car.color.toLowerCase() !== filters.color.toLowerCase()) return false;
                if (filters.condition && car.condition.toLowerCase() !== filters.condition.toLowerCase()) return false;

                if (filters.accidentHistory !== null && car.accidentHistory !== filters.accidentHistory) return false;

                const carPrice = parseFloat(car.price);
                if (filters.fromPrice && carPrice < parseFloat(filters.fromPrice)) return false;
                if (filters.toPrice && carPrice > parseFloat(filters.toPrice)) return false;

                return true;
            });
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(car => {
                return (
                    (car.brand && car.brand.toLowerCase().includes(term)) ||
                    (car.model && car.model.toLowerCase().includes(term)) ||
                    (car.description && car.description.toLowerCase().includes(term)) ||
                    (car.color && car.color.toLowerCase().includes(term)) ||
                    (car.vin && car.vin.toLowerCase().includes(term)) ||
                    (car.fuelType && car.fuelType.toLowerCase().includes(term)) ||
                    (car.bodyType && car.bodyType.toLowerCase().includes(term)) ||
                    (car.condition && car.condition.toLowerCase().includes(term)) ||
                    (car.transmission && car.transmission.toLowerCase().includes(term)) ||
                    (car.registrationNumber && car.registrationNumber.toLowerCase().includes(term)) ||
                    (car.year && car.year.toString().includes(term))
                );
            });
        }

        if (filters?.sortConfig?.key) {
            filtered.sort((a, b) => {
                const key = filters.sortConfig.key;
                const direction = filters.sortConfig.direction === 'asc' ? 1 : -1;

                if (key === 'price') {
                    return (parseFloat(a.price) - parseFloat(b.price)) * direction;
                } else if (key === 'createdAt') {
                    return (new Date(a.createdAt) - new Date(b.createdAt)) * direction;
                } else if (key === 'brand') {
                    const brandCompare = a.brand.localeCompare(b.brand) * direction;
                    if (brandCompare !== 0) return brandCompare;
                    return a.model.localeCompare(b.model) * direction;
                } else if (key === 'year') {
                    return (parseInt(a.year) - parseInt(b.year)) * direction;
                }
                return 0;
            });
        }

        setFilteredCarList(filtered);
        setCurrentPage(0); // Reset to first page when filters/search change
    }, [filters, searchTerm, carList]);

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleSearch = (term) => {
        setSearchTerm(term.trim());
    };

    if (isLoading) {
        return <div className="Home">Kraunama...</div>;
    }

    if (error) {
        return (
            <div className="Home">
                <NavBar className="NavBar" onFiltersChange={handleFiltersChange} />
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    const totalPages = Math.ceil(filteredCarList.length / groupSize);
    const currentGroup = filteredCarList.slice(currentPage * groupSize, (currentPage + 1) * groupSize);

    return (
        <div className="Home">
            <NavBar className="NavBar" onFiltersChange={handleFiltersChange} />
            <SearchBar onSearch={handleSearch} />
            <div className="car-posts">
                {filteredCarList.length === 0 ? (
                    <p style={{ color: 'black' }}>
                        {searchTerm || filters ? "Nėra skelbimų atitinkančių filtrus ar paiešką" : "Skelbimų nėra"}
                    </p>
                ) : (
                    <>
                        <p style={{ color: 'black', fontWeight: 'bold' }}>
                            Rastų skelbimų skaičius: {filteredCarList.length}
                        </p>
                        <p>
                            Rodoma {currentPage * groupSize + 1}–{Math.min((currentPage + 1) * groupSize, filteredCarList.length)} iš {filteredCarList.length}
                        </p>
                        {currentGroup.map(car => (
                            <CarPost key={car.id} car={car} />
                        ))}
                        <div className="pagination-controls" style={{ marginTop: "1rem" }}>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                                disabled={currentPage === 0}
                            >
                                Ankstesnis
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                                disabled={currentPage >= totalPages - 1}
                            >
                                Kitas
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;
