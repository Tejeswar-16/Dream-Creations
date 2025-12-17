"use client"

import { useEffect, useState } from "react"
import { auth, db } from "..//_util/config.js"
import { BsPersonSquare } from "react-icons/bs";
import Image from "next/image";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function AdminPanel(){

    const [username,setUserName] = useState("");
    const [email,setEmail] = useState("");
    const [profileClick,setProfileClick] = useState(false);
    const [addProduct,setAddProduct] = useState(false);
    const [loading,setLoading] = useState(false);
    const [prodName,setProdName] = useState("");
    const [prodDesc,setProdDesc] = useState("");
    const [actualPrice,setActualPrice] = useState("");
    const [discPrice,setDiscPrice] = useState("");
    const [images,setImages] = useState([]);

    const router = useRouter();

    useEffect(() => {
        onAuthStateChanged(auth,(user) => {
            if (user){
                setUserName(user.displayName);
                setEmail(user.email);
                if (user.email !== "admin@kanavucreations.in")      
                    router.push("/");
            }
            else{
                router.push("/");
            }
        });
    });

    function handleImageChange(e){
        setImages([...e.target.files]);
    }

    async function uploadImages(){
        const uploadedUrls = [];
        for (const image of images){
            const formData = new FormData();
            formData.append("file",image);
            formData.append("upload_preset",process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
            
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();
            uploadedUrls.push(data.secure_url);
        }
        return uploadedUrls;
    }

    async function handleLogout(){
        try{
            await signOut(auth);
            router.replace("/");
            alert("Signed out successfully!");
        }
        catch(error){
            console.log(error.message);
        }
    }

    async function handleAddProduct(prodName,prodDesc,actualPrice,discPrice){
        try
        {
            setLoading(true);
            const imageUrls = await uploadImages();
            await addDoc(collection(db,"products"),{
                id: Date.now() + Math.floor(Math.random()*1000),
                productName: prodName,
                productDescription: prodDesc,
                actualPrice: actualPrice,
                discountPrice: discPrice,
                images: imageUrls,
                createdAt: serverTimestamp()
            });
            alert("Product added successfully!");
            setProdName("");setProdDesc("");setActualPrice("");setDiscPrice("");
            setAddProduct(false);
        }
        catch(error){
            alert(error);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <>
            <div className="relative bg-gradient-to-b from-purple-100 via-purple-100 to-blue-100 py-1 min-h-screen">
                <div className="sticky top-0 mx-auto my-4 p-1 md:p-4 rounded-xl border-blue-700 border-t-4 border-r-3 border-l-3 border-b-2 bg-gradient-to-b from-blue-200 via-purple-100 to-purple-100 w-77 md:w-190 lg:w-250 xl:w-350">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row justify-begin items-center gap-x-2">
                            <div onClick={() => router.push("/")} className="hover:cursor-pointer"><Image className="w-14" src={"/logo.png"} width={70} height={20} alt="logo"></Image></div>
                            <h1 className="font-sans font-bold text-sm lg:text-2xl xl:text-3xl select-none text-blue-900">KANAVU CREATIONS ADMIN PANEL</h1>
                        </div>
                        <div className="flex flex-row justify-end items-center gap-x-4">
                            <button onClick={() => setAddProduct(true)} className="font-sans border text-sm font-semibold border-blue-800 bg-blue-800 text-purple-100 p-1 rounded-xl hover:bg-blue-900 hover:text-gray-100 hover:cursor-pointer transition duration-300 ease-in-out">Add Product</button>
                            <div>
                                {
                                    username === "" && email === "" 
                                    ? 
                                        <h1 onClick={() => setSignIn(true)} className="font-sans select-none border-2 text-sm md:text-lg font-semibold text-blue-900 border-blue-900 hover:bg-blue-900 hover:text-purple-100 rounded-xl p-1 md:p-2 hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out">Sign In</h1>
                                    :
                                        <div onClick={() => setProfileClick(true)} className="flex flex-row items-center gap-x-1 hover:cursor-pointer">
                                            <BsPersonSquare className="text-blue-900 text-sm lg:text-lg"/>
                                            <div className="flex flex-col gap-y-0">
                                                <h1 className="select-none font-sans text-blue-900 text-sm lg:text-lg">{username}</h1>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {
                    profileClick && 
                    <div className="fixed inset-0 z-50 flex flex-col justify-center backdrop-blur-sm items-center">
                        <div className="select-none font-sans bg-gradient-to-br from-blue-100 via-purple-200 to-purple-100 rounded-xl shadow-xl p-5 border border-blue-700">
                            <p className="text-lg text-blue-900">Welcome, {username}</p>
                            <p className="text-lg text-blue-900">{email}</p>
                            <div className="flex justify-center "><button onClick={() => {setProfileClick(false);handleLogout()}} className="bg-red-500 text-white rounded-xl mt-2 p-2 hover:bg-red-600 hover:scale-105 hover:cursor-pointer transition duration-300 ease-in-out">Logout</button></div>
                        </div>
                    </div>
                }

                {
                    loading && 
                        <div className="fixed inset-0 z-100 flex flex-col justify-center backdrop-blur-sm items-center">
                            <div className="mx-auto font-mono font-bold text-2xl text-white">
                                <Image src={"/loading1.gif"} width={200} height={20} alt="Loading..."></Image>
                            </div>
                        </div>
                }

                {
                    addProduct &&
                    <div className="fixed inset-0 z-50 flex flex-col justify-center backdrop-blur-sm items-center">
                        <div className="select-none font-sans w-75 md:w-100 bg-gradient-to-br from-blue-100 via-purple-200 to-purple-100 rounded-xl shadow-xl p-5 border border-blue-700">
                            <p onClick={() => setAddProduct(false)} className="flex justify-end hover:cursor-pointer">❌</p>
                            <p className="flex justify-center font-sans select-none font-bold text-2xl text-blue-900">Add Product</p>
                            <form onSubmit={(e) => {e.preventDefault(e);handleAddProduct(prodName,prodDesc,actualPrice,discPrice)}}>
                                <div className="flex justify-center"><input value={prodName} onChange={(e) => setProdName(e.target.value)} required type="text" className="font-sans w-100 border rounded-xl p-2 mt-4 border-blue-900 text-blue-900 font-semibold" placeholder="Product Name"/></div>
                                <div className="flex justify-center"><textarea value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} required  className="font-sans w-100 border rounded-xl p-2 mt-4 border-blue-900 text-blue-900 font-semibold" placeholder="Product Description"/></div>
                                <div className="flex justify-center"><input value={actualPrice} onChange={(e) => setActualPrice(e.target.value)} required  type="number" className="font-sans w-100 border rounded-xl p-2 mt-4 border-blue-900 text-blue-900 font-semibold" placeholder="Actual Price"/></div>
                                <div className="flex justify-center"><input value={discPrice} onChange={(e) => setDiscPrice(e.target.value)} required  type="number" className="font-sans w-100 border rounded-xl p-2 mt-4 border-blue-900 text-blue-900 font-semibold" placeholder="Discount Price"/></div>
                                <div className="flex justify-center"><input onChange={handleImageChange} required type="file" accept="image/*" multiple className="font-sans ml-30 md:ml-6 rounded-xl p-2 mt-4 text-blue-900 font-semibold hover:cursor-pointer" placeholder="Product Name"/></div>
                                <div className="flex justify-center"><button className="flex justify-center font-sans mt-6 font-bold w-25 rounded-xl shadow-xl p-2 border-2 border-blue-900 hover:bg-blue-900 hover:text-fuchsia-100 hover:scale-110 hover:cursor-pointer transtion duration-300 ease-in-out">Add</button></div>
                            </form>
                        </div>
                    </div>
                }

            </div>
        </>
    )
}