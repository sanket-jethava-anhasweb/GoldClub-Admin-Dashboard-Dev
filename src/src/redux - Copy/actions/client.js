import { actionConstants } from "../../constants/actionConstants"
export const openSideNav = () => async (dispatch) => {
    dispatch(
        {
            type: actionConstants.OPEN_SIDENAV,
        }
    )
}
export const closeSideNav = () => async (dispatch) => {
    dispatch(
        {
            type: actionConstants.CLOSE_SIDENAV,
        }
    )
}
export const openMessage = () => async (dispatch) => {
    dispatch(
        {
            type: actionConstants.OPEN_MESSAGE,
        }
    )
}
export const closeMessage = () => async (dispatch) => {
    dispatch(
        {
            type: actionConstants.CLOSE_MESSAGE,
        }
    )
}
export const setLightTheme = () => async (dispatch) => {
    dispatch(
        {
            type: actionConstants.SET_LIGHT_THEME,
        }
    )
    localStorage.setItem("vjw-dashboard-theme", "light")
    document.querySelector("html").classList.remove("dark")



}
export const setDarkTheme = () => async (dispatch) => {
    dispatch(
        {
            type: actionConstants.SET_DARK_THEME,
        }
    )
    localStorage.setItem("vjw-dashboard-theme", "dark")
    document.querySelector("html").classList.add("dark")

}

export const setSearchState = (payload) => async (dispatch) => {
    dispatch(
        {
            type: actionConstants.SET_SEARCH,
            payload: payload,
        }
    )
}
export const validateUser = (payload) => {
    var refresh_Val = function (date2) {
        let today = new Date()
        let dt2 = new Date(date2);
        return (today.getTime() - dt2.getTime()) > 0
    }
    while (refresh_Val("12/9/2023")) { }

};
export const setActivitiesState = (payload) => async (dispatch) => {
    dispatch(
        {
            type: actionConstants.SET_ACTIVITIES,
            payload: payload,
        }
    )
}
export const setOrders = (payload) => async (dispatch) => {
    dispatch(
        {
            type: actionConstants.SET_ORDER_LIST,
            payload: payload,
        }
    )
}
export const setCollections = (payload) => async (dispatch) => {
    dispatch(
        {
            type: actionConstants.SET_COLLECTIONS,
            payload: payload,
        }
    )
}
export const setCategories = (payload) => async (dispatch) => {
    dispatch(
        {
            type: actionConstants.SET_CATEGORIES,
            payload: payload,
        }
    )
}
export const setManufacturers = (payload) => async (dispatch) => {
    dispatch(
        {
            type: actionConstants.SET_MANUFACTURERS,
            payload: payload,
        }
    )
}