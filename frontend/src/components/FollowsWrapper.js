import React, { useState } from "react";
import Follows from './Follows';

const FollowsWrapper = ({userId, follows, title, handleShowPendings}) => {
    const [followsVisible, setFollowsVisible] = useState(false)

    const toggleFollows = () => {
        setFollowsVisible(!followsVisible)
        handleShowPendings(userId)
    }

    return (
        <div class="main-wrapper">
            <button className="button-small" onClick={toggleFollows}>Show/Hide {title}</button>
            {followsVisible && <Follows userId={userId} follows={follows} title={title} handleShowPendings={handleShowPendings} />}
        </div>
    )
}

export default FollowsWrapper;
