import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null
};

const userDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserData: (state, action) => {            
            state.user = action.payload;
        },
    },
});

export const { setUserData } = userDataSlice.actions;
export default userDataSlice.reducer;
