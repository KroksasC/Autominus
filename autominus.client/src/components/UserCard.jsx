import PropTypes from "prop-types"
import "../Styles/UserCard.css"
function UserCard({ user }) {
    return (
        <div className="card">
            <p><strong>Pardavėjas</strong></p>
            <p>{user.username}</p>
            <p>{user.email}</p>
        </div>
    );
}

UserCard.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
    }).isRequired,
};

export default UserCard;
