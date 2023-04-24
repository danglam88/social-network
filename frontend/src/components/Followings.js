const Following = ({following}) => {
    return (
        <div>
            {following.nick_name ? (
                <span>{following.nick_name}</span>
            ) : (
                <span>{following.first_name} {following.last_name}</span>
            )}
        </div>
    )
}

const Followings = ({followings}) => {
    return (
        <div>
            <h3>Following(s):</h3>
            {followings && followings.map(following =>
                <Following following={following} key={following.id} />
            )}
        </div>
    )
}

export default Followings;
