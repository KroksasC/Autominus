import { useState } from "react";
import PropTypes from "prop-types"

import "../Styles/FilterWindow.css";

const carModels = {
    acura: ["ILX", "MDX", "NSX", "RDX", "TLX", "RLX", "ZDX", "Integra", "Legend"],
    "alfa-romeo": ["Giulia", "Stelvio", "4C Spider", "4C Coupe", "Tonale", "8C Competizione", "Brera", "MiTo"],
    "aston-martin": ["DB11", "Vantage", "DBS Superleggera", "Rapide", "Vanquish", "DBX", "One-77", "Cygnet"],
    audi: ["A3", "A4", "A5", "Q5", "Q7", "R8", "A6", "A7", "Q3", "Q8", "RS5", "S3", "TT", "E-Tron GT"],
    bentley: ["Bentayga", "Continental GT", "Flying Spur", "Mulsanne", "Azure", "Brooklands", "Arnage"],
    bmw: ["X1", "X3", "X5", "M3", "M4", "X7", "M8", "Z4", "i4", "iX", "i8", "7 Series"],
    bugatti: ["Chiron", "Divo", "Veyron", "Bolide", "Centodieci", "La Voiture Noire"],
    buick: ["Enclave", "Encore", "Regal", "Lucerne", "LaCrosse", "Verano", "Park Avenue"],
    cadillac: ["CT4", "CT5", "Escalade", "XT4", "XT5", "XT6", "CTS", "XLR", "SRX"],
    chevrolet: ["Camaro", "Corvette", "Malibu", "Silverado", "Tahoe", "Impala", "Trailblazer", "Suburban", "Bolt EV"],
    chrysler: ["300", "Pacifica", "Aspen", "Sebring", "Crossfire", "PT Cruiser"],
    citroen: ["C3", "C4", "C5 Aircross", "Berlingo", "DS3", "DS4", "C6", "Saxo"],
    dodge: ["Challenger", "Charger", "Durango", "Journey", "Dart", "Ram", "Viper", "Magnum"],
    ferrari: ["488", "F8 Tributo", "Portofino", "SF90 Stradale", "812 Superfast", "California", "Roma", "LaFerrari"],
    fiat: ["500", "Panda", "Tipo", "Bravo", "Uno", "124 Spider", "Doblo"],
    ford: ["Bronco", "Escape", "Explorer", "F-150", "Mustang", "Focus", "Fusion", "Edge", "Expedition", "GT"],
    genesis: ["G70", "G80", "G90", "GV70", "GV80"],
    gmc: ["Acadia", "Sierra", "Yukon", "Canyon", "Terrain", "Envoy", "Savana"],
    honda: ["Accord", "Civic", "CR-V", "Pilot", "Ridgeline", "Odyssey", "HR-V", "Fit", "Element"],
    hyundai: ["Elantra", "Kona", "Tucson", "Santa Fe", "Sonata", "Palisade", "Veloster", "Ioniq"],
    infiniti: ["Q50", "Q60", "QX80", "QX60", "QX50", "G37", "FX35", "EX37"],
    jaguar: ["E-PACE", "F-PACE", "XE", "XF", "XJ", "I-PACE", "F-TYPE"],
    jeep: ["Cherokee", "Wrangler", "Grand Cherokee", "Compass", "Renegade", "Gladiator", "Patriot"],
    kia: ["Forte", "Sorento", "Sportage", "Telluride", "Seltos", "Optima", "Cadenza", "Rio"],
    lamborghini: ["Aventador", "Huracan", "Urus", "Gallardo", "Murcielago", "Diablo", "Countach", "Reventon"],
    "land-rover": ["Defender", "Discovery", "Range Rover", "Evoque", "Velar", "Freelander"],
    lexus: ["ES", "RX", "LX", "IS", "GS", "NX", "GX", "LC", "RC"],
    lincoln: ["Aviator", "Corsair", "Navigator", "MKZ", "MKX", "Continental", "Town Car"],
    maserati: ["Ghibli", "Levante", "Quattroporte", "MC20", "GranTurismo", "GranCabrio"],
    mazda: ["CX-5", "MX-5 Miata", "Mazda3", "Mazda6", "CX-9", "CX-30", "RX-8", "Tribute"],
    mclaren: ["570S", "720S", "Artura", "765LT", "P1", "MP4-12C", "650S"],
    mercedes: ["A-Class", "C-Class", "E-Class", "GLA", "GLE", "S-Class", "AMG GT", "SL", "GLC"],
    mini: ["Clubman", "Countryman", "Hardtop", "Cooper", "Paceman", "Roadster"],
    mitsubishi: ["Eclipse Cross", "Outlander", "Mirage", "Lancer", "Pajero", "Galant", "Montero"],
    nissan: ["Altima", "GT-R", "Rogue", "Sentra", "Titan", "370Z", "Maxima", "Murano", "Xterra"],
    pagani: ["Huayra", "Zonda", "Utopia"],
    peugeot: ["208", "3008", "5008", "2008", "508", "RCZ"],
    polestar: ["Polestar 1", "Polestar 2", "Polestar 3"],
    porsche: ["911", "Cayenne", "Taycan", "Panamera", "Macan", "718 Boxster", "918 Spyder"],
    ram: ["1500", "2500", "3500", "Dakota", "ProMaster"],
    renault: ["Clio", "Megane", "Captur", "Talisman", "Kadjar", "Zoe"],
    "rolls-royce": ["Cullinan", "Ghost", "Phantom", "Dawn", "Wraith", "Spectre"],
    saab: ["9-3", "9-5", "900", "9000"],
    smart: ["EQ Fortwo", "EQ Forfour", "Roadster"],
    subaru: ["Forester", "Outback", "WRX", "Impreza", "Legacy", "BRZ", "Crosstrek"],
    suzuki: ["Swift", "Vitara", "Jimny", "SX4", "Baleno", "Celerio", "Alto"],
    tesla: ["Model 3", "Model S", "Model X", "Model Y", "Roadster", "Cybertruck"],
    toyota: ["Camry", "Corolla", "Highlander", "Rav4", "Supra", "Avalon", "Tacoma", "Tundra", "Sienna"],
    volkswagen: ["Atlas", "Golf", "Jetta", "Passat", "Tiguan", "Arteon", "Polo", "Beetle"],
    volvo: ["S60", "XC40", "XC90", "V60", "S90", "XC60", "C40 Recharge"]
};


export function FilterWindow({ onClose, onApplyFilters, initialFilters }) {
    const [filters, setFilters] = useState(initialFilters || {
        brand: "",
        model: "",
        fromYear: "",
        toYear: "",
        fuelType: "",
        transmission: "",
        fromHorsepower: "",
        toHorsepower: "",
        fromDoors: "",
        toDoors: "",
        fromSeats: "",
        toSeats: "",
        bodyType: "",
        color: "",
        condition: "",
        accidentHistory: null,
        fromPrice: "",
        toPrice: ""
    });

    const years = Array.from({ length: 2025 - 1920 + 1 }, (_, index) => 1920 + index);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };

    const handleClear = () => {
        setFilters({
            brand: "",
            model: "",
            fromYear: "",
            toYear: "",
            fuelType: "",
            transmission: "",
            fromHorsepower: "",
            toHorsepower: "",
            fromDoors: "",
            toDoors: "",
            fromSeats: "",
            toSeats: "",
            bodyType: "",
            color: "",
            condition: "",
            accidentHistory: null,
            fromPrice: "",
            toPrice: ""
        });
    };

    return (
        <div className="filter-window-overlay">
            <div className="filter-window">
                <button className="close-button" onClick={onClose}>X</button>
                <h3>Filters</h3>

                <div className="filter-section">
                    <h4>Brand & Model</h4>
                    <div className="filter-group">
                        <label>Brand</label>
                        <select
                            name="brand"
                            value={filters.brand}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Brands</option>
                            {Object.keys(carModels).map(brand => (
                                <option key={brand} value={brand}>
                                    {brand.charAt(0).toUpperCase() + brand.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Model</label>
                        <select
                            name="model"
                            value={filters.model}
                            onChange={handleFilterChange}
                            disabled={!filters.brand}
                        >
                            <option value="">All Models</option>
                            {filters.brand && carModels[filters.brand]?.map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Year Range</h4>
                    <div className="range-group">
                        <div className="filter-group">
                            <label>From</label>
                            <select
                                name="fromYear"
                                value={filters.fromYear}
                                onChange={handleFilterChange}
                            >
                                <option value="">Any</option>
                                {years.map(year => (
                                    <option key={`from-${year}`} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>To</label>
                            <select
                                name="toYear"
                                value={filters.toYear}
                                onChange={handleFilterChange}
                            >
                                <option value="">Any</option>
                                {years.map(year => (
                                    <option key={`to-${year}`} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Fuel Type</h4>
                    <div className="filter-group">
                        <select
                            name="fuelType"
                            value={filters.fuelType}
                            onChange={handleFilterChange}
                        >
                            <option value="">Any</option>
                            <option value="petrol">Petrol</option>
                            <option value="diesel">Diesel</option>
                            <option value="electric">Electric</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Transmission</h4>
                    <div className="filter-group">
                        <select
                            name="transmission"
                            value={filters.transmission}
                            onChange={handleFilterChange}
                        >
                            <option value="">Any</option>
                            <option value="manual">Manual</option>
                            <option value="automatic">Automatic</option>
                        </select>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Horse Power Range</h4>
                    <div className="range-group">
                        <div className="filter-group">
                            <label>From</label>
                            <input
                                type="number"
                                name="fromHorsepower"
                                value={filters.fromHorsepower}
                                onChange={handleFilterChange}
                                placeholder="Min HP"
                            />
                        </div>
                        <div className="filter-group">
                            <label>To</label>
                            <input
                                type="number"
                                name="toHorsepower"
                                value={filters.toHorsepower}
                                onChange={handleFilterChange}
                                placeholder="Max HP"
                            />
                        </div>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Doors</h4>
                    <div className="range-group">
                        <div className="filter-group">
                            <label>From</label>
                            <input
                                type="number"
                                name="fromDoors"
                                value={filters.fromDoors}
                                onChange={handleFilterChange}
                                placeholder="Min"
                            />
                        </div>
                        <div className="filter-group">
                            <label>To</label>
                            <input
                                type="number"
                                name="toDoors"
                                value={filters.toDoors}
                                onChange={handleFilterChange}
                                placeholder="Max"
                            />
                        </div>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Seats</h4>
                    <div className="range-group">
                        <div className="filter-group">
                            <label>From</label>
                            <input
                                type="number"
                                name="fromSeats"
                                value={filters.fromSeats}
                                onChange={handleFilterChange}
                                placeholder="Min"
                            />
                        </div>
                        <div className="filter-group">
                            <label>To</label>
                            <input
                                type="number"
                                name="toSeats"
                                value={filters.toSeats}
                                onChange={handleFilterChange}
                                placeholder="Max"
                            />
                        </div>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Body Type</h4>
                    <div className="filter-group">
                        <select
                            name="bodyType"
                            value={filters.bodyType}
                            onChange={handleFilterChange}
                        >
                            <option value="">Any</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="coupe">Coupe</option>
                            <option value="hatchback">Hatchback</option>
                            <option value="convertible">Convertible</option>
                            <option value="wagon">Wagon</option>
                            <option value="pickup">Pickup</option>
                            <option value="minivan">Minivan</option>
                            <option value="roadster">Roadster</option>
                        </select>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Color</h4>
                    <div className="filter-group">
                        <select
                            name="color"
                            value={filters.color}
                            onChange={handleFilterChange}
                        >
                            <option value="">Any</option>
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
                            <option value="black">Black</option>
                            <option value="white">White</option>
                            <option value="silver">Silver</option>
                            <option value="gray">Gray</option>
                            <option value="green">Green</option>
                            <option value="yellow">Yellow</option>
                            <option value="orange">Orange</option>
                            <option value="brown">Brown</option>
                            <option value="purple">Purple</option>
                        </select>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Condition</h4>
                    <div className="filter-group">
                        <select
                            name="condition"
                            value={filters.condition}
                            onChange={handleFilterChange}
                        >
                            <option value="">Any</option>
                            <option value="new">New</option>
                            <option value="used">Used</option>
                            <option value="certifiedPreOwned">Certified Pre-Owned</option>
                        </select>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Accident History</h4>
                    <div className="filter-group radio-group">
                        <label>
                            <input
                                type="radio"
                                name="accidentHistory"
                                value="true"
                                checked={filters.accidentHistory === true}
                                onChange={() => setFilters(prev => ({ ...prev, accidentHistory: true }))}
                            /> Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="accidentHistory"
                                value="false"
                                checked={filters.accidentHistory === false}
                                onChange={() => setFilters(prev => ({ ...prev, accidentHistory: false }))}
                            /> No
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="accidentHistory"
                                value=""
                                checked={filters.accidentHistory === null}
                                onChange={() => setFilters(prev => ({ ...prev, accidentHistory: null }))}
                            /> Any
                        </label>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Price Range</h4>
                    <div className="range-group">
                        <div className="filter-group">
                            <label>From</label>
                            <input
                                type="number"
                                name="fromPrice"
                                value={filters.fromPrice}
                                onChange={handleFilterChange}
                                placeholder="Min price"
                            />
                        </div>
                        <div className="filter-group">
                            <label>To</label>
                            <input
                                type="number"
                                name="toPrice"
                                value={filters.toPrice}
                                onChange={handleFilterChange}
                                placeholder="Max price"
                            />
                        </div>
                    </div>
                </div>

                <div className="filter-actions">
                    <button type="button" className="clear-btn" onClick={handleClear}>
                        Clear Filters
                    </button>
                    <button type="button" className="apply-btn" onClick={handleApply}>
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}

FilterWindow.propTypes = {
    onClose: PropTypes.func.isRequired,
    onApplyFilters: PropTypes.func.isRequired,
    initialFilters: PropTypes.func.isRequired
};