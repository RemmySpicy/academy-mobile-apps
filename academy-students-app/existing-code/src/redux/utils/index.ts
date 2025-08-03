import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface UtilsState {
    show: string | null,
    showEdit: boolean | null,
    deleteId: number | null,
    isSubmitting: boolean,
    alert: { msg: string, type: "error" | "success" | "warning" } | null
}


//define the initalstate for this utilslice 
const initialState: UtilsState = {
    show: null,
    showEdit: null,
    deleteId: null,
    isSubmitting: false,
    alert: null
}



//create the slice
export const UtilSlice = createSlice({
    name: "utils",
    initialState,
    reducers: {

        showItem: (state: UtilsState, action: PayloadAction<string | null>) => {
            if (state.show === action.payload) {
                state.show = null
            } else {
                if (action.payload === null) {
                    state.showEdit = false
                }
                state.show = action.payload
            }
        },

        setDeleteId: (state: UtilsState, action: PayloadAction<number | null>) => {
            state.deleteId = action.payload
        },

        setIsSubmitting: (state: UtilsState, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload
        },

        setAlert: (state: UtilsState, action: PayloadAction<{ msg: string, type: "error" | "success" | "warning" } | null>) => {
            state.alert = action.payload
        }



    },
})





export default UtilSlice.reducer;
export const {
    showItem,
    setDeleteId,
    setIsSubmitting,
    setAlert

} = UtilSlice.actions