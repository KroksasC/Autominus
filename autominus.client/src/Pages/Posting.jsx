import { useState } from "react";
import "../Styles/Posting.css";
import { Link } from "react-router-dom"

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

function Posting() {
    const [selectedCar, setSelectedCar] = useState("");
    const years = Array.from({ length: 2025 - 1920 + 1 }, (_, index) => 1920 + index);
    
    return (
        <form className="main">
            {/* BRAND */ }
            <select id="cars" name="cars" onChange={(e) => setSelectedCar(e.target.value)}>
                <option value="">--Select a brand--</option>
                {Object.keys(carModels).map((car) => (
                    <option key={car} value={car}>{car.charAt(0).toUpperCase() + car.slice(1)}</option>
                ))}
            </select>

            {/* MODEL */}
            <select id="models" name="models">
                <option value="">--Select a model--</option>
                {selectedCar &&
                    carModels[selectedCar]?.map((model) => (
                        <option key={model} value={model}>{model}</option>
                    ))}
            </select>

            {/* YEAR */}
            <select id="year" name="year">
                <option value="">--Select a year--</option>
                {years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>

            {/* MILEAGE */}
            <div>
                <label htmlFor="mileage">Mileage (in miles):</label>
                <input type="number" id="mileage" name="mileage" placeholder="Enter mileage"/>
            </div>

            {/* FUEL TYPE */}
            <div>
                <select id="fuelType" name="fuelType">
                    <option value="">--Select a fuel type--</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                </select>
            </div>

            {/* TRANSMISSION */}
            <div>
                <select id="transmission" name="transmission">
                    <option value="">--Select transmission--</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                </select>
            </div>

            {/* ENGINE CAPACITY */}
            <div>
                <label htmlFor="engineCapacity">Engine Capacity (in liters or cc):</label>
                <input type="number" id="engineCapacity" name="engineCapacity" placeholder="Enter engine capacity" step="0.1"/>
            </div>

            {/* HORSE POWER */}
            <div>
                <label htmlFor="horsePower">Horse Power (HP):</label>
                <input
                    type="number" id="horsePower" name="horsePower" placeholder="Enter horsepower"/>
            </div>

            <div className="buttons">
                <button type="submit" className="Add">Post</button>
                <Link to="/" className="Cancel"><button type="button">Cancel</button></Link>
            </div>
        </form>
    );
}

export default Posting;
