"use client"

import { useParams, useRouter } from "next/navigation"
import NavBar from '../../NavBar'
import Footer from '../../Footer'
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { addDoc, collection, doc, getDocs, query, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../../_util/config";
import { onAuthStateChanged } from "firebase/auth";

export default function Products(){

    const [product,setProduct] = useState(null);
    const [loading,setLoading] = useState(true);
    const [currentImage,setCurrentImage] = useState("");
    const [quantity,setQuantity] = useState(1);
    const [review,setReview] = useState(false);
    const [rating,setRating] = useState("");
    const [writeup,setWriteup] = useState("");
    const [reviewData,setReviewData] = useState([]);
    const [userName,setUserName] = useState("");
    const [email,setEmail] = useState("");
    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const [notLoggedIn,setNotLoggedIn] = useState(false);
    const [added,setAdded] = useState(false);

    const params = useParams();
    const router = useRouter();

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
                collection(db,"products"),
                where("id","==",Number(params.productId))
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => doc.data());
            setProduct(data[0]);
            setLoading(false);
        }
        fetchProducts();
    },[]);

    useEffect(() => {
        async function fetchReviews(){
            setLoading(true);
            const q = query(
                collection(db,"reviews"),
                where("productId","==",Number(params.productId))
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => doc.data());
            console.log(data);
            setReviewData(data);
            setLoading(false);
        }
        fetchReviews();
    },[]);

    async function handleReview(rating,writeup){
        try{
            setLoading(true);
            await addDoc(collection(db,"reviews"),{
                productId: product.id,
                productName: product.productName,
                rating: rating,
                writeup: writeup,
                timestamp: serverTimestamp()
            });
            alert("Review submitted successfully!");
            setRating("");
            setWriteup("");
            setReview(false);
        }
        catch(error){
            alert(error);
        }
        finally{
            setLoading(false);
        }
    }

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
                        quantity: quantity
                    });
                    setAdded(true);
                }
                else{
                    querySnapshot.forEach(async (document) => {
                        const docRef = doc(db,"cart",document.id);
                        const currentData = document.data();

                        await updateDoc(docRef,{
                            quantity: currentData.quantity + quantity
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

    function handleBuyNow(id){
        if (isLoggedIn)
            router.push("/checkout/"+id);
        else
            setNotLoggedIn(true);
    }

    if (!product){
        return (
            <div className="fixed inset-0 z-100 flex flex-col justify-center backdrop-blur-sm items-center">
                <div className="mx-auto font-mono font-bold text-2xl text-white">
                    <Image src={"/loading1.gif"} width={200} height={20} alt="Loading..."></Image>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="relative bg-gradient-to-b from-purple-100 via-purple-100 to-blue-100 py-1 min-h-screen">
                <NavBar/>
                <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch mx-0 md:mx-2 lg:mx-17 mb-10 gap-x-8 gap-y-8">
                    <div className="bg-gradient-to-br border-t-4 border-r-2 border-l-2 border-b-1 border-blue-700 from-pink-200 via-blue-100 to-blue-200 rounded-xl shadow-xl shadow-pink-300 p-4 w-75 md:w-190 lg:w-143">
                        <div className="flex flex-row gap-x-8">
                            <div className="flex flex-col gap-y-2">
                                {
                                    product?.images?.length > 0 && 
                                    product?.images?.map((image,index) => (
                                        <Image onClick={() => {setCurrentImage(image)}} key={index} className="mx-auto rounded-xl hover:cursor-pointer " src={image} width={50} height={50} alt="image"></Image>
                                    ))
                                }
                            </div>
                            <div>
                                {
                                    product?.images?.length > 0 && 
                                        <Image className="mx-auto rounded-xl" src={currentImage || product.images[0]} width={450} height={50} alt="image"></Image>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="select-none bg-gradient-to-br border-t-4 border-r-2 border-l-2 border-b-1 border-blue-700 from-pink-200 via-blue-100 to-blue-200 shadow-xl shadow-pink-300 rounded-xl p-4 w-75 md:w-200">
                        <h1 className="flex justify-center font-sans font-bold text-3xl text-blue-900">{product.productName}</h1>
                        <h1 className="flex justify-center font-sans font-bold text-xl text-blue-900">{product.productDescription}</h1>
                        <div className="p-[2px] rounded-xl mt-4 bg-gradient-to-br from-pink-500 to-blue-500">
                            <div className="flex justify-center rounded-xl bg-gradient-to-br from-pink-200 via-blue-100 to-blue-200 pb-5 pt-2 font-sans flex flex-row items-end gap-x-2">
                                <p className="text-3xl font-semibold mt-4 text-blue-900">₹{product.discountPrice*quantity+".00"}</p>
                                <p className="bg-red-500 text-sm text-sm rounded-sm text-white p-1">- {Math.round((product.actualPrice - product.discountPrice)*100/product.actualPrice)}%</p>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-4">
                            <button onClick={() => handleAddToCart(product.id)} className="flex-1 border border-blue-700 text-blue-700 py-3 rounded-xl hover:border-0 hover:bg-blue-700 hover:text-white hover:cursor-pointer transition duration-300 ease-in-out">Add to Cart</button>
                            <button onClick={() => handleBuyNow(product.id)} className="flex-1 bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800 hover:cursor-pointer transition duration-300 ease-in-out">Buy Now</button>
                        </div>
                        <div className="font-sans text-blue-900 mt-6 bg-gradient-to-tl from-pink-200 via-blue-100 to-blue-200 p-4 rounded-xl">
                            <h1 className="font-sans flex justify-center text-blue-900 text-2xl font-semibold">Product Review</h1>
                            <div className="flex justify-center"><button onClick={() => {isLoggedIn ? setReview(true) : setNotLoggedIn(true)}} className="font-sans text-blue-900 rounded-lg p-1 border border-blue-700 hover:bg-blue-700 hover:text-white hover:cursor-pointer transition duration-300 ease-in-out">Review this product</button></div>
                            <div className="h-42 overflow-y-auto">
                                {
                                    (reviewData.length == 0) ?
                                        <h1 className="font-sans font-semibold flex justify-center items-center my-15">No reviews yet. Be the first to review</h1> :
                                    reviewData.map((review,index) => (
                                        <div key={index}>
                                            <h1 className="mt-2">{review.rating}</h1>
                                            <h1 className="mt-1">{review.writeup}</h1>
                                            <hr className="my-2 h-[2px] rounded-full border-0 bg-gradient-to-r from-blue-500 via-pink-400 to-pink-500" />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {
                    (loading || !product) && 
                        <div className="fixed inset-0 z-100 flex flex-col justify-center backdrop-blur-sm items-center">
                            <div className="mx-auto font-mono font-bold text-2xl text-white">
                                <Image src={"/loading1.gif"} width={200} height={20} alt="Loading..."></Image>
                            </div>
                        </div>
                }

                {
                    review && 
                        <div className="fixed inset-0 z-50 flex flex-col justify-center backdrop-blur-sm items-center">
                            <div className="font-sans bg-gradient-to-br from-blue-200 via-purple-200 to-purple-100 border-3 border-blue-700 rounded-3xl shadow-2xl shadow-gray-400 m-auto w-70 md:m-auto md:w-120">
                                <h1 onClick={() => setReview(false)} className="flex justify-end mr-2 mt-2 hover:cursor-pointer">❌</h1>
                                <h1 className="select-none flex justify-center text-blue-900 font-sans font-semibold md:text-2xl pt-2">Anonymous Review - {product.productName}</h1>                                            
                                <form onSubmit={(e) => {e.preventDefault();handleReview(rating,writeup)}}>
                                    <div className="flex flex-col">
                                        <p className="font-sans p-2 rounded-lg mx-4 text-sm md:text-lg text-blue-900 h-10">How much would rate out of 5 ?</p>
                                        <div className="flex flex-col mx-2 mb-2">
                                            <div>    
                                                <input value={"⭐"} checked={rating === "⭐"} onChange={(e) => setRating(e.target.value)} required className="p-3 ml-4 mr-2 font-sans text-lg" type="radio" name="rating"/>
                                                <label className="font-sans text-lg text-blue-900">⭐</label>
                                            </div>
                                            <div>    
                                                <input value={"⭐⭐"} checked={rating === "⭐⭐"} onChange={(e) => setRating(e.target.value)} required className="p-3 ml-4 mr-2 font-sans text-lg" type="radio" name="rating"/>
                                                <label className="font-sans text-lg text-blue-900">⭐⭐</label>
                                            </div>
                                            <div>    
                                                <input value={"⭐⭐⭐"} checked={rating === "⭐⭐⭐"} onChange={(e) => setRating(e.target.value)} required className="p-3 ml-4 mr-2 font-sans text-lg" type="radio" name="rating"/>
                                                <label className="font-sans text-lg text-blue-900">⭐⭐⭐</label>
                                            </div>
                                            <div>    
                                                <input value={"⭐⭐⭐⭐"} checked={rating === "⭐⭐⭐⭐"} onChange={(e) => setRating(e.target.value)} required className="p-3 ml-4 mr-2 font-sans text-lg" type="radio" name="rating"/>
                                                <label className="font-sans text-lg text-blue-900">⭐⭐⭐⭐</label>
                                            </div>
                                            <div>    
                                                <input value={"⭐⭐⭐⭐⭐"} checked={rating === "⭐⭐⭐⭐⭐"} onChange={(e) => setRating(e.target.value)} required className="p-3 ml-4 mr-2 font-sans text-lg" type="radio" name="rating"/>
                                                <label className="font-sans text-lg text-blue-900">⭐⭐⭐⭐⭐</label>
                                            </div>
                                        </div>
                                        <textarea value={writeup} onChange={(e) => setWriteup(e.target.value)} required className="font-sans p-2 rounded-lg mx-4 text-blue-900 border border-blue-700 h-30" type="text" placeholder="What should other customers know?"/>
                                        <button type="submit" className="font-sans rounded-lg mx-4 my-4 text-sm md:text-lg font-semibold p-1 text-blue-900 border-2 border-blue-900 hover:bg-blue-900 hover:text-purple-100 hover:cursor-pointer transition duration-300 ease-in-out">Submit Review</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                }

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

                <Footer/>
            </div>
        </>
    )
}