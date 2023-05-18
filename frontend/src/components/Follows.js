const Follow = ({ follow }) => {
    return (
      <>
        {follow.nick_name ? (
          <li>
            <div><img
              className="avatar-symbol"
              src={`http://localhost:8080${follow.avatar_url}`}
            /></div>
            <div>{follow.nick_name}</div>
          </li>
        ) : (
          <li>
            <div><img
              className="avatar-symbol"
              src={`http://localhost:8080${follow.avatar_url}`}
            /></div>
            <div>{follow.first_name} {follow.last_name}</div>
          </li>
        )}
      </>
    );
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
