const UserItem = ({user}) => {
    return (
        <div>
            {user.nick_name ? (
                <span>{user.nick_name}</span>
            ) : (
                <span>{user.first_name} {user.last_name}</span>
            )}
        </div>
    )
}

const UserList = ({users}) => {
    return (
        <div>
            <h2>User(s):</h2>
            {users && users.map(user =>
                <UserItem user={user} key={user.id} />
            )}
        </div>
    )
}

export default UserList;
