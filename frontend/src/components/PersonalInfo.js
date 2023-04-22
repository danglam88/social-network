const PersonalInfo = ({data}) => {
    return (
        <div>
          <div>First Name: {data.firstName}</div>
          <div>Last Name: {data.lastName}</div>
          <div>Birth Date: {data.birthDate}</div>
          <div>Is Private: {data.isPrivate}</div>
          <div>Email: {data.email}</div>
          <div>Created At: {data.createdAt}</div>
          <div>Avatar Url: {data.avatarUrl}</div>
          <div>Nick Name: {data.nickname}</div>
          <div>About Me: {data.aboutMe}</div>
        </div>
    )
}

export default PersonalInfo
