"use client"

import NavBar from './NavBar'
import Footer from './Footer'
import { FaSearch } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
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
      const q = query(
                  collection(db,"products")
                );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  },[]);


  async function handleAddToCart(id){
    try{
      if (isLoggedIn){
        setLoading(true);
        await addDoc(collection(db,"cart"),{
          id: id,
          userName: userName,
          email: email,
        });
        setAdded(true);
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
        <NavBar footRef={footRef}/>
        <div className="sticky top-18 z-10 md:top-20 flex flex-row justify-center items-center mt-0">
            <input className="font-sans p-2 rounded-lg w-67 md:w-180 lg:w-240 xl:w-340 border-t-3 border-l-3 border-b-3 bg-purple-100 text-blue-900 font-semibold border-blue-700" placeholder="What are you looking for?" type="search"></input>
            <FaSearch className="hover:cursor-pointer hover:scale-105 border-3 border-blue-700 rounded-lg bg-purple-100 p-1 text-blue-900 transition duration-300 ease-in-out" size={35}/>
        </div>

        <div className="mx-auto my-10 mb-20 p-4 border-2 border-blue-700 overflow-hidden bg-gradient-to-br from-blue-100 via-fuchsia-100 to-fuchsia-200 w-75 md:w-180 lg:w-250 xl:w-350 rounded-lg shadow-xl shadow-fuchsia-900 mb-5 transition duration-300 ease-in-out">
          <div className="flex gap-6 w-max animate-featured-slide">
            {
              [...images,...images].map((image,index) => (
                <Image key={index} className="rounded-xl z-1" src={image} width={500} height={100} alt='featured product'></Image>
              ))
            } 
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

        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center my-5 gap-y-1 md:gap-x-8 lg:gap-x-4 xl:gap-x-8">
            {
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