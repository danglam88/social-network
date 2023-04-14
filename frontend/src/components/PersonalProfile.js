import perProfileService from "../services/PerProfileService"

const PersonalProfile = () => {
    let data = {
        token: "",
        userid: "",
        username: ""
    }

    if (document.cookie.includes("session_token")) {
        const tokens = document.cookie.split(";");
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].includes("session_token")) {
                data.token = tokens[i].split("=")[1];
                data.userid = sessionStorage.getItem("userid");
                data.username = sessionStorage.getItem("username");
            }
        }
    }
 
    perProfileService.perprofile(data)
      .then(response => {
        console.log(response)
      })
      .catch(error => console.log(error))

  return (
    <div>
        User {data.username} has been logged in before. Profile page is under construction. Remove the cookie to see login form again.
    </div>
  )
}

export default PersonalProfile
