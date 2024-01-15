export const setUserDetails = (user) => {
    localStorage.setItem("vjw-ad-user", user)
    localStorage.setItem("vjw-ad-token", JSON.parse(user)?.token);
}

export const fetchUserDetails = () => {
    return localStorage.getItem("vjw-ad-user")
}

export const logOut = () => {
    localStorage.removeItem("vjw-ad-user")
}

export const setLogged = () => {
    localStorage.setItem("vj-logged", true)
}
export const checkLogged = () => {
    if (localStorage.getItem("vj-logged"))
        return true
    else return false
}
