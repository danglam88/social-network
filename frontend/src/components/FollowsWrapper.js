import React, { useState } from "react";
import Follows from './Follows';

const FollowsWrapper = ({userId, follows, title, handleShowPendings}) => {
    const [followsVisible, setFollowsVisible] = useState(false)

    const toggleFollows = () => {
        setFollowsVisible(!followsVisible)
        handleShowPendings(userId)
    }

    follows.sort(function(a, b) {
        var nameA = a.nick_name || a.first_name + " " + a.last_name;
        var nameB = b.nick_name || b.first_name + " " + b.last_name;
        return nameA.localeCompare(nameB);
      });

    return (
        <div className="follow-options-menu">
            <div><button className="button-small" onClick={toggleFollows}>{title}</button></div>
            {followsVisible && <Follows follows={follows} />}
        </div>
    )
}

export default FollowsWrapper;
