import { useState } from "react";
import "../Styles/Posting.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import postCarListing from "../API/PostCars"
import { supabase } from "../API/supabaseClient";
import NavBar from "../components/NavBar";



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

const brandYears = {
    Acura: { start: 1986, end: 2025 },
    "Alfa Romeo": { start: 1910, end: 2025 },
    "Aston Martin": { start: 1913, end: 2025 },
    Audi: { start: 1910, end: 2025 },
    Bentley: { start: 1919, end: 2025 },
    BMW: { start: 1916, end: 2025 },
    Bugatti: { start: 1909, end: 2025 },
    Buick: { start: 1903, end: 2025 },
    Cadillac: { start: 1902, end: 2025 },
    Chevrolet: { start: 1911, end: 2025 },
    Chrysler: { start: 1925, end: 2025 },
    Citroen: { start: 1919, end: 2025 },
    Dodge: { start: 1900, end: 2025 },
    Ferrari: { start: 1947, end: 2025 },
    Fiat: { start: 1899, end: 2025 },
    Ford: { start: 1903, end: 2025 },
    Genesis: { start: 2015, end: 2025 },
    GMC: { start: 1911, end: 2025 },
    Honda: { start: 1948, end: 2025 },
    Hyundai: { start: 1967, end: 2025 },
    Infiniti: { start: 1989, end: 2025 },
    Jaguar: { start: 1922, end: 2025 },
    Jeep: { start: 1941, end: 2025 },
    Kia: { start: 1944, end: 2025 },
    Lamborghini: { start: 1963, end: 2025 },
    "Land Rover": { start: 1948, end: 2025 },
    Lexus: { start: 1989, end: 2025 },
    Lincoln: { start: 1917, end: 2025 },
    Maserati: { start: 1914, end: 2025 },
    Mazda: { start: 1920, end: 2025 },
    McLaren: { start: 1963, end: 2025 },
    Mercedes: { start: 1926, end: 2025 },
    Mini: { start: 1959, end: 2025 },
    Mitsubishi: { start: 1917, end: 2025 },
    Nissan: { start: 1933, end: 2025 },
    Pagani: { start: 1992, end: 2025 },
    Peugeot: { start: 1889, end: 2025 },
    Polestar: { start: 2017, end: 2025 },
    Porsche: { start: 1948, end: 2025 },
    Ram: { start: 2009, end: 2025 },
    Renault: { start: 1899, end: 2025 },
    "Rolls Royce": { start: 1904, end: 2025 },
    Saab: { start: 1945, end: 2011 },
    Smart: { start: 1994, end: 2025 },
    Subaru: { start: 1953, end: 2025 },
    Suzuki: { start: 1909, end: 2025 },
    Tesla: { start: 2003, end: 2025 },
    Toyota: { start: 1937, end: 2025 },
    Volkswagen: { start: 1937, end: 2025 },
    Volvo: { start: 1927, end: 2025 }
};
function Posting() {

    const [formData, setFormData] = useState({
        "brand": "",
        "model": "",
        "year": 0,
        "mileage": 0,
        "fuelType": "",
        "transmission": "",
        "engineCapacity": 0,
        "horsepower": 0,
        "drivetrain": "",
        "doors": 0,
        "seats": 0,
        "bodyType": "",
        "color": "",
        "vin": "",
        "registrationNumber": "",
        "condition": "",
        "accidentHistory": undefined,
        "technicalInspectionValidUntil": "",
        "price": 0,
        "negotiable": undefined,
        "description": "",
        "imageUrls": [],
        "location": "",
        "createdAt": "",
        "user": {
            id: 0
        }
    });

    const [errors, setErrors] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = [
            'brand', 'model', 'year', 'fuelType', 'transmission',
            'horsepower', 'bodyType', 'condition', 'price'
        ];

        requiredFields.forEach(field => {
            if (!formData[field]) {
                // Create display names by splitting camelCase and capitalizing
                let displayName = field;
                if (field === 'fuelType') displayName = 'Kuro tipas yra privalomas';
                else if (field === 'brand') displayName = 'Markė yra privaloma';
                else if (field === 'model') displayName = 'Modelis yra privalomas';
                else if (field === 'year') displayName = 'Metai yra privalomi';
                else if (field === 'transmission') displayName = 'Pavarų dėžė yra privaloma';
                else if (field === 'price') displayName = 'Kaina yra privaloma';
                else if (field === 'condition') displayName = 'Būklė yra privaloma';
                else if (field === 'horsepower') displayName = 'Variklio galia yra privaloma';
                else if (field === 'bodyType') displayName = 'Kėbulo tipas yra privalomas';
                else displayName = field.charAt(0).toUpperCase() + field.slice(1);

                newErrors[field] = displayName;
            }
        });

        if (formData.mileage !== 0 && (Number(formData.mileage) < 0 || Number(formData.mileage) > 1500000)) newErrors.mileage = "Rida turi būti tarp 0 ir 1 500 000";
        if (formData.engineCapacity !== 0 && (Number(formData.engineCapacity) < 0.5 || Number(formData.engineCapacity) > 10)) newErrors.engineCapacity = "Variklio tūris turi būti tarp 0.5 ir 10";
        if (formData.horsepower !== 0 && (Number(formData.horsepower) < 15 || Number(formData.horsepower) > 1500)) newErrors.horsepower = "Variklio galia turi būti tarp 15 ir 1500";
        if (formData.doors !== 0 && (Number(formData.doors) < 2 || Number(formData.doors) > 6)) newErrors.doors = "Durų skaičius turi būti tarp 2 ir 6";
        if (formData.seats !== 0 && (Number(formData.seats) < 1 || Number(formData.seats) > 9)) newErrors.seats = "Sėdimų vietų skaičius turi būti tarp 1 ir 9";
        if (formData.price !== 0 && (Number(formData.price) < 100 || Number(formData.seats) > 1000000)) newErrors.price = "Kaina turi būti tarp 100 ir 1000000";
        if (formData.vin !== "" && formData.vin.length != 17) newErrors.vin = "VIN numeris turi susidaryti iš 17 simbolių";
        if (formData.registrationNumber !== "" && (formData.registrationNumber.length < 4 || formData.registrationNumber.length > 10)) newErrors.registrationNumber = "Regisracijos numeryje turi būti tarp 4 ir 10 simbolių";

        // Special validation for radio buttons
        if (formData.accidentHistory === undefined) {
            newErrors.accidentHistory = "Pasirinkite avarijų istoriją";
        }
        if (formData.negotiable === undefined) {
            newErrors.negotiable = "Pasirinkite ar kaina derinama";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleFileChange = async (e) => {
        const files = e.target.files;
        const urls = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
            const filePath = `img-bucket/${fileName}`;

            const { error } = await supabase.storage
                .from('img-bucket') // tavo Supabase bucket pavadinimas
                .upload(filePath, file);

            if (error) {
                console.error("Failed to upload file:", error);
            } else {
                const { data: publicUrlData } = supabase.storage
                    .from('img-bucket')
                    .getPublicUrl(filePath);
                urls.push(publicUrlData.publicUrl);
            }
        }

        setFormData((prev) => ({
            ...prev,
            imageUrls: [...prev.imageUrls, ...urls]
        }));
    };


    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        let newValue = value;
        if (type === "checkbox") {
            newValue = checked;
        } else if (name === "accidentHistory" || name === "negotiable") {
            newValue = value === "true";
        } else if (type === "file") {
            newValue = Array.from(files); // Handle file input
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
        if (!isValid) {
            return;
        }

        const updatedFormData = {
            ...formData,
            user: { id: userId }, // Ensure ID is a number
            year: Number(formData.year), // Convert to integer
            mileage: Number(formData.mileage), // Convert to integer
            engineCapacity: parseFloat(formData.engineCapacity), // Convert to float
            horsepower: Number(formData.horsepower), // Convert to integer
            doors: Number(formData.doors), // Convert to integer
            seats: Number(formData.seats), // Convert to integer
            price: parseFloat(formData.price), // Convert to float
            createdAt: new Date().toISOString(), // Ensure correct date format
            technicalInspectionValidUntil: formData.technicalInspectionValidUntil ? new Date(formData.technicalInspectionValidUntil).toISOString() : null, // Handle nullable date
            imageUrls: formData.imageUrls.filter(url => url.trim() !== ""), // Remove empty URLs
        };

        console.log("Updated Form Data:", updatedFormData); // Debugging output

        try {
            const response = await postCarListing(updatedFormData);
            console.log("Car listing posted successfully!", response);
        } catch (error) {
            console.error("Failed to post listing:", error);
        }
        setShowConfirmation(true);
    };

    const [selectedCar, setSelectedCar] = useState("");

    return (
        <div>
            <NavBar className="NavBar" />
        <form className="main" onSubmit={handleSubmit}>
            {/* BRAND */}
            <div className="select-group">
                <label htmlFor="brand">Markė</label>
                <select id="brand" name="brand" onChange={(e) => {
                    setSelectedCar(e.target.value);
                    handleChange(e);
                }}>
                    <option value="">--Pasirinkite markę--</option>
                    {Object.keys(carModels).map((car) => (
                        <option key={car} value={car}>{car.charAt(0).toUpperCase() + car.slice(1)}</option>
                    ))}
                </select>
                {errors.brand && <span className="error-message">{errors.brand}</span>}
            </div>

            {/* MODEL */}
            <div className="select-group">
                <label htmlFor="model">Modelis</label>
                <select id="model" name="model" onChange={handleChange} value={formData.model}>
                    <option value="">--Pasirinkite modelį--</option>
                    {selectedCar &&
                        carModels[selectedCar]?.map((model) => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                </select>
                {errors.model && <span className="error-message">{errors.model}</span>}
            </div>

                {/* YEAR */}
                <div className="select-group">
                    <label htmlFor="year">Metai</label>
                    <select
                        id="year"
                        name="year"
                        onChange={handleChange}
                        value={formData.year}
                        disabled={!formData.brand} // Disable if no brand selected
                    >
                        <option value="">--Pasirinkite metus--</option>
                        {formData.brand &&
                            Array.from(
                                { length: brandYears[formData.brand].end - brandYears[formData.brand].start + 1 },
                                (_, index) => brandYears[formData.brand].start + index
                            ).map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))
                        }
                    </select>
                    {errors.year && <span className="error-message">{errors.year}</span>}
                </div>

            {/* MILEAGE */}
            <div className="input-group">
                <label htmlFor="mileage">Rida (km)</label>
                    <input type="number" id="mileage" name="mileage" placeholder="Įveskite ridą" onChange={handleChange} />
                    {errors.mileage && <span className="error-message">{errors.mileage}</span>}
            </div>

            {/* FUEL TYPE */}
            <div className="select-group">
                <label htmlFor="fuelType">Kuro tipas</label>
                <select id="fuelType" name="fuelType" onChange={handleChange} value={formData.fuelType}>
                    <option value="">--Pasirinkite kuro tipą--</option>
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
                {errors.fuelType && <span className="error-message">{errors.fuelType}</span>}
            </div>

            {/* TRANSMISSION */}
            <div className="select-group">
                <label htmlFor="transmission">Pavarų dėžė</label>
                <select id="transmission" name="transmission" onChange={handleChange} value={formData.transmission}>
                    <option value="">--Pasirinkite pavarų dėžę--</option>
                    <option value="Mechaninė">Mechaninė</option>
                    <option value="Automatinė">Automatinė</option>
                </select>
                {errors.transmission && <span className="error-message">{errors.transmission}</span>}
            </div>

            {/* ENGINE CAPACITY */}
            <div className="input-group">
                <label htmlFor="engineCapacity">Variklio tūris (L)</label>
                <input type="number" id="engineCapacity" name="engineCapacity" placeholder="Įveskite variklio tūrį" step="0.1" onChange={handleChange}/>
                {errors.engineCapacity && <span className="error-message">{errors.engineCapacity}</span>}
            </div>

            {/* HORSE POWER */}
            <div className="input-group">
                <label htmlFor="horsepower">Variklio galia (KW)</label>
                <input type="number" id="horsepower" name="horsepower" placeholder="Įveskite variklio galią" onChange={handleChange} />
                {errors.horsepower && <span className="error-message">{errors.horsepower}</span>}
            </div>

            {/* DRIVETRAIN */}
            <div className="select-group">
                <label htmlFor="drivetrain">Varantieji ratai</label>
                <select id="drivetrain" name="drivetrain" onChange={handleChange} value={formData.drivetrain}>
                    <option value="">--Pasirinkite varančiuosius ratus--</option>
                    <option value="Visi varantys (4x4)">Visi varantys (4x4)</option>
                    <option value="Galiniai">Galiniai</option>
                    <option value="Priekiniai">Priekiniai</option>
                </select>
            </div>

            {/* DOORS */}
            <div className="input-group">
                <label htmlFor="doors">Durų skaičius</label>
                    <input type="number" id="doors" name="doors" placeholder="Įveskite durų skaičių" onChange={handleChange} />
                    {errors.doors && <span className="error-message">{errors.doors}</span>}
            </div>

            {/* SEATS */}
            <div className="input-group">
                <label htmlFor="seats">Sėdimų vietų skaičius:</label>
                    <input type="number" id="seats" name="seats" placeholder="Įveskite sėdimų vietų skaičių" onChange={handleChange} />
                    {errors.seats && <span className="error-message">{errors.seats}</span>}
            </div>

            {/* BODY TYPE */}
            <div className="select-group">
                <label htmlFor="bodyType">Kėbulo tipas</label>
                <select id="bodyType" name="bodyType" onChange={handleChange} value={formData.bodyType}>
                    <option value="">--Pasirinkite kėbulo tipą--</option>
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
                {errors.bodyType && <span className="error-message">{errors.bodyType}</span>}
            </div>

            {/* COLOR */}
            <div className="select-group">
                <label htmlFor="color">Spalva</label>
                <select id="color" name="color" onChange={handleChange} value={formData.color}>
                    <option value="">--Pasirinkite spalvą--</option>
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

            {/* VIN */}
            <div className="input-group">
                <label htmlFor="vin">VIN numeris</label>
                    <input type="text" id="vin" name="vin" placeholder="Įveskite VIN numerį" onChange={handleChange} value={formData.vin} />
                    {errors.vin && <span className="error-message">{errors.vin}</span>}
            </div>

            {/* Registration Number */}
            <div className="input-group">
                <label htmlFor="registrationNumber">Registracijos numeris</label>
                    <input type="text" id="registrationNumber" name="registrationNumber" placeholder="Įveskite registracijos numerį" onChange={handleChange} />
                    {errors.registrationNumber && <span className="error-message">{errors.registrationNumber}</span>}
            </div>

            {/* CONDITION */}
            <div className="select-group">
                <label htmlFor="condition">Būklė</label>
                <select id="condition" name="condition" onChange={handleChange} value={formData.condition}>
                    <option value="">--Pasirinkite būklę--</option>
                    <option value="Nauja">Nauja</option>
                    <option value="Naudota">Naudota</option>
                    <option value="Sertifikuotas naudotas">Sertifikuotas naudotas</option>
                </select>
                {errors.condition && <span className="error-message">{errors.condition}</span>}
            </div>

            {/* Accident History */}
            <div className="input-group">
                <label>Ar automobilis buvo daužtas?</label>

                <div className="radio-group" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                        type="radio"
                        id="accidentYes"
                        name="accidentHistory"
                        value="true"
                        onChange={handleChange}
                        checked={formData.accidentHistory === true}  // compare to boolean true
                    />
                    <label htmlFor="accidentYes">Taip</label>
                    <input
                        type="radio"
                        id="accidentNo"
                        name="accidentHistory"
                        value="false"
                        onChange={handleChange}
                        checked={formData.accidentHistory === false} // compare to boolean false
                    />
                    <label htmlFor="accidentNo">Ne</label>
                </div>
                {errors.accidentHistory && <span className="error-message">{errors.accidentHistory}</span>}
            </div>

            {/* Technical Inspection Date */}
            <div className="input-group">
                <label htmlFor="technicalInspectionValidUntil">Tech. apžiūra iki</label>
                    <input type="date" id="technicalInspectionValidUntil" name="technicalInspectionValidUntil" onChange={handleChange} min={new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString().split('T')[0]}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split('T')[0]} />
            </div>

            {/* PRICE */}
            <div className="input-group">
                <label htmlFor="price">Kaina (€)</label>
                <input type="number" id="price" name="price" placeholder="Įveskite kainą" onChange={handleChange} />
                {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            {/* Negotiable */}
            <div className="input-group">
                <label>Ar kaina derinama?</label>

                <div className="radio-group" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                        type="radio"
                        id="negotiableYes"
                        name="negotiable"
                        value="true"
                        onChange={handleChange}
                        checked={formData.negotiable === true}  // compare to boolean true
                    />
                    <label htmlFor="negotiableYes">Taip</label>
                    <input
                        type="radio"
                        id="negotiableNo"
                        name="negotiable"
                        value="false"
                        onChange={handleChange}
                        checked={formData.negotiable === false} // compare to boolean false
                    />
                    <label htmlFor="negotiableNo">Ne</label>
                </div>
                {errors.negotiable && <span className="error-message">{errors.negotiable}</span>}
            </div>

            {/* DESCRIPTION */}
            <div className="input-group">
                <label className="car_posting_header">Aprašymas:</label>
                <textarea id="description" name="description" placeholder="Įveskite aprašymą" onChange={handleChange}></textarea>
            </div>

            {/* BUTTON */}
            <div className="form-actions">
                <Link to="/" className="cancel-btn">Atšaukti</Link>
                <button type="submit" className="submit-btn">Įkelti</button>
            </div>

            <div className="input-group">
                <label htmlFor="images">Upload Images:</label>
                <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {showConfirmation && (
                <div className="confirmation-popup">
                    <div className="popup-content">
                        <h3>Patvirtinkite pateikimą</h3>
                        <p>Ar tikrai norite įkelti šį automobilio skelbimą?</p>
                        <div className="popup-buttons">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setShowConfirmation(false)}
                            >
                                Atšaukti
                            </button>
                            <button
                                type="button"
                                className="submit-btn"
                                onClick={() => navigate("/")}  // Just navigate directly
                            >
                                Patvirtinti
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </form>
        </div>
    );
}

export default Posting;