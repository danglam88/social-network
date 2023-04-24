const Follow = ({follow}) => {
    return (
        <div>
            {follow.nick_name ? (
                <span>{follow.nick_name}</span>
            ) : (
                <span>{follow.first_name} {follow.last_name}</span>
            )}
        </div>
    )
}

const Follows = ({follows, title}) => {
    return (
        <div>
            <h3>{title}</h3>
            {follows && follows.map(follow =>
                <Follow follow={follow} key={follow.id} />
            )}
        </div>
    )
}

export default Follows;
