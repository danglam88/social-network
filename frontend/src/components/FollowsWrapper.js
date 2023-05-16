import React, { useState } from "react";
import Follows from './Follows';

const FollowsWrapper = ({userId, follows, title, handleShowPendings}) => {
    const [followsVisible, setFollowsVisible] = useState(false)

    const toggleFollows = () => {
        setFollowsVisible(!followsVisible)
        handleShowPendings(userId)
    }

    return (
        <div className="follow-options-menu">
            <button className="button-small" onClick={toggleFollows}>Show/Hide {title}</button>
            {followsVisible && <Follows follows={follows} />}
        </div>
    )
}

export default FollowsWrapper;
