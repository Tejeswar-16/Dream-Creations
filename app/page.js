"use client"

import NavBar from './NavBar'
import Footer from './Footer'
import { FaIndianRupeeSign } from "react-icons/fa6";
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { auth, db } from './_util/config';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';

export default function Home(){

  const [products,setProducts] = useState([]);
  const [loading,setLoading] = useState(false);
  const [userName,setUserName] = useState("");
  const [email,setEmail] = useState("");
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [notLoggedIn,setNotLoggedIn] = useState(false);
  const [added,setAdded] = useState(false);
  const [discCountClick,setDiscountClick] = useState(Array(6).fill(false));
  const [priceClick,setPriceClick] = useState(Array(6).fill(false));
  const [sortProduct,setSortProduct] = useState(Array(6).fill(false));
  const [searchProduct,setSearchProduct] = useState("");
  const [shopping,setShopping] = useState(false);

  const router = useRouter();
  const footRef = useRef(null);

  useEffect(() => {
      onAuthStateChanged(auth,(user) => {
          if (user){
              setUserName(user.displayName);
              setEmail(user.email);
              setIsLoggedIn(true);
          }
      });
  });

  useEffect(() => {
    async function fetchProducts(){
      setLoading(true);
      if (searchProduct)
        setLoading(false);
      const q = query(
                  collection(db,"products")
                );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());
      
      let filteredData = data;
      if (discCountClick[0])
        filteredData = filteredData.filter((prod) => Math.round((prod.actualPrice - prod.discountPrice)*100/prod.actualPrice) >= 10)
      if (discCountClick[1])
        filteredData = filteredData.filter((prod) => Math.round((prod.actualPrice - prod.discountPrice)*100/prod.actualPrice) >= 25)
      if (discCountClick[2])
        filteredData = filteredData.filter((prod) => Math.round((prod.actualPrice - prod.discountPrice)*100/prod.actualPrice) >= 35)
      if (discCountClick[3])
        filteredData = filteredData.filter((prod) => Math.round((prod.actualPrice - prod.discountPrice)*100/prod.actualPrice) >= 50)
      if (discCountClick[4])
        filteredData = filteredData.filter((prod) => Math.round((prod.actualPrice - prod.discountPrice)*100/prod.actualPrice) >= 60)
      if (discCountClick[5])
        filteredData = filteredData.filter((prod) => Math.round((prod.actualPrice - prod.discountPrice)*100/prod.actualPrice) >= 70)
      if (searchProduct)
        filteredData = filteredData.filter((prod) => (prod.productName.toLowerCase()).includes(searchProduct.toLowerCase()))
      if (priceClick[0])
        filteredData = filteredData.filter((prod) => prod.discountPrice >= 10 && prod.discountPrice <= 19)
      if (priceClick[1])
        filteredData = filteredData.filter((prod) => prod.discountPrice >= 20 && prod.discountPrice <= 29)
      if (priceClick[2])
        filteredData = filteredData.filter((prod) => prod.discountPrice >= 30 && prod.discountPrice <= 39)
      if (priceClick[3])
        filteredData = filteredData.filter((prod) => prod.discountPrice >= 40 && prod.discountPrice <= 49)
      if (priceClick[4])
        filteredData = filteredData.filter((prod) => prod.discountPrice >= 50 && prod.discountPrice <= 59)
      if (priceClick[5])
        filteredData = filteredData.filter((prod) => prod.discountPrice >= 60)
      if (sortProduct[0])
        filteredData = filteredData.sort((x,y) => x.productName.localeCompare(y.productName))
      if (sortProduct[1])
        filteredData = filteredData.sort((y,x) => x.productName.localeCompare(y.productName))
      if (sortProduct[2])
        filteredData = filteredData.sort((x,y) => x.discountPrice - y.discountPrice)
      if (sortProduct[3])
        filteredData = filteredData.sort((y,x) => x.discountPrice - y.discountPrice)
      if (sortProduct[4])
        filteredData = filteredData.sort((y,x) => x.createdAt - y.createdAt)
      if (sortProduct[5])
        filteredData = filteredData.sort((x,y) => x.createdAt - y.createdAt)

      setProducts(filteredData);
      setLoading(false);
    }
    fetchProducts();
  },[discCountClick,searchProduct,priceClick,sortProduct]);


  async function handleAddToCart(id){
    try{
      if (isLoggedIn){
        setLoading(true);
        const q = query(
          collection(db,"cart"),
          where("id","==",id),
          where("email","==",email)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty){
          await addDoc(collection(db,"cart"),{
            id: id,
            userName: userName,
            email: email,
            quantity: 1
          });
          setAdded(true);
        }
        else{
          querySnapshot.forEach(async (document) => {
            const docRef = doc(db,"cart",document.id);
            const currentData = document.data();

            await updateDoc(docRef,{
              quantity: currentData.quantity + 1
            })
          })
          setAdded(true);
        }
      }
      else{
        setNotLoggedIn(true);
      }
    }
    catch(error){
      alert(error);
    }
    finally{
      setLoading(false);
    }
  }

  const images = ["/products/featured 1.png","/products/featured 2.png","/products/featured 3.png","/products/featured 4.png","/products/featured 5.png"];

  return(
    <>
      <div className="relative bg-gradient-to-b from-purple-100 via-purple-100 to-blue-100 py-1 min-h-screen">
        <NavBar footRef={footRef} shopping={setShopping}/>

        <div className="mx-auto mb-10 p-4 border-2 border-blue-700 overflow-hidden bg-gradient-to-br from-blue-100 via-fuchsia-100 to-fuchsia-200 w-75 md:w-180 lg:w-250 xl:w-350 rounded-lg shadow-xl shadow-fuchsia-900 mb-5 transition duration-300 ease-in-out">
          <h1 className='font-sans flex justify-center mb-4 font-bold text-blue-900 text-xl md:text-3xl'>Featured Products</h1>
          <div className="flex gap-6 w-max animate-featured-slide">
            {
              [...images,...images].map((image,index) => (
                <Image key={index} className="rounded-xl z-1" src={image} width={500} height={100} alt='featured product'></Image>
              ))
            } 
          </div> 
        </div>
        
        <div className="mx-auto p-4 bg-gradient-to-br from-blue-100 via-fuchsia-100 to-fuchsia-200 w-75 md:w-180 lg:w-250 xl:w-350 rounded-lg shadow-xl shadow-fuchsia-900">
          <div className="md:top-20 flex flex-row justify-center items-center mt-0">
              <input value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} className="font-sans p-2 rounded-lg w-67 md:w-180 lg:w-240 xl:w-340 border-3 text-blue-900 font-semibold border-blue-700" placeholder="What are you looking for?" type="search"></input>
          </div>
          <div className='xl:mx-5 select-none flex flex-col lg:flex-row gap-y-2 justify-between'>
            <div className='flex flex-col justify-center items-center'>
              <h1 className='font-sans mt-4 mb-2 text-lg font-semibold text-blue-900'>Discount</h1>
              <div className='flex md:flex-row flex-wrap gap-x-2 xl:gap-x-4 gap-y-2 justify-center items-center w-70 md:w-140 lg:w-70 xl:w-100'>
                <h1 onClick={() => setDiscountClick(prev => {const updated = [...prev]; updated[0] = !updated[0]; return updated})} className={discCountClick[0] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>10%&nbsp; Off or more</h1>
                <h1 onClick={() => setDiscountClick(prev => {const updated = [...prev]; updated[1] = !updated[1]; return updated})} className={discCountClick[1] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>25% Off or more</h1>
                <h1 onClick={() => setDiscountClick(prev => {const updated = [...prev]; updated[2] = !updated[2]; return updated})} className={discCountClick[2] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>35% Off or more</h1>
                <h1 onClick={() => setDiscountClick(prev => {const updated = [...prev]; updated[3] = !updated[3]; return updated})} className={discCountClick[3] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>50% Off or more</h1>
                <h1 onClick={() => setDiscountClick(prev => {const updated = [...prev]; updated[4] = !updated[4]; return updated})} className={discCountClick[4] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>60% Off or more</h1>
                <h1 onClick={() => setDiscountClick(prev => {const updated = [...prev]; updated[5] = !updated[5]; return updated})} className={discCountClick[5] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>70% Off or more</h1>
              </div>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <h1 className='font-sans mt-4 mb-2 text-lg font-semibold text-blue-900'>Sort By</h1>
              <div className='flex md:flex-row flex-wrap gap-x-2 xl:gap-x-4 gap-y-2 justify-center items-center w-75 md:w-150 lg:w-70 xl:w-100'>
                <h1 onClick={() => setSortProduct(prev => {const updated = [...prev]; updated[0] = !updated[0]; return updated})} className={sortProduct[0] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>Alphabetical: A - Z</h1>
                <h1 onClick={() => setSortProduct(prev => {const updated = [...prev]; updated[1] = !updated[1]; return updated})} className={sortProduct[1] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>Alphabetical: Z - A</h1>
                <h1 onClick={() => setSortProduct(prev => {const updated = [...prev]; updated[2] = !updated[2]; return updated})} className={sortProduct[2] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>Price: Low - High</h1>
                <h1 onClick={() => setSortProduct(prev => {const updated = [...prev]; updated[3] = !updated[3]; return updated})} className={sortProduct[3] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>Price: High - Low</h1>
                <h1 onClick={() => setSortProduct(prev => {const updated = [...prev]; updated[4] = !updated[4]; return updated})} className={sortProduct[4] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>Date: Newly added</h1>
                <h1 onClick={() => setSortProduct(prev => {const updated = [...prev]; updated[5] = !updated[5]; return updated})} className={sortProduct[5] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>Date: Oldest First</h1>
              </div>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <h1 className='font-sans mt-4 mb-2 text-lg font-semibold text-blue-900'>Price Range</h1>
              <div className='flex flex-row flex-wrap gap-x-2 xl:gap-x-4 gap-y-2 justify-center items-center w-75 md:w-150 lg:w-70 xl:w-100'>
                <h1 onClick={() => setPriceClick(prev => {const updated = [...prev]; updated[0] = !updated[0]; return updated})} className={priceClick[0] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>₹10.00 - ₹19.00</h1>
                <h1 onClick={() => setPriceClick(prev => {const updated = [...prev]; updated[1] = !updated[1]; return updated})} className={priceClick[1] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>₹20.00 - ₹29.00</h1>
                <h1 onClick={() => setPriceClick(prev => {const updated = [...prev]; updated[2] = !updated[2]; return updated})} className={priceClick[2] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>₹30.00 - ₹39.00</h1>
                <h1 onClick={() => setPriceClick(prev => {const updated = [...prev]; updated[3] = !updated[3]; return updated})} className={priceClick[3] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>₹40.00 - ₹49.00</h1>
                <h1 onClick={() => setPriceClick(prev => {const updated = [...prev]; updated[4] = !updated[4]; return updated})} className={priceClick[4] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer': 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>₹50.00 - ₹59.00</h1>
                <h1 onClick={() => setPriceClick(prev => {const updated = [...prev]; updated[5] = !updated[5]; return updated})} className={priceClick[5] ? 'font-sans bg-blue-700 text-white border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer' : 'font-sans border-2 border-blue-700 rounded-xl p-1 text-blue-900 hover:cursor-pointer hover:text-pink-900'}>₹60.00 or more</h1>
              </div>
            </div>
          </div>
        </div>
        
        {
            loading && 
                <div className="fixed inset-0 z-100 flex flex-col justify-center backdrop-blur-sm items-center">
                    <div className="mx-auto font-mono font-bold text-2xl text-white">
                        <Image src={"/loading1.gif"} width={200} height={20} alt="Loading..."></Image>
                    </div>
                </div>
        }

        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center mt-10 my-5 gap-y-1 md:gap-x-8 lg:gap-x-4 xl:gap-x-8">
            {   products.length == 0 ? 
                  <h1 className='font-sans mt-4 font-semibold text-blue-900 text-xl'>No products were found</h1>
                :  
                products.map((product) => (
                    <div key={product.id} className="bg-gradient-to-br from-blue-100 via-fuchsia-100 to-fuchsia-200 w-75 md:w-80 rounded-lg shadow-xl shadow-fuchsia-900 mb-5 transition duration-300 ease-in-out">
                      <div className="flex flex-col items-center">
                        <Image onClick={() => router.push("/products/"+product.id)} src={product.images[0]} className="rounded-xl md:mt-2 hover:cursor-pointer" width={300} height={10} alt='logo'></Image>
                        <div className="flex flex-col items-center w-75 md:w-80 p-2 md:p-4">
                          <h1 className="select-none font-sans font-semibold text-lg lg:text-xl mb-4 text-blue-900">{product.productName}</h1>
                          <h1 className="select-none font-sans font-semibold text-center lg:text-lg mb-2 text-blue-900">{product.productDescription}</h1>
                          <div className="flex flex-row items-end gap-x-2">
                            <div className="flex flex-row items-center">
                              <FaIndianRupeeSign className="font-sans text-blue-900 font-bold md:text-xl lg:text-3xl"/>
                              <h1 className="select-none font-sans text-blue-900 font-bold md:text-xl lg:text-3xl">{product.discountPrice}</h1>
                            </div>
                            <h1 className="select-none font-sans text-blue-900 line-through lg:text-xl">Rs. {product.actualPrice}</h1>
                          </div>
                        </div>
                        <button onClick={() => handleAddToCart(product.id)} className="select-none font-sans font-semibold bg-blue-800 rounded-xl hover:cursor-pointer hover:bg-blue-900 lg:text-lg text-purple-200 mb-4 p-2 hover:scale-105 transition duration-300 ease-in-out">Add to Cart</button>
                      </div>
                    </div>
                ))
            }
        </div>

        {
            added && 
            <div className="fixed inset-0 z-50 flex flex-col justify-center backdrop-blur-sm items-center">
                <div className="select-none font-sans bg-gradient-to-br from-blue-100 via-purple-200 to-purple-100 rounded-xl shadow-xl p-5 border border-blue-700">
                <p className="text-lg text-blue-900">Product added to your cart</p>
                <div className="flex justify-center "><button onClick={() => {setAdded(false)}} className="bg-blue-900 text-purple-100 w-10 rounded-xl mt-2 p-2 hover:cursor-pointer">OK</button></div>
                </div>
            </div>
        }

        {
            notLoggedIn && 
            <div className="fixed inset-0 z-50 flex flex-col justify-center backdrop-blur-sm items-center">
                <div className="select-none font-sans bg-gradient-to-br from-blue-100 via-purple-200 to-purple-100 rounded-xl shadow-xl p-5 border border-blue-700">
                <p className="text-lg text-blue-900">Kindly sign in to proceed furthur</p>
                <div className="flex justify-center "><button onClick={() => {setNotLoggedIn(false)}} className="bg-blue-900 text-purple-100 w-10 rounded-xl mt-2 p-2 hover:cursor-pointer">OK</button></div>
                </div>
            </div>
        }

        <Footer footRef={footRef}/>
      </div>
    </>
  )
}