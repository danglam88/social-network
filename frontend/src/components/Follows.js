const Follow = ({ follow }) => {
    return (
        <li>
            {follow.nick_name ? (
                <div>{follow.nick_name}</div>
            ) : (
                <div>{follow.first_name} {follow.last_name}</div>
            )}
        </li>
    )
}

const Follows = ({ follows }) => {
    return (
        <ul className="follow-options">
            {follows.map(follow => {
                const followKey = "follow" + follow.id;
                return <Follow follow={follow} key={followKey} />
            })}
        </ul>
    )
}

export default Follows;
