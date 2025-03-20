import EditImg from "../images/edit.png";
import DeleteImg from "../images/delete.png";
import "../Styles/EditDeleteButtons.css"
import { Link } from "react-router-dom"
function EditDeleteButtons() {
    return (
        <div>
            <table className="EDButtons">
                <tbody>
                    <tr>
                        <td>
                            <Link to={`/`} style={{ textDecoration: 'none' }}>
                                <img className="Edit" src={EditImg} alt="Redaguoti"></img>
                            </Link>
                        </td>
                        <td>
                            <Link to={`/`} style={{ textDecoration: 'none' }}>
                                <img className="Delete" src={DeleteImg} alt="Pašalinti"></img>
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default EditDeleteButtons;
