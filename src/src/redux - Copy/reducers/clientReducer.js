import { actionConstants } from "../../constants/actionConstants";

let initialState = {
    sideNavOpen: false,
    messageOpen: false,
    themeDark: localStorage.getItem("vjw-dashboard-theme") == "dark" ? false : true,
    store: null,
    search: null,
    activities: null,
    orders: null,
    collections: null,
    categories: null,
    manufacturers: null

}


const clientReducer = (state = initialState, { type, payload }) => {

    switch (type) {
        case actionConstants.OPEN_SIDENAV:
            return { ...state, sideNavOpen: true }
        case actionConstants.CLOSE_SIDENAV:
            return { ...state, sideNavOpen: false }

        case actionConstants.OPEN_MESSAGE:
            return { ...state, messageOpen: true }
        case actionConstants.CLOSE_MESSAGE:
            return { ...state, messageOpen: false }

        case actionConstants.SET_LIGHT_THEME:
            return { ...state, themeLight: true }
        case actionConstants.SET_DARK_THEME:
            return { ...state, themeLight: false }

        case actionConstants.SET_SEARCH: {
            return { ...state, search: payload }
        }
        case actionConstants.SET_ACTIVITIES: {
            return { ...state, activities: payload }
        }
        case actionConstants.SET_ORDER_LIST: {
            return { ...state, orders: payload }
        }
        case actionConstants.SET_COLLECTIONS: {
            return { ...state, collections: payload }
        }
        case actionConstants.SET_CATEGORIES: {
            return { ...state, categories: payload }
        }
        case actionConstants.SET_MANUFACTURERS: {
            return { ...state, manufacturers: payload }
        }
        default:
            return state
    }

}


export default clientReducer