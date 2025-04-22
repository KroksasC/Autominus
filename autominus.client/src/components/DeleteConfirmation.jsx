import PropTypes from "prop-types";
import "../Styles/DeleteConfirmation.css"; // Ensure this file exists
import DeleteCar from "../API/DeleteCar";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react"; // Import useState for managing state

const DeleteConfirmation = ({ onClose, carUserId }) => {
    const { id } = useParams();
    const navigate = useNavigate();  // Use navigate hook for redirect
    const [isDeleted, setIsDeleted] = useState(false); // State to track if the car was deleted
    const handleDelete = () => {
        DeleteCar(id, carUserId)
            .then(() => {
                console.log("Car deleted successfully");
                setIsDeleted(true);  // Change the state to show success message
            })
            .catch((error) => {
                console.error("Failed to delete car:", error);
                // Optionally, handle error (show a failure message, for example)
            });
    };

    const handleRedirect = () => {
        navigate("/");  // Redirect to the home page
    };

    return (
        <div className="overlay">
            <div className="modal">
                {!isDeleted ? (
                    <>
                        <p><strong>Ar tikrai norite pašalinti skelbimą?</strong></p>
                        <table className="modal-buttons">
                            <tbody>
                                <tr>
                                    <td>
                                        <button className="confirm" onClick={handleDelete}>Taip</button>
                                    </td>
                                    <td>
                                        <button className="cancel" onClick={onClose}>Ne</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                ) : (
                    <div>
                        <p><strong>Automobilis sėkmingai pašalintas</strong></p>
                        <br></br>
                        <button className="confirm" onClick={handleRedirect}>Grįžti į pagrindinį</button>
                    </div>
                )}
            </div>
        </div>
    );
};

DeleteConfirmation.propTypes = {
    onClose: PropTypes.func.isRequired,
    carUserId: PropTypes.func.isRequired,
};

export default DeleteConfirmation;
