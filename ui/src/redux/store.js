import { configureStore } from "@reduxjs/toolkit";
import errorMessageReducer from "./errorMessage";
import aikiCloud from "./aikiCloud";

export default configureStore({
    reducer: {
        errorMessage: errorMessageReducer,
        aikiCloud: aikiCloud,
    },
});
