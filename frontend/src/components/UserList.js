function UserList({users}) {
    return (
        <div>
            <h2>User(s):</h2>
            {users.map(user =>
                <div id={user.id}>
                    {user.nick_name ? (
                        <span>{user.nick_name}</span>
                    ) : (
                        <span>{user.first_name} {user.last_name}</span>
                    )}
                </div>
            )}
        </div>
    )
}

export default UserList;
