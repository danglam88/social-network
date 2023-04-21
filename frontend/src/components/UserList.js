function UserList({users}) {
    return (
        <table>
            <thead>
                <h2>User(s):</h2>
                <tr>
                    <th>FirstName</th>
                    <th>LastName</th>
                    <th>Email</th>
                    <th>NickName</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user =>
                    <tr id={user.id}>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.email}</td>
                        <td>{user.nick_name}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

export default UserList;
