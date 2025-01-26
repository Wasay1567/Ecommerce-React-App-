import { createContext, useEffect, useState } from "react";
import { products } from '../assets/assets';
import {toast} from 'react-toastify'
import { useNavigate } from "react-router-dom";
export const ShopContext = createContext();

const ShopContextProvider = (props)=>{

    const currency = '$';
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();

    const addToCart = async (itemId, variant, quantity) =>{
        let cartData = structuredClone(cartItems);
        // quantity = parseInt(quantity);
        if(quantity>products.stock_level){
            toast.error('Quantity not available in stock!');
            return;
        }
        if(cartData[itemId]){
            if(cartData[itemId][variant]){
                cartData[itemId][variant] += quantity;
            }
            else{
                cartData[itemId][variant] = quantity;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][variant] = quantity;
        }
        
        setCartItems(cartData);
    }

    // useEffect(()=>{
    //     console.log(cartItems);
    // }, [cartItems])


    const getCartCount = ()=>{
        let totalCount = 0;
        for(const items in cartItems){
          for(const item in cartItems[items]){
            try {
              if (cartItems[items][item]>0) {
                totalCount += cartItems[items][item];
              }
            } catch (error) {
              
            }
          }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, variant, quantity)=>{
        let cartData = structuredClone(cartItems);

        cartData[itemId][variant] = quantity;
        if(quantity==0){
            delete cartData[itemId][variant];
        }
        if(Object.keys(cartData[itemId]).length === 0){
            delete cartData[itemId];
        }
        setCartItems(cartData);
    }

    const getCartAmount = ()=>{
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=>product._id===items);
            for(const item in cartItems[items]){
                try {
                    if(cartItems[items][item]>0){
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalAmount;
    }

    const value = {
        products , currency,
        search, setSearch, showSearch, setShowSearch, setCartItems,
        cartItems, addToCart, getCartCount, updateQuantity, getCartAmount, navigate
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;