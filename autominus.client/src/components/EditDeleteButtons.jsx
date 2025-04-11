import EditImg from "../images/edit.png";
import DeleteImg from "../images/delete.png";
import "../Styles/EditDeleteButtons.css"
import { Link } from "react-router-dom"
import DeleteConfirmation from "../components/DeleteConfirmation"; 
import { useState } from "react";
import PropTypes from "prop-types";

function EditDeleteButtons({ car }) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const userId = localStorage.getItem("userId");
    if (userId == car.user.id) {
        return (
            <div>

                <table className="EDButtons">
                    <tbody>
                        <tr>
                            <td>
                                <Link
                                    to="/edit"
                                    state={{ car }}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <img className="Edit" src={EditImg} alt="Redaguoti" />
                                </Link>
                            </td>
                            <td>
                                <button
                                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                                    onClick={() => setShowDeleteConfirmation(true)}
                                >

                                    <img className="Delete" src={DeleteImg} alt="Pašalinti"></img>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {showDeleteConfirmation && (
                    <DeleteConfirmation
                        onClose={() => setShowDeleteConfirmation(false)}
                        carUserId={car.user.id}
                    />)}
            </div>
        );
    }
    return (
        <p></p>
    );
}

export default EditDeleteButtons;

EditDeleteButtons.propTypes = {
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
