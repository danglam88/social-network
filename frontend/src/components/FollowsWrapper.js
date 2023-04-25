import React, { useState } from "react";
import Follows from './Follows'

const FollowsWrapper = ({follows, title}) => {
    const [followsVisible, setFollowsVisible] = useState(false)

    const toggleFollows = () => {
        setFollowsVisible(!followsVisible)
    }

    return (
        <div>
            <button onClick={toggleFollows}>Show/Hide {title}</button>
            {followsVisible && <Follows follows={follows} title={title} />}
        </div>
    )
}

export default FollowsWrapper;
