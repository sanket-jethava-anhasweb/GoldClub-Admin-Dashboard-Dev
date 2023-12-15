import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import clientReducer from "./clientReducer";


var reducers = combineReducers(
    {
        login: loginReducer,
        client: clientReducer,

        // allForms: formReducer,
        // users: Users

    }
)

export default reducers