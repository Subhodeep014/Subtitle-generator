import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    email : null
}

const userSlice = createSlice({
    name : 'email',
    initialState,
    reducers : {
        addEmail : (state, action)=>{
            state.email = action.payload
        },
        deleteEmail : (state, action)=>{
            state.email = null
        }
    }
})

export const {addEmail, deleteEmail} = userSlice.actions
export default userSlice.reducer;