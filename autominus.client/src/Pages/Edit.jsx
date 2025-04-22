import { useState, useEffect } from "react";
import "../Styles/Posting.css";
import { Link } from "react-router-dom";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import editCarListing from "../API/EditCar";
import PropTypes from "prop-types"; const carModels = {
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
// ... (keep your existing carModels object)

function Edit() {
    const location = useLocation();
    const { car } = location.state || {};
    const carID = car.id;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        brand: car?.brand || "",
        model: car?.model || "",
        year: car?.year || 0,
        mileage: car?.mileage || 0,
        fuelType: car?.fuelType || "",
        transmission: car?.transmission || "",
        engineCapacity: car?.engineCapacity || 0,
        horsepower: car?.horsepower || 0,
        drivetrain: car?.drivetrain || "",
        doors: car?.doors || 0,
        seats: car?.seats || 0,
        bodyType: car?.bodyType || "",
        color: car?.color || "",
        vin: car?.vin || "",
        registrationNumber: car?.registrationNumber || "",
        condition: car?.condition || "",
        accidentHistory: car?.accidentHistory,
        technicalInspectionValidUntil: car?.technicalInspectionValidUntil
            ? car.technicalInspectionValidUntil.split('T')[0]
            : "",
        price: car?.price || 0,
        negotiable: car?.negotiable,
        description: car?.description || "",
        imageUrls: car?.imageUrls || [""],
        location: car?.location || "",
        createdAt: car?.createdAt || "",
        user: car?.user || { id: 0 }
    });

    const [selectedCar, setSelectedCar] = useState(car?.brand || "");
    const [errors, setErrors] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false);
    const years = Array.from({ length: 2025 - 1920 + 1 }, (_, index) => 1920 + index);

    useEffect(() => {
        if (car) {
            setSelectedCar(car.brand);
        }
    }, [car]);

    if (!car) {
        return <Navigate to="/" />;
    }

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = [
            'brand', 'model', 'year', 'fuelType', 'transmission',
            'horsepower', 'bodyType', 'condition', 'price'
        ];

        requiredFields.forEach(field => {
            if (!formData[field]) {
                let displayName = field;
                if (field === 'fuelType') displayName = 'Fuel type';
                else if (field === 'horsepower') displayName = 'Horse power';
                else if (field === 'bodyType') displayName = 'Body type';
                else displayName = field.charAt(0).toUpperCase() + field.slice(1);

                newErrors[field] = `${displayName} is required`;
            }
        });

        if (formData.accidentHistory === undefined) {
            newErrors.accidentHistory = "Please select accident history";
        }
        if (formData.negotiable === undefined) {
            newErrors.negotiable = "Please select negotiable option";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = value;

        if (type === "checkbox") {
            newValue = checked;
        } else if (name === "accidentHistory" || name === "negotiable") {
            newValue = value === "true";
        }

        setFormData({
            ...formData,
            [name]: newValue,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");
        if (!userId) {
            console.error("User ID not found. Please log in.");
            return;
        }

        const isValid = validateForm();
        if (!isValid) return;

        const capitalizedBrand = formData.brand.charAt(0).toUpperCase() + formData.brand.slice(1);

        const updatedFormData = {
            id: carID,
            ...formData,
            brand: capitalizedBrand,
            user: { id: userId },
            year: Number(formData.year),
            mileage: Number(formData.mileage),
            engineCapacity: parseFloat(formData.engineCapacity),
            horsepower: Number(formData.horsepower),
            doors: Number(formData.doors),
            seats: Number(formData.seats),
            price: parseFloat(formData.price),
            createdAt: new Date().toISOString(),
            technicalInspectionValidUntil: formData.technicalInspectionValidUntil
                ? new Date(formData.technicalInspectionValidUntil).toISOString()
                : null,
            imageUrls: formData.imageUrls.filter(url => url.trim() !== ""),
        };
        try {
            const response = await editCarListing(updatedFormData, carID);
            console.log("Car listing edited successfully!", response);
            setShowConfirmation(true);
        } catch (error) {
            console.error("Failed to edit listing:", error);
        }
    };

    return (
        <form className="main" onSubmit={handleSubmit}>
            {/* BUTTON */}
            <div className="form-actions">
                <Link to={`/${car.id}`} className="cancel-btn">Cancel</Link>
                <button type="submit" className="submit-btn">Edit</button>
            </div>

            {/* BRAND */}
            <div className="select-group">
                <label htmlFor="brand">Markė</label>
                <select
                    id="brand"
                    name="brand"
                    value={formData.brand.toLowerCase().replace(' ', '-')} // Normalize the value to match carModels keys
                    onChange={(e) => {
                        setSelectedCar(e.target.value);
                        handleChange(e);
                    }}
                >
                    <option value="">--Select a brand--</option>
                    {Object.keys(carModels).map((brand) => (
                        <option key={brand} value={brand}>
                            {brand.split('-').map(word =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                        </option>
                    ))}
                </select>
                {errors.brand && <span className="error-message">{errors.brand}</span>}
            </div>

            {/* MODEL */}
            <div className="select-group">
                <label htmlFor="model">Car Model</label>
                <select
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                >
                    <option value="">--Select a model--</option>
                    {selectedCar &&
                        carModels[selectedCar]?.map((model) => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                </select>
                {errors.model && <span className="error-message">{errors.model}</span>}
            </div>

            {/* YEAR */}
            <div className="select-group">
                <label htmlFor="year">Car Year</label>
                <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                >
                    <option value="">--Select a year--</option>
                    {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                {errors.year && <span className="error-message">{errors.year}</span>}
            </div>

            {/* MILEAGE */}
            <div className="input-group">
                <label htmlFor="mileage">Mileage (in miles):</label>
                <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    value={formData.mileage || ""}
                    placeholder="Enter mileage"
                    onChange={handleChange}
                />
            </div>

            {/* FUEL TYPE */}
            <div className="select-group">
                <label htmlFor="fuelType">Fuel Type</label>
                <select
                    id="fuelType"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                >
                    <option value="">--Select a fuel type--</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                </select>
                {errors.fuelType && <span className="error-message">{errors.fuelType}</span>}
            </div>

            {/* TRANSMISSION */}
            <div className="select-group">
                <label htmlFor="transmission">Transmission</label>
                <select
                    id="transmission"
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                >
                    <option value="">--Select transmission--</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                </select>
                {errors.transmission && <span className="error-message">{errors.transmission}</span>}
            </div>

            {/* ENGINE CAPACITY */}
            <div className="input-group">
                <label htmlFor="engineCapacity">Engine Capacity (in liters or cc):</label>
                <input
                    type="number"
                    id="engineCapacity"
                    name="engineCapacity"
                    value={formData.engineCapacity || ""}
                    placeholder="Enter engine capacity"
                    step="0.1"
                    onChange={handleChange}
                />
            </div>

            {/* HORSE POWER */}
            <div className="input-group">
                <label htmlFor="horsepower">Horse Power (HP):</label>
                <input
                    type="number"
                    id="horsepower"
                    name="horsepower"
                    value={formData.horsepower || ""}
                    placeholder="Enter horsepower"
                    onChange={handleChange}
                />
                {errors.horsepower && <span className="error-message">{errors.horsepower}</span>}
            </div>

            {/* DRIVETRAIN */}
            <div className="select-group">
                <label htmlFor="drivetrain">Drivetrain</label>
                <select
                    id="drivetrain"
                    name="drivetrain"
                    value={formData.drivetrain}
                    onChange={handleChange}
                >
                    <option value="">--Select drivetrain--</option>
                    <option value="awd">All-Wheel Drive (AWD)</option>
                    <option value="rwd">Rear-Wheel Drive (RWD)</option>
                    <option value="fwd">Front-Wheel Drive (FWD)</option>
                    <option value="4wd">Four-Wheel Drive (4WD)</option>
                </select>
            </div>

            {/* DOORS */}
            <div className="input-group">
                <label htmlFor="doors">Number of Doors:</label>
                <input
                    type="number"
                    id="doors"
                    name="doors"
                    value={formData.doors || ""}
                    placeholder="Enter number of doors"
                    onChange={handleChange}
                />
            </div>

            {/* SEATS */}
            <div className="input-group">
                <label htmlFor="seats">Number of Seats:</label>
                <input
                    type="number"
                    id="seats"
                    name="seats"
                    value={formData.seats || ""}
                    placeholder="Enter number of seats"
                    onChange={handleChange}
                />
            </div>

            {/* BODY TYPE */}
            <div className="select-group">
                <label htmlFor="bodyType">Body Type</label>
                <select
                    id="bodyType"
                    name="bodyType"
                    value={formData.bodyType}
                    onChange={handleChange}
                >
                    <option value="">--Select body type--</option>
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
                {errors.bodyType && <span className="error-message">{errors.bodyType}</span>}
            </div>

            {/* COLOR */}
            <div className="select-group">
                <label htmlFor="color">Color</label>
                <select
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                >
                    <option value="">--Select color--</option>
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

            {/* VIN */}
            <div className="input-group">
                <label htmlFor="vin">VIN (Vehicle Identification Number):</label>
                <input
                    type="text"
                    id="vin"
                    name="vin"
                    value={formData.vin || ""}
                    placeholder="Enter VIN"
                    onChange={handleChange}
                />
            </div>

            {/* Registration Number */}
            <div className="input-group">
                <label htmlFor="registrationNumber">Registration Number:</label>
                <input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    value={formData.registrationNumber || ""}
                    placeholder="Enter registration number"
                    onChange={handleChange}
                />
            </div>

            {/* CONDITION */}
            <div className="select-group">
                <label htmlFor="condition">Condition</label>
                <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                >
                    <option value="">--Select condition--</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="certifiedPreOwned">Certified Pre-Owned</option>
                </select>
                {errors.condition && <span className="error-message">{errors.condition}</span>}
            </div>

            {/* Accident History */}
            <div className="input-group">
                <label>Has the car been in any accidents?</label>
                <div className="radio-group" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                        type="radio"
                        id="accidentYes"
                        name="accidentHistory"
                        value="true"
                        onChange={handleChange}
                        checked={formData.accidentHistory === true}
                    />
                    <label htmlFor="accidentYes">Yes</label>
                    <input
                        type="radio"
                        id="accidentNo"
                        name="accidentHistory"
                        value="false"
                        onChange={handleChange}
                        checked={formData.accidentHistory === false}
                    />
                    <label htmlFor="accidentNo">No</label>
                </div>
                {errors.accidentHistory && <span className="error-message">{errors.accidentHistory}</span>}
            </div>

            {/* Technical Inspection Date */}
            <div className="input-group">
                <label htmlFor="technicalInspectionValidUntil">Technical Inspection Valid Until:</label>
                <input
                    type="date"
                    id="technicalInspectionValidUntil"
                    name="technicalInspectionValidUntil"
                    value={formData.technicalInspectionValidUntil || ""}
                    onChange={handleChange}
                />
            </div>

            {/* PRICE */}
            <div className="input-group">
                <label htmlFor="price">Price:</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price || ""}
                    placeholder="Enter price"
                    onChange={handleChange}
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            {/* Negotiable */}
            <div className="input-group">
                <label>Is the price negotiable?</label>
                <div className="radio-group" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                        type="radio"
                        id="negotiableYes"
                        name="negotiable"
                        value="true"
                        onChange={handleChange}
                        checked={formData.negotiable === true}
                    />
                    <label htmlFor="negotiableYes">Yes</label>
                    <input
                        type="radio"
                        id="negotiableNo"
                        name="negotiable"
                        value="false"
                        onChange={handleChange}
                        checked={formData.negotiable === false}
                    />
                    <label htmlFor="negotiableNo">No</label>
                </div>
                {errors.negotiable && <span className="error-message">{errors.negotiable}</span>}
            </div>

            {/* DESCRIPTION */}
            <div className="input-group">
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    placeholder="Enter description"
                    onChange={handleChange}
                />
            </div>

            {/* BUTTON */}
            <div className="form-actions">
                <Link to={`/${car.id}`} className="cancel-btn">Cancel</Link>
                <button type="submit" className="submit-btn">Edit</button>
            </div>

            {showConfirmation && (
                <div className="confirmation-popup">
                    <div className="popup-content">
                        <h3>Edited successfully</h3>
                        <div className="popup-buttons">
                            <button
                                type="button"
                                className="submit-btn"
                                onClick={() => navigate("/" + carID)}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}

Edit.propTypes = {
    car: PropTypes.shape({
        accidentHistory: PropTypes.bool,
        bodyType: PropTypes.string,
        brand: PropTypes.string,
        color: PropTypes.string,
        condition: PropTypes.string,
        createdAt: PropTypes.string,
        description: PropTypes.string,
        doors: PropTypes.number,
        drivetrain: PropTypes.string,
        engineCapacity: PropTypes.number,
        fuelType: PropTypes.string,
        horsepower: PropTypes.number,
        id: PropTypes.number,
        imageUrls: PropTypes.arrayOf(PropTypes.string),
        location: PropTypes.string,
        mileage: PropTypes.number,
        model: PropTypes.string,
        negotiable: PropTypes.bool,
        price: PropTypes.number,
        registrationNumber: PropTypes.string,
        seats: PropTypes.number,
        technicalInspectionValidUntil: PropTypes.string,
        transmission: PropTypes.string,
        vin: PropTypes.string,
        year: PropTypes.number,
        user: PropTypes.object
    })
};

export default Edit;