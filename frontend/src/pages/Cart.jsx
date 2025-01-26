import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const {products, currency, cartItems, updateQuantity, navigate, setCartItems} = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(()=>{
    const tempData = [];
    for(const items in cartItems){
      for(const item in cartItems[items]){
        if (cartItems[items][item]>0) {
          tempData.push({
            _id:items,
            variant : item,
            quantity:cartItems[items][item]
          })
        }
      }
    }
    setCartData(tempData);
  }, [cartItems])

  useEffect(() => {
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailPattern.test(email));
  }, [email]);

  return (
    <div className='border-t pt-14 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

      <div className='text-2xl mb-3'>
        <Title text1={"YOUR"} text2={"WISHLIST"} />
      </div>

      <div className=''>
        {
          cartData.map((item, index)=>{
            // const productId = item._id.split(' ')[0];
            // const v = item.variant;
            // const productData = products.find((product)=> product.style === productId);
            const productId = item._id;
            console.log(productId)
            // console.log()
            
            const productData = products.find((product)=> product.SKU === productId);
            return(
              <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                <div className='flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={productData.image[0]} />
                  {/* <img className='w-16 sm:w-20' src={"https://katespade.scene7.com/is/image/KateSpade/"+productId+"_"+v} /> */}
                  
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{productData.price}</p>
                      <p>{productData.colors.find(color => color.id === v)?.text || 'Color not found'}</p>
                    </div>
                  </div>
                </div>
                <input onChange={(e)=>e.target.value === '' || e.target.value === '0' ? null:updateQuantity(item._id, item.variant, Number(e.target.value))}className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 ' type="number" min={1} defaultValue={item.quantity}/>
                <img onClick={()=>updateQuantity(item._id, item.variant, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" />
              </div>

            )
            
          })
        }
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
        </div>

      </div>
      <div className='flex flex-col my-4 items-end'>
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className='border-2 px-2 py-1 mb-2 w-35 border-blue-500'
        />
        <div className='w-full text-end'>
          <button 
            onClick={() => {
              navigate('/');
              // Logic to handle order placement
              // Send wishlist to the email (not implemented here)
              setCartItems({}); // Empty the cart
            }}
            className={`bg-black text-white text-sm my-8 px-8 py-3 ${!isEmailValid ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={!isEmailValid}
          >
            PLACE ORDER
          </button>
        </div>
      </div>

      
      
    </div>
  )
}

export default Cart
