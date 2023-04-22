function Followers({followers}) {
    return (
        <div>
            <h3>Follower(s):</h3>
            {followers.map(follower =>
                <div id={follower.id}>
                    {follower.nick_name ? (
                        <span>{follower.nick_name}</span>
                    ) : (
                        <span>{follower.first_name} {follower.last_name}</span>
                    )}
                </div>
            )}
        </div>
    )
}

export default Followers;
