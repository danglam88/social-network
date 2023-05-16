const Follow = ({ follow }) => {
    return (
        <>
            {follow.nick_name ? (
                <li>{follow.nick_name}</li>
            ) : (
                <li>{follow.first_name} {follow.last_name}</li>
            )}
        </>
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
