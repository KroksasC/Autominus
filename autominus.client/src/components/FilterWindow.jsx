import { useState } from "react";
import PropTypes from "prop-types"

import "../Styles/FilterWindow.css";

const carModels = {
    Acura: ["ILX", "MDX", "NSX", "RDX", "TLX", "RLX", "ZDX", "Integra", "Legend"],
    "Alfa Romeo": ["Giulia", "Stelvio", "4C Spider", "4C Coupe", "Tonale", "8C Competizione", "Brera", "MiTo"],
    "Aston Martin": ["DB11", "Vantage", "DBS Superleggera", "Rapide", "Vanquish", "DBX", "One-77", "Cygnet"],
    Audi: ["A3", "A4", "A5", "Q5", "Q7", "R8", "A6", "A7", "Q3", "Q8", "RS5", "S3", "TT", "E-Tron GT"],
    Bentley: ["Bentayga", "Continental GT", "Flying Spur", "Mulsanne", "Azure", "Brooklands", "Arnage"],
    BMW: ["X1", "X3", "X5", "M3", "M4", "X7", "M8", "Z4", "i4", "iX", "i8", "7 Series"],
    Bugatti: ["Chiron", "Divo", "Veyron", "Bolide", "Centodieci", "La Voiture Noire"],
    Buick: ["Enclave", "Encore", "Regal", "Lucerne", "LaCrosse", "Verano", "Park Avenue"],
    Cadillac: ["CT4", "CT5", "Escalade", "XT4", "XT5", "XT6", "CTS", "XLR", "SRX"],
    Chevrolet: ["Camaro", "Corvette", "Malibu", "Silverado", "Tahoe", "Impala", "Trailblazer", "Suburban", "Bolt EV"],
    Chrysler: ["300", "Pacifica", "Aspen", "Sebring", "Crossfire", "PT Cruiser"],
    Citroen: ["C3", "C4", "C5 Aircross", "Berlingo", "DS3", "DS4", "C6", "Saxo"],
    Dodge: ["Challenger", "Charger", "Durango", "Journey", "Dart", "Ram", "Viper", "Magnum"],
    Ferrari: ["488", "F8 Tributo", "Portofino", "SF90 Stradale", "812 Superfast", "California", "Roma", "LaFerrari"],
    Fiat: ["500", "Panda", "Tipo", "Bravo", "Uno", "124 Spider", "Doblo"],
    Ford: ["Bronco", "Escape", "Explorer", "F-150", "Mustang", "Focus", "Fusion", "Edge", "Expedition", "GT"],
    Genesis: ["G70", "G80", "G90", "GV70", "GV80"],
    GMC: ["Acadia", "Sierra", "Yukon", "Canyon", "Terrain", "Envoy", "Savana"],
    Honda: ["Accord", "Civic", "CR-V", "Pilot", "Ridgeline", "Odyssey", "HR-V", "Fit", "Element"],
    Hyundai: ["Elantra", "Kona", "Tucson", "Santa Fe", "Sonata", "Palisade", "Veloster", "Ioniq"],
    Infiniti: ["Q50", "Q60", "QX80", "QX60", "QX50", "G37", "FX35", "EX37"],
    Jaguar: ["E-PACE", "F-PACE", "XE", "XF", "XJ", "I-PACE", "F-TYPE"],
    Jeep: ["Cherokee", "Wrangler", "Grand Cherokee", "Compass", "Renegade", "Gladiator", "Patriot"],
    Kia: ["Forte", "Sorento", "Sportage", "Telluride", "Seltos", "Optima", "Cadenza", "Rio"],
    Lamborghini: ["Aventador", "Huracan", "Urus", "Gallardo", "Murcielago", "Diablo", "Countach", "Reventon"],
    "Land Rover": ["Defender", "Discovery", "Range Rover", "Evoque", "Velar", "Freelander"],
    Lexus: ["ES", "RX", "LX", "IS", "GS", "NX", "GX", "LC", "RC"],
    Lincoln: ["Aviator", "Corsair", "Navigator", "MKZ", "MKX", "Continental", "Town Car"],
    Maserati: ["Ghibli", "Levante", "Quattroporte", "MC20", "GranTurismo", "GranCabrio"],
    Mazda: ["CX-5", "MX-5 Miata", "Mazda3", "Mazda6", "CX-9", "CX-30", "RX-8", "Tribute"],
    McLaren: ["570S", "720S", "Artura", "765LT", "P1", "MP4-12C", "650S"],
    Mercedes: ["A-Class", "C-Class", "E-Class", "GLA", "GLE", "S-Class", "AMG GT", "SL", "GLC"],
    Mini: ["Clubman", "Countryman", "Hardtop", "Cooper", "Paceman", "Roadster"],
    Mitsubishi: ["Eclipse Cross", "Outlander", "Mirage", "Lancer", "Pajero", "Galant", "Montero"],
    Nissan: ["Altima", "GT-R", "Rogue", "Sentra", "Titan", "370Z", "Maxima", "Murano", "Xterra"],
    Pagani: ["Huayra", "Zonda", "Utopia"],
    Peugeot: ["208", "3008", "5008", "2008", "508", "RCZ"],
    Polestar: ["Polestar 1", "Polestar 2", "Polestar 3"],
    Porsche: ["911", "Cayenne", "Taycan", "Panamera", "Macan", "718 Boxster", "918 Spyder"],
    Ram: ["1500", "2500", "3500", "Dakota", "ProMaster"],
    Renault: ["Clio", "Megane", "Captur", "Talisman", "Kadjar", "Zoe"],
    "Rolls Royce": ["Cullinan", "Ghost", "Phantom", "Dawn", "Wraith", "Spectre"],
    Saab: ["9-3", "9-5", "900", "9000"],
    Smart: ["EQ Fortwo", "EQ Forfour", "Roadster"],
    Subaru: ["Forester", "Outback", "WRX", "Impreza", "Legacy", "BRZ", "Crosstrek"],
    Suzuki: ["Swift", "Vitara", "Jimny", "SX4", "Baleno", "Celerio", "Alto"],
    Tesla: ["Model 3", "Model S", "Model X", "Model Y", "Roadster", "Cybertruck"],
    Toyota: ["Camry", "Corolla", "Highlander", "Rav4", "Supra", "Avalon", "Tacoma", "Tundra", "Sienna"],
    Volkswagen: ["Atlas", "Golf", "Jetta", "Passat", "Tiguan", "Arteon", "Polo", "Beetle"],
    Volvo: ["S60", "XC40", "XC90", "V60", "S90", "XC60", "C40 Recharge"]
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

    const [sortConfig, setSortConfig] = useState(initialFilters?.sortConfig || {
        key: null,
        direction: 'asc'
    });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const clearSorting = () => {
        setSortConfig({ key: null, direction: 'asc' });
    };

    const handleApply = () => {
        // Include sorting in the filters object
        onApplyFilters({
            ...filters,
            sortConfig
        });
        onClose();
    };

    const years = Array.from({ length: 2025 - 1920 + 1 }, (_, index) => 1920 + index);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
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

                <div className="filter-section">
                    <h2>Rūšiavimas</h2>
                    <div className="sort-buttons">
                        <button
                            className={`sort-button ${sortConfig.key === 'price' ? 'active' : ''}`}
                            onClick={() => handleSort('price')}
                        >
                            Pagal kainą {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            className={`sort-button ${sortConfig.key === 'createdAt' ? 'active' : ''}`}
                            onClick={() => handleSort('createdAt')}
                        >
                            Pagal sukūrimo data {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            className={`sort-button ${sortConfig.key === 'brand' ? 'active' : ''}`}
                            onClick={() => handleSort('brand')}
                        >
                            Pagal markę {sortConfig.key === 'brand' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            className={`sort-button ${sortConfig.key === 'year' ? 'active' : ''}`}
                            onClick={() => handleSort('year')}
                        >
                            Pagal metus {sortConfig.key === 'year' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </button>
                    </div>
                    <div className="filter-actions">
                        <button
                            className="clear-btn"
                            onClick={clearSorting}
                        >
                            Išvalyti rūšiavimą
                        </button>
                        <button type="button" className="apply-btn" onClick={handleApply}>
                            Taikyti
                        </button>
                    </div>
                </div>


                <h2>Filtrai</h2>
                <div className="filter-section">
                    <h4>Markė ir modelis</h4>
                    <div className="filter-group">
                        <label>Markė</label>
                        <select
                            name="brand"
                            value={filters.brand}
                            onChange={handleFilterChange}
                        >
                            <option value="">Visos markės</option>
                            {Object.keys(carModels).map(brand => (
                                <option key={brand} value={brand}>
                                    {brand.charAt(0).toUpperCase() + brand.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Modelis</label>
                        <select
                            name="model"
                            value={filters.model}
                            onChange={handleFilterChange}
                            disabled={!filters.brand}
                        >
                            <option value="">Visi modeliai</option>
                            {filters.brand && carModels[filters.brand]?.map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Metai</h4>
                    <div className="range-group">
                        <div className="filter-group">
                            <label>Nuo</label>
                            <select
                                name="fromYear"
                                value={filters.fromYear}
                                onChange={handleFilterChange}
                            >
                                <option value="">--</option>
                                {years.map(year => (
                                    <option key={`from-${year}`} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Iki</label>
                            <select
                                name="toYear"
                                value={filters.toYear}
                                onChange={handleFilterChange}
                            >
                                <option value="">--</option>
                                {years.map(year => (
                                    <option key={`to-${year}`} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Kuro tipas</h4>
                    <div className="filter-group">
                        <select
                            name="fuelType"
                            value={filters.fuelType}
                            onChange={handleFilterChange}
                        >
                            <option value="">--</option>
                            <option value="Benzinas">Benzinas</option>
                            <option value="Dyzelinas">Dyzelinas</option>
                            <option value="Elektra">Elektra</option>
                            <option value="Benzinas/Dujos">Benzinas/Dujos</option>
                            <option value="Benzinas/Elektra">Benzinas/Elektra</option>
                            <option value="Dyzelinas/Elektra">Dyzelinas/Elektra</option>
                            <option value="Benzinas/Elektra/Dujos">Benzinas/Elektra/Dujos</option>
                            <option value="Vandenilis">Vandenilis</option>
                            <option value="Kita">Kita</option>
                        </select>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Pavarų dėžė</h4>
                    <div className="filter-group">
                        <select
                            name="transmission"
                            value={filters.transmission}
                            onChange={handleFilterChange}
                        >
                            <option value="">--</option>
                            <option value="Mechaninė">Mechaninė</option>
                            <option value="Automatinė">Automatinė</option>
                        </select>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Galia (HP)</h4>
                    <div className="range-group">
                        <div className="filter-group">
                            <label>Nuo</label>
                            <input
                                type="number"
                                name="fromHorsepower"
                                value={filters.fromHorsepower}
                                onChange={handleFilterChange}
                                placeholder="Min HP"
                            />
                        </div>
                        <div className="filter-group">
                            <label>Iki</label>
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
                    <h4>Durų skaičius</h4>
                    <div className="range-group">
                        <div className="filter-group">
                            <label>Nuo</label>
                            <input
                                type="number"
                                name="fromDoors"
                                value={filters.fromDoors}
                                onChange={handleFilterChange}
                                placeholder="Min"
                            />
                        </div>
                        <div className="filter-group">
                            <label>Iki</label>
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
                    <h4>Sėdimos vietos</h4>
                    <div className="range-group">
                        <div className="filter-group">
                            <label>Nuo</label>
                            <input
                                type="number"
                                name="fromSeats"
                                value={filters.fromSeats}
                                onChange={handleFilterChange}
                                placeholder="Min"
                            />
                        </div>
                        <div className="filter-group">
                            <label>Iki</label>
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
                    <h4>Kėbulo tipas</h4>
                    <div className="filter-group">
                        <select
                            name="bodyType"
                            value={filters.bodyType}
                            onChange={handleFilterChange}
                        >
                            <option value="">--</option>
                            <option value="Sedanas">Sedanas</option>
                            <option value="Visureigis / Krosoveris">Visureigis / Krosoveris</option>
                            <option value="Kupė (Coupe)">Kupė (Coupe)</option>
                            <option value="Hečbekas">Hečbekas</option>
                            <option value="Kabrioletas">Kabrioletas</option>
                            <option value="Universalas">Universalas</option>
                            <option value="Pikapas">Pikapas</option>
                            <option value="Keleivinis mikroautobusas">Keleivinis mikroautobusas</option>
                            <option value="Rodsteris">Rodsteris</option>
                        </select>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Spalva</h4>
                    <div className="filter-group">
                        <select
                            name="color"
                            value={filters.color}
                            onChange={handleFilterChange}
                        >
                            <option value="">--</option>
                            <option value="Raudona">Raudona</option>
                            <option value="Mėlyna">Mėlyna</option>
                            <option value="Juoda">Juoda</option>
                            <option value="Balta">Balta</option>
                            <option value="Sidabrinė">Sidabrinė</option>
                            <option value="Pilka">Pilka</option>
                            <option value="Žalia">Žalia</option>
                            <option value="Geltona">Geltona</option>
                            <option value="Oranžinė">Oranžinė</option>
                            <option value="Ruda">Ruda</option>
                            <option value="Violetinė">Violetinė</option>
                        </select>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Būklė</h4>
                    <div className="filter-group">
                        <select
                            name="condition"
                            value={filters.condition}
                            onChange={handleFilterChange}
                        >
                            <option value="">--</option>
                            <option value="Nauja">Nauja</option>
                            <option value="Naudota">Naudota</option>
                            <option value="Sertifikuotas naudotas">Sertifikuotas naudotas</option>
                        </select>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Ar automobilis buvo daužtas?</h4>
                    <div className="filter-group radio-group">
                        <label>
                            <input
                                type="radio"
                                name="accidentHistory"
                                value="true"
                                checked={filters.accidentHistory === true}
                                onChange={() => setFilters(prev => ({ ...prev, accidentHistory: true }))}
                            /> Taip
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="accidentHistory"
                                value="false"
                                checked={filters.accidentHistory === false}
                                onChange={() => setFilters(prev => ({ ...prev, accidentHistory: false }))}
                            /> Ne
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="accidentHistory"
                                value=""
                                checked={filters.accidentHistory === null}
                                onChange={() => setFilters(prev => ({ ...prev, accidentHistory: null }))}
                            /> -
                        </label>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Kaina</h4>
                    <div className="range-group">
                        <div className="filter-group">
                            <label>Nuo</label>
                            <input
                                type="number"
                                name="fromPrice"
                                value={filters.fromPrice}
                                onChange={handleFilterChange}
                                placeholder="Min kaina"
                            />
                        </div>
                        <div className="filter-group">
                            <label>Iki</label>
                            <input
                                type="number"
                                name="toPrice"
                                value={filters.toPrice}
                                onChange={handleFilterChange}
                                placeholder="Max kaina"
                            />
                        </div>
                    </div>
                </div>

                <div className="filter-actions">
                    <button type="button" className="clear-btn" onClick={handleClear}>
                        Išvalyti filtrus
                    </button>
                    <button type="button" className="apply-btn" onClick={handleApply}>
                        Taikyti filtrus
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