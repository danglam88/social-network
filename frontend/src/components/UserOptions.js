const UserOptions = ({ handleShowPersonalProfile, handleLogout }) => {
    return (
        <ul className="user-options">
            <li onClick={handleShowPersonalProfile}>Profile Page</li>
            <li onClick={handleLogout}>Logout</li>
        </ul>
    );
}

export default UserOptions;
