import EditImg from "../images/edit.png";
import DeleteImg from "../images/delete.png";
import "../Styles/EditDeleteButtons.css"
import { Link } from "react-router-dom"
import DeleteConfirmation from "../components/DeleteConfirmation"; 
import { useState } from "react";

function EditDeleteButtons() {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    return (
        <div>
            
            <table className="EDButtons">
                <tbody>
                    <tr>
                        <td>
                            <Link to={`/`} style={{ textDecoration: 'none' }}>
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
                <DeleteConfirmation onClose={() => setShowDeleteConfirmation(false)} />)}
        </div>
    );
}

export default EditDeleteButtons;
