import React, { useState, useEffect } from 'react'
import usersService from "../services/UsersService"
import UserList from './UserList'

const Users = () => {
    const [users, setUsers] = useState([])
    const [usersVisible, setUsersVisible] = useState(false)

    useEffect(() => {
        usersService.users()
            .then(response => {
                setUsers(response.data)
            })
            .catch(error => console.log(error))
    }, [])

    const toggleUsers = () => {
        setUsersVisible(!usersVisible)
    }

    return (
        <div>
            {users.length > 0 &&
            <div>
                <button onClick={toggleUsers}>Show/Hide Users</button>
                {usersVisible && <UserList users={users} />}
            </div>}
        </div>
    )
}

export default Users
