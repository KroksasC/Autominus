import PropTypes from "prop-types"
import "../Styles/PhotoView.css"
import { Link } from "react-router-dom"
import { useState } from "react";
function CarGallery({ car }) {
    const [picId, setPicId] = useState(0);

    if (!car.imageUrls || car.imageUrls.length === 0) return null;

    const picture = car.imageUrls[picId];

    function changePictureRight() {
        setPicId((prev) => (prev + 1) % car.imageUrls.length);
    }

    function changePictureLeft() {
        setPicId((prev) => (prev - 1 + car.imageUrls.length) % car.imageUrls.length);
    }

    return (
        <div>
            <div className="car-gallery">
                {car.imageUrls && car.imageUrls.length > 0 && (
                    <>
                        {/* Main image */}
                        <div className="main-image">
                            <img src={picture} alt="Main car" />
                        </div>

                        <div className="thumbnails">
                            <button className="right-button" onClick={changePictureLeft}>{"<"}</button>
                            <button className="left-button" onClick={changePictureRight}>{">"}</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

CarGallery.propTypes = {
    car: PropTypes.shape({
        brand: PropTypes.string.isRequired,
        model: PropTypes.string.isRequired,
        year: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        id: PropTypes.number.isRequired,
        imageUrls: PropTypes.array.isRequired
    }).isRequired,
};

export default CarGallery;
