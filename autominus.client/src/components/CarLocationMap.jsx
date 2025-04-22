import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PropTypes from "prop-types";

// Correct way to handle Leaflet marker icons in React
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

const CarLocationMap = ({ city }) => {
    const position = getCoordinatesForCity(city);

    return (
        <div style={{ height: '400px', width: '100%', marginTop: '20px' }}>
            <MapContainer
                center={position}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                    <Popup>{city || 'Automobilio vieta'}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

// Helper function - in a real app, you'd use a geocoding API
function getCoordinatesForCity(city) {
    const cityCoordinates = {
        "Vilnius": [54.6872, 25.2797],
        "Kaunas": [54.8985, 23.9036],
        "Klaipėda": [55.7033, 21.1443],
        "Šiauliai": [55.9349, 23.3136],
        "Panevėžys": [55.7378, 24.3695],
        "Alytus": [54.3966, 24.0459],
        "Marijampolė": [54.5593, 23.3541],
        "Mažeikiai": [56.3117, 22.3356],
        "Jonava": [55.0833, 24.2833],
        "Utena": [55.5, 25.6],
        "Kėdainiai": [55.2833, 23.9667],
        "Tauragė": [55.25, 22.2833],
        "Telšiai": [55.9833, 22.25],
        "Ukmergė": [55.25, 24.75],
        "Visaginas": [55.6, 26.4333],
        "Plungė": [55.9167, 21.85],
        "Kretinga": [55.8833, 21.2333],
        "Palanga": [55.9178, 21.0689],
        "Radviliškis": [55.8, 23.5333],
        "Šilutė": [55.35, 21.4833],
        "Druskininkai": [54.0167, 23.9667],
        "Gargždai": [55.7167, 21.3833],
        "Rokiškis": [55.9667, 25.5833],
        "Biržai": [56.2, 24.75],
        "Elektrėnai": [54.7833, 24.6333],
        "Kuršėnai": [55.9833, 22.9333],
        "Garliava": [54.8167, 23.8667],
        "Jurbarkas": [55.0833, 22.7667],
        "Vilkaviškis": [54.65, 23.0333],
        "Raseiniai": [55.3667, 23.1167],
        "Anykščiai": [55.5333, 25.1],
        "Lentvaris": [54.6436, 25.0517],
        "Grigiškės": [54.6833, 25.0833],
        "Naujoji Akmenė": [56.3167, 22.9],
        "Prienai": [54.6333, 23.9333],
        "Joniškis": [56.2333, 23.6167],
        "Kelmė": [55.6333, 22.9333],
        "Varėna": [54.2167, 24.5667],
        "Kaišiadorys": [54.8667, 24.45],
        "Pasvalys": [56.0667, 24.4],
        "Kupiškis": [55.8333, 24.9667],
        "Zarasai": [55.7333, 26.25],
        "Skuodas": [56.2667, 21.5333],
        "Kazlų Rūda": [54.75, 23.4833],
        "Širvintos": [55.05, 24.95],
        "Molėtai": [55.2333, 25.4167],
        "Šalčininkai": [54.3, 25.3833],
        "Šakiai": [54.95, 23.05],
        "Ignalina": [55.35, 26.1667],
        "Pabradė": [54.9833, 25.7667],
        "Švenčionys": [55.1333, 26.1667],
        "Trakai": [54.6333, 24.9333],
        "Vievis": [54.7667, 24.8],
        "Lazdijai": [54.2333, 23.5167],
        "Kalvarija": [54.4, 23.2333],
        "Rietavas": [55.7333, 21.9333],
        "Žiežmariai": [54.8, 24.45],
        "Neringa": [55.3667, 21.0667],
        "Šilalė": [55.4833, 22.1833],
        "Pakruojis": [55.9667, 23.85],
        "Švenčionėliai": [55.1667, 26.0],
        "Venta": [56.1833, 22.7],
        "Subačius": [55.7667, 24.75],
        "Baltoji Vokė": [54.45, 25.1833],
        "Dūkštas": [55.5167, 26.3167],
        "Pandėlys": [56.0167, 25.2167],
        "Dusetos": [55.75, 25.8333],
        "Užventis": [55.7833, 22.65],
        "Seda": [56.1667, 22.1],
        "Varniai": [55.7333, 22.3667],
        "Viekšniai": [56.1833, 22.5167],
        "Žagarė": [56.3667, 23.25],
        "Ežerėlis": [54.8833, 23.6167],
        "Skaudvilė": [55.4167, 22.5833],
        "Kudirkos Naumiestis": [54.7833, 22.8667],
        "Simnas": [54.3833, 23.65],
        "Salantai": [56.0667, 21.5667],
        "Linkuva": [56.0833, 23.9667],
        "Veisiejai": [54.1, 23.7],
        "Ramygala": [55.5167, 24.3],
        "Priekulė": [55.55, 21.3167],
        "Joniškėlis": [56.0333, 24.1667],
        "Jieznas": [54.6, 24.1667],
        "Daugai": [54.3667, 24.3333],
        "Obeliai": [55.9667, 25.15],
        "Vandžiogala": [55.1167, 23.95],
        "Sasnava": [54.6667, 23.5],
        "Daugėliškis": [55.5833, 25.8333],
        "Kybartai": [54.6333, 22.7667],
        "Tytuvėnai": [55.6, 23.2],
        "Troškūnai": [55.5833, 24.8667],
        "Viduklė": [55.4, 22.9],
        "Žemaičių Naumiestis": [55.3667, 21.7],
        "Eišiškės": [54.1667, 25.0],
        "Antalieptė": [55.6667, 25.8667],
        "Kurkliai": [55.4167, 25.0667],
        "Smalininkai": [55.0833, 22.5667],
        "Viešvilė": [55.0667, 22.3667],
        "Panemunė": [55.0833, 21.9167],
        "Valkininkai": [54.35, 24.8333],
        "Rūdiškės": [54.5167, 24.8333]
    };


    return cityCoordinates[city]; // Default to Vilnius if city not found
}

CarLocationMap.propTypes = {
    city: PropTypes.string, // city is optional (hence no .isRequired)
};

export default CarLocationMap;