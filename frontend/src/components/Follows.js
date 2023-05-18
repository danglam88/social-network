const Follow = ({ follow }) => {
    return (
        <>
            {follow.nick_name ? (
                <li><img className="avatar-symbol" src={`http://localhost:8080${follow.avatar_url}`}/>{follow.nick_name}</li>
            ) : (
                <li><img className="avatar-symbol" src={`http://localhost:8080${follow.avatar_url}`}/>{follow.first_name} {follow.last_name}</li>
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
