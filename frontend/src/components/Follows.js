import React, { useState } from 'react';
import followsService from "../services/FollowsService";

const Follow = ({user_id, follow, title, handleShowPendings}) => {
    const [pendingResolved, setPendingResolved] = useState(false)

    const resolvePending = (accept) => {
        followsService.pending({user_id, follow, accept})
            .then(response => {
                if (response.data.Status === "ok") {
                    setPendingResolved(true)
                    handleShowPendings(user_id)
                }
            })
            .catch(error => console.log(error))
    }

    return (
        <div>
            {!pendingResolved &&
            <div>
                {follow.nick_name ? (
                    <div>{follow.nick_name} {title === "Pending(s):" &&
                    <span>
                        <button onClick={() => {resolvePending(true)}}>Accept</button>
                        <button onClick={() => {resolvePending(false)}}>Reject</button>
                    </span>}</div>
                ) : (
                    <div>{follow.first_name} {follow.last_name} {title === "Pending(s):" &&
                    <span>
                        <button onClick={() => {resolvePending(true)}}>Accept</button>
                        <button onClick={() => {resolvePending(false)}}>Reject</button>
                    </span>}</div>
                )}
            </div>}
        </div>
    )
}

const Follows = ({userId, follows, title, handleShowPendings}) => {
    return (
        <div>
            <h3>{title}</h3>
            {follows && follows.map(follow => {
                const followKey = "follow" + follow.id;
                return <Follow user_id={userId} follow={follow} key={followKey} title={title} handleShowPendings={handleShowPendings} />
            })}
        </div>
    )
}

export default Follows;
