const Follow = ({follow}) => {
    return (
        <div>
            {follow.nick_name ? (
                <div>{follow.nick_name}</div>
            ) : (
                <div>{follow.first_name} {follow.last_name}</div>
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
