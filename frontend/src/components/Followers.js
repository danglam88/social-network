function Followers(props) {
    return (
        <table>
            <thead>
                <h2>Follower(s):</h2>
                <tr>
                    <th>FirstName</th>
                    <th>LastName</th>
                    <th>Email</th>
                    <th>NickName</th>
                </tr>
            </thead>
            <tbody>
                {props.followers.map(follower =>
                    <tr id={follower.id}>
                        <td>{follower.first_name}</td>
                        <td>{follower.last_name}</td>
                        <td>{follower.email}</td>
                        <td>{follower.nick_name}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

export default Followers;
