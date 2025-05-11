import PropTypes from "prop-types"
import "../Styles/PhotoView.css"
import { useState, useEffect } from "react"
import leftArrow from "../images/left.png"
import rightArrow from "../images/right.png"
import closeIcon from "../images/cross.png"

function CarDisplay({ car }) {
    // Your string construction function
    const ConstructCarString = (car) => {
        var make = [
            car.brand,
            car.model,
            car.year,
        ].filter(Boolean);
        make = make.join(' ').replace(/\s+/g, ' ').trim();

        const parts = [
            make,
            car.bodyType,
            car.condition,
            car.transmission,
            car.fuelType,
            car.horsepower && `${car.horsepower} KW`,
            car.engineCapacity && `${car.engineCapacity} l`,
            car.mileage && `${car.mileage} km`,
            car.price && `${car.price}€`
        ].filter(Boolean);

        return parts.join(' | ').replace(/\s+/g, ' ').trim();
    };

    return (
        <div className="car-display">
            {/* Correct usage: */}
            <label className="car-text">
                {ConstructCarString(car)}
            </label>

            {/* Make sure you're not accidentally doing this anywhere: */}
            {/* {car} ← This would cause the error */}
        </div>
    );
}

function CarPhotoView({ car, initialIndex = 0, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose()
            } else if (e.key === 'ArrowRight') {
                nextImage()
            } else if (e.key === 'ArrowLeft') {
                prevImage()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [currentIndex])

    if (!car.imageUrls || car.imageUrls.length === 0) return null

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % car.imageUrls.length)
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + car.imageUrls.length) % car.imageUrls.length)
    }

    const selectImage = (index) => {
        setCurrentIndex(index)
    }

    return (
        <div className="photo-view-overlay">
            <label className="car-text"><CarDisplay car={car} /></label>
            <button className="close-button" onClick={onClose}>
                <img src={closeIcon} alt="Close" className="button-icon" />
            </button>

            <div className="photo-view-container">
                <button className="nav-button left" onClick={prevImage}>
                    <img src={leftArrow} alt="Previous" className="button-icon" />
                </button>

                <div className="photo-view-content">
                    <img
                        src={car.imageUrls[currentIndex]}
                        alt={`Car ${currentIndex + 1}`}
                        className="fullscreen-image"
                    />
                </div>

                <button className="nav-button right" onClick={nextImage}>
                    <img src={rightArrow} alt="Next" className="button-icon" />
                </button>
            </div>

            <div className="thumbnail-strip">
                {car.imageUrls.map((url, index) => (
                    <div
                        key={index}
                        className={`thumbnail-container ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => selectImage(index)}
                    >
                        <img
                            src={url}
                            alt={`Thumbnail ${index + 1}`}
                            className="thumbnail-image"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

CarPhotoView.propTypes = {
    car: PropTypes.shape({
        accidentHistory: PropTypes.bool,
        bodyType: PropTypes.string,
        brand: PropTypes.string,
        condition: PropTypes.string,
        engineCapacity: PropTypes.number,
        fuelType: PropTypes.string,
        horsepower: PropTypes.number,
        mileage: PropTypes.number,
        model: PropTypes.string,
        price: PropTypes.number,
        transmission: PropTypes.string,
        year: PropTypes.number,
        imageUrls: PropTypes.array.isRequired
    }).isRequired,
    initialIndex: PropTypes.number,
    onClose: PropTypes.func.isRequired
}

export default CarPhotoView