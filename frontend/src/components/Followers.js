const Follower = ({follower}) => {
    return (
        <div>
            {follower.nick_name ? (
                <span>{follower.nick_name}</span>
            ) : (
                <span>{follower.first_name} {follower.last_name}</span>
            )}
        </div>
    )
}

const Followers = ({followers}) => {
    return (
        <div>
            <h3>Follower(s):</h3>
            {followers && followers.map(follower =>
                <Follower follower={follower} key={follower.id} />
            )}
        </div>
    )
}

export default Followers;
