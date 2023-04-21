function Followings(props) {
    return (
        <table>
            <thead>
                <h2>Following(s):</h2>
                <tr>
                    <th>FirstName</th>
                    <th>LastName</th>
                    <th>Email</th>
                    <th>NickName</th>
                </tr>
            </thead>
            <tbody>
                {props.followings.map(following =>
                    <tr id={following.id}>
                        <td>{following.first_name}</td>
                        <td>{following.last_name}</td>
                        <td>{following.email}</td>
                        <td>{following.nick_name}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

export default Followings;
