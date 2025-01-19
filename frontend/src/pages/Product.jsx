import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const Product = () => {
  const { productId } = useParams();
  const { products, currency } = useContext(ShopContext);
  const [image, setImage] = useState('');
  const [productData, setProductData] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [wishList, setWishList] = useState([]);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        setCurrentColor(item.variation_values.color);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const handleColorChange = (colorId) => {
    const colorImage = `https://katespade.scene7.com/is/image/KateSpade/${productData.style}_${colorId}`;
    setImage(colorImage);
    setCurrentColor(colorId);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= productData.stock_level) {
      setQuantity(value);
    } else if (value > productData.stock_level) {
      alert(`Only ${productData.stock_level} items are in stock.`);
      setQuantity(productData.stock_level);
    } else {
      setQuantity(1);
    }
  };

  const handleAddToWishList = () => {
    const selectedProduct = {
      name: productData.name,
      color: productData.colors.find((color) => color.id === currentColor)?.text,
      quantity,
      price: productData.price,
    };

    setWishList((prevWishList) => [...prevWishList, selectedProduct]);
    alert("Product added to your wish list!");
    // Placeholder for sending email logic
    console.log("Email details:", selectedProduct);
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>

          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <p className="pl-2">({Math.floor(Math.random() * 300) + 50})</p>
          </div>
          <p className="mt-2 text-gray-500 md:w-4/5 font-sm">
            {productData.style} {currentColor}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5 font-sm">
            Comparable Value ${productData.regular_price}
          </p>
          <div className="flex gap-2 items-center text-red-600">
            <p className="text-3xl font-medium inline-flex">
              {currency}
              {productData.price}
            </p>
            <span className="inline-flex gap-2">({productData.discount}% off)</span>
          </div>

          {/* Color Variations */}
          <div className="mt-5">
            <p className="font-medium">
              Color: {productData.colors.find((color) => color.id === currentColor)?.text}
            </p>
            <div className="flex gap-3 mt-2">
              {productData.colors.map((color) => {
                const colorImage = `https://katespade.scene7.com/is/image/KateSpade/${productData.style}_${color.id}`;
                return (
                  <img
                    key={color.id}
                    onClick={() => handleColorChange(color.id)}
                    src={colorImage}
                    alt={color.text}
                    className={`w-16 h-16 cursor-pointer border-2 ${
                      currentColor === color.id
                        ? 'border-black'
                        : 'border-gray-300'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Quantity Input and Add to Wish List */}
          <div className="mt-5">
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="border border-gray-300 w-16 h-10 text-center"
                min="1"
              />
              <button
                onClick={handleAddToWishList}
                className="bg-green-600 text-white px-5 py-2 font-medium rounded hover:bg-green-500"
              >
                Add to Wish List
              </button>
            </div>
            <p className="text-gray-500 mt-2">
              Stock Level: {productData.stock_level}
            </p>
            <div className='flex gap-0'>
            <p className="mt-2 text-black-500 md:w-4/5 font-sm mr-2">
              Style Number
          </p>
            <p className="mt-2 text-gray-500 md:w-4/5 font-sm">
              {productData.style}
          </p>
          </div>
          <div className='flex gap-0'>
          <p className="mt-2 text-black-500 md:w-4/5 font-sm">
              UPC
          </p>
            <p className="mt-2 text-gray-500 md:w-4/5 font-sm">
              {productData.UPC}
          </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
