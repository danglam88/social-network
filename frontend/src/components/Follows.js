import React, { useState } from 'react';
import followsService from "../services/FollowsService";

const Follow = ({user_id, follow, title, handleShowPendings}) => {
    const [pendingResolved, setPendingResolved] = useState(false)

    const resolvePending = (accept) => {
        const follow_id = follow.id

        followsService.pending({user_id, follow_id, accept})
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
                    <div>{follow.nick_name} {title === "Pendings" &&
                    <span>
                        <button onClick={() => {resolvePending(true)}}>Accept</button>
                        <button onClick={() => {resolvePending(false)}}>Reject</button>
                    </span>}</div>
                ) : (
                    <div>{follow.first_name} {follow.last_name} {title === "Pendings" &&
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
            <br />
            {follows.map(follow => {
                const followKey = "follow" + follow.id;
                return <Follow user_id={userId} follow={follow} key={followKey} title={title} handleShowPendings={handleShowPendings} />
            })}
        </div>
    )
}

export default Follows;
