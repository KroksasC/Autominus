import PropTypes from "prop-types"
import "../Styles/Gallery.css"
import { useState } from "react"
import CarPhotoView from "./CarPhotoView"

function Gallery({ car }) {
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const openFullscreen = (index) => {
        setCurrentImageIndex(index)
        setIsFullscreen(true)
    }

    return (
        <div>
            <div className="car-gallery">
                {car.imageUrls && car.imageUrls.length > 0 && (
                    <>
                        {/* Main image */}
                        <div className="main-image" onClick={() => openFullscreen(0)}>
                            <img src={car.imageUrls[0]} alt="Main car" />
                        </div>

                        {/* Thumbnail images (up to 5), with overlay if more */}
                        <div className="thumbnails">
                            {car.imageUrls.slice(1, 5).map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Car ${index + 1}`}
                                    onClick={() => openFullscreen(index + 1)}
                                />
                            ))}

                            {car.imageUrls.length > 6 && (
                                <div
                                    className="thumbnail-overlay"
                                    onClick={() => openFullscreen(5)}
                                >
                                    <img src={car.imageUrls[5]} alt={`Car 6`} />
                                    <div className="overlay-text">
                                        +{car.imageUrls.length - 6}
                                    </div>
                                </div>
                            )}

                            {car.imageUrls.length === 6 && (
                                <img
                                    src={car.imageUrls[5]}
                                    alt={`Car 6`}
                                    onClick={() => openFullscreen(5)}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>

            {isFullscreen && (
                <CarPhotoView
                    car={car}
                    initialIndex={currentImageIndex}
                    onClose={() => setIsFullscreen(false)}
                />
            )}
        </div>
    )
}

Gallery.propTypes = {
    car: PropTypes.shape({
        brand: PropTypes.string.isRequired,
        model: PropTypes.string.isRequired,
        year: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        id: PropTypes.number.isRequired,
        imageUrls: PropTypes.array.isRequired
    }).isRequired,
}

export default Gallery