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
            <div><button className="button-small" onClick={toggleFollows}>{title}</button></div>
            {followsVisible && <Follows follows={follows} />}
        </div>
    )
}

export default FollowsWrapper;
