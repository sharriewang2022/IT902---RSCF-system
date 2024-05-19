import { combineReducers } from "redux";
import { generalProductReducer } from "./generalProductReducer";

const rootReducer = combineReducers({
  generalProductReducer: generalProductReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
