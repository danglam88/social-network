function Followings({followings}) {
    return (
        <div>
            <h3>Following(s):</h3>
            {followings.map(following =>
                <div key={following.id}>
                    {following.nick_name ? (
                        <span>{following.nick_name}</span>
                    ) : (
                        <span>{following.first_name} {following.last_name}</span>
                    )}
                </div>
            )}
        </div>
    )
}

export default Followings;
