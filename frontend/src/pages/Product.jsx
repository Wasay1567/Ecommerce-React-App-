import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, cartItems } = useContext(ShopContext);
  const [image, setImage] = useState('');
  const [productData, setProductData] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [wishList, setWishList] = useState([]);
  // const details = {"Style Number": ["KK161"], "Measurements": ["Length: 4.72\"", "Height: 14.92\"", "10.8\"W at bottom"], "Materials": ["100% Recycled Polyester", "2 Way Script Logo Lining"], "Handle": ["4.5\""], "Strap": ["18.5\""], "Features": ["Exterior front zip pocket", "Interior front zip pocket, back slip pocket", "Drop zip top closure", "Fits 13\" Laptop", "Metal Pinmount With Spade"], "Made In": ["Imported"]}

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

  const handleColorChange = (colorImage, colorId) => {
    setImage(colorImage);
    setCurrentColor(colorId);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= productData.stock_level) {
      setQuantity(value);
    } else if (value > productData.stock_level) {
      // alert(`Only ${productData.stock_level} items are in stock.`);
      setQuantity(productData.stock_level);
    } else {
      setQuantity(1);
    }
  };

  

  

  

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 h-[20%] flex flex-col-reverse sm:flex-row gap-3 sm:w-[90vw]">
          <div className={`flex sm:flex-col h-[76%] overflow-x-scroll justify-between sm:justify-normal sm:overflow-y-scroll gap-x-3 sm:w-[18.7%] w-full`}>
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

          <div className="w-full sm:w-[80%] h-[76%]">
            <img className="w-full h-[76%]" src={image} alt="" />
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
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2">{productData.reviewCount}</p>
          </div>
          <p className="mt-2 text-gray-500 md:w-4/5 font-sm">
            {productData.variation_values.color === currentColor ?productData.style:''} {currentColor}
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
            <div className="flex flex-wrap gap-3 mt-2">
              {productData.colors.map((color) => {
                let colorImage = color.image;
                // if(productData.brand.toLowerCase() === "kate spade"){
                //   colorImage = `https://katespade.scene7.com/is/image/KateSpade/${productData.style}_${color.id}`;
                // }
                // else if(productData.brand.toLowerCase() === "coach"){
                //   colorImage = `https://coach.scene7.com/is/image/Coach/${productData.style.toLowerCase()}_${color.id.toLowerCase()}_a0`;
                // }
                return (
                  <img
                    key={color.id}
                    onClick={() =>
                      handleColorChange(colorImage, color.id)
                    }
                    src={colorImage}
                    alt={color.text}
                    className={`w-16 h-16 cursor-pointer border-2 ${currentColor === color.id
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
                onClick={() => addToCart(productData._id, currentColor, quantity)}
                className="bg-green-600 text-white px-5 py-2 font-medium rounded hover:bg-green-500"
              >
                Add to Wish List
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Description Section */}
      <div className='mt-3'>
        <div className='flex'>
          <div className='border px-5 py-3 text-sm'>Product Details</div>
          <div className='border px-5 py-3 text-sm'>Reviews {productData.reviewCount}</div>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm '>
          {Object.entries(productData.details).map(([key, value]) => (
            <div key={key} className="flex gap-0">
              <p className="mt-2 text-black-800 md:w-4/5 font-sm mr-2">
                {key}
              </p>
              <p className="mt-2 text-gray-500 md:w-4/5 font-sm">
                {value.map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* display related Products */}

      <RelatedProducts category={productData.category_paths} />


    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
