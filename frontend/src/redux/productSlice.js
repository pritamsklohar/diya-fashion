import { createSlice } from "@reduxjs/toolkit";
import { Select } from "radix-ui";

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        cart: { items: [] },
        addresses:[],
        selectAddress:null
    },
    reducers: {
        // actions
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setCart(state, action) {
            state.cart = action.payload
        },

        addAddress:(state, action)=>{
            if(!state, addresses) state.addresses= [];
            state.addresses.push(action.payload)
        },

        setSelectedAddress:(state, action)=>{
            state.selectedAddress = action.payload
        },
        deleteAddress:(state, action)=>{
            state.addressses = state.addresses.filter((_, index)=>index !== action.payload)

            if(state.selectedAddress === action.payload){
                state.selectedAddress = null
            }
        }


    }
});

export const { setProducts, setCart, addresses, setSelectedAddress, deleteAddress } = productSlice.actions;
export default productSlice.reducer;
