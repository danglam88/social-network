const PersonalInfo = ({user}) => {
    return (
        <div className="personal-info">
          <div>First Name: {user.first_name}</div>
          <div>Last Name: {user.last_name}</div>
          <div>Birth Date: {user.birth_date}</div>
          <div>Is Private: {user.is_private}</div>
          <div>Email: {user.email}</div>
          <div>Created At: {user.created_at}</div>
          {user.avatar_url && <div>Avatar Url: {user.avatar_url}</div>}
          {user.nick_name && <div>Nick Name: {user.nick_name}</div>}
          {user.about_me && <div>About Me: {user.about_me}</div>}
        </div>
    )
}

export default PersonalInfo
