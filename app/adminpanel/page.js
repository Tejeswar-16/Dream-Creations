"use client"

import { useEffect, useState } from "react"
import { auth, db } from "..//_util/config.js"
import { BsPersonSquare } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Image from "next/image";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";

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
    const [orders,setOrders] = useState([]);
    const [verification,setVerification] = useState(false);
    const [productName,setProductName] = useState("");
    const [customerName,setCustomerName] = useState("");
    const [orderId,setOrderId] = useState("");
    const [stocks,setStocks] = useState(false);
    const [products,setProducts] = useState([]);
    const [productDelete,setProductDelete] = useState(false);
    const [updateProdId,setUpdateProdId] = useState("");
    const [delProdName,setDelProdName] = useState("");
    const [delProdId,setDelProdId] = useState("");

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

    useEffect(() => {
        async function fetchOrders(){
            try{
                setLoading(true);
                const q = query(
                    collection(db,"orders")
                );
                const querySnapshot = await getDocs(q);
                let data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                data = data.sort((x,y) => y.timestamp - x.timestamp);
                setOrders(data);
                setLoading(false);
            }
            catch(error){
                alert(error);
            }
        }
        fetchOrders();;    
    },[]);

    useEffect(() => {
        async function fetchProducts(){
            try{
                setLoading(true);
                const q = query(
                    collection(db,"products")
                )
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map((doc) => ({
                    docId: doc.id,
                    ...doc.data()
                }));
                setProducts(data);
                setLoading(false);
            }
            catch(error){
                alert(error);
            }
        }
        fetchProducts();
    },[]);

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
            const q = query(
                collection(db,"products"),
                where("id","==",updateProdId),
            );
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty){
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
            }
            else{
                querySnapshot.forEach(async (document) => {
                    const docRef = doc(db,"products",document.id);
                    await updateDoc(docRef,{
                        productName: prodName,
                        productDescription: prodDesc,
                        actualPrice: actualPrice,
                        discountPrice: discPrice,
                        images: imageUrls,
                        createdAt: serverTimestamp()
                    });
                });
                alert("Product updated successfully!");
            }
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

    function handleVerification(orderId,productName,custName){
        setProductName(productName);
        setCustomerName(custName);
        setOrderId(orderId);
    }

    async function handlePaymentVerification(received){
        try{
            setLoading(true);
            const q = query(
                collection(db,"orders"),
                where("orderId","==",orderId)
            );
            const querySnapshot = await getDocs(q);
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef,{
                status: received ? "Payment Received" : "Payment not Received"
            });
            window.location.reload();
        }
        catch(error){
            alert(error);
        }
        finally{
            setLoading(false);
        }
    }

    function handleUpdateProduct(name,desc,actualPrice,discPrice){
        setAddProduct(true);
        setProdName(name);
        setProdDesc(desc);
        setActualPrice(actualPrice);
        setDiscPrice(discPrice);
    }

    async function handleProductDelete(){
        try{
            setLoading(true);
            await deleteDoc(doc(db,"products",delProdId));
            alert("Product deleted successfully!");
            setLoading(false);
            setProductDelete(false);
        }
        catch(err){
            alert(err.message);
        }
    }

    return (
        <>
            <div className="relative bg-gradient-to-b from-purple-100 via-purple-100 to-blue-100 py-1 min-h-screen">
                <div className="sticky top-0 mx-auto my-4 p-1 md:p-4 rounded-xl border-blue-700 border-t-4 border-r-3 border-l-3 border-b-2 bg-gradient-to-b from-blue-200 via-purple-100 to-purple-100 w-77 md:w-190 lg:w-250 xl:w-350">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row justify-begin items-center gap-x-2">
                            <div onClick={() => router.push("/")} className="hover:cursor-pointer"><Image className="w-14" src={"/logo.png"} width={70} height={20} alt="logo"></Image></div>
                            <h1 className="font-sans font-bold text-sm md:text-xl lg:text-2xl xl:text-3xl select-none text-blue-900">KANAVU CREATIONS ADMIN PANEL</h1>
                        </div>
                        <div className="flex flex-col md:flex-row gap-y-1 justify-end items-center md:gap-x-4">
                            <button onClick={() => router.push("/adminpanel/addcombo")} className="font-sans border text-sm md:text-lg font-semibold border-blue-800 bg-blue-800 text-purple-100 p-1 rounded-xl hover:bg-blue-900 hover:text-gray-100 hover:cursor-pointer transition duration-300 ease-in-out">Add Combo Offer</button>
                            <button onClick={() => setStocks(true)} className="font-sans border text-sm md:text-lg font-semibold border-blue-800 bg-blue-800 text-purple-100 p-1 rounded-xl hover:bg-blue-900 hover:text-gray-100 hover:cursor-pointer transition duration-300 ease-in-out">Stocks</button>
                            <button onClick={() => setAddProduct(true)} className="font-sans border text-sm md:text-lg font-semibold border-blue-800 bg-blue-800 text-purple-100 p-1 rounded-xl hover:bg-blue-900 hover:text-gray-100 hover:cursor-pointer transition duration-300 ease-in-out">Add Product</button>
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
                    !stocks && 
                        <div className="mx-auto mb-10 w-75 md:w-190 lg:w-250 xl:w-350 rounded-xl p-2 border-t-4 border-r-2 border-l-2 border-b-1 border-blue-700 bg-gradient-to-br from-blue-200 via-blue-100 to-pink-100">
                            <h1 className="select-none font-sans flex justify-center font-bold text-lg md:text-3xl text-blue-900 mb-4">Order Details</h1>
                            
                            {
                                orders.length == 0 
                                ?
                                    <h1 className="select-none flex justify-center font-sans text-lg text-blue-900">No orders yet😔</h1>
                                :
                                    <div className="overflow-hidden border border-gray-300 mx-auto overflow-x-auto border border-black md:w-185 lg:w-240 xl:w-340">
                                        <table className="mx-auto text-center">
                                            <thead className="bg-blue-950 text-white">
                                                <tr>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">Product Name</th>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">Quantity</th>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">Date of Order</th>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">Customer Name</th>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">Customer Mobile</th>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">Customer Email</th>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">Address</th>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">City</th>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">State</th>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">Pincode</th>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">Payment Verification</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    orders.map((order,index) => (
                                                        <tr key={index} className="hover:bg-purple-100 transition duration-300 ease-in-out">
                                                            <td className="font-sans p-2 border border-black">{order.productName}</td>
                                                            <td className="font-sans p-2 border border-black">{order.quantity}</td>
                                                            <td className="font-sans p-2 border border-black">{order.date}</td>
                                                            <td className="font-sans p-2 border border-black">{order.customerName}</td>
                                                            <td className="font-sans p-2 border border-black">{order.customerMobile}</td>
                                                            <td className="font-sans p-2 border border-black">{order.customerEmail}</td>
                                                            <td className="font-sans p-2 border border-black">{order.deliveryAddress}</td>
                                                            <td className="font-sans p-2 border border-black">{order.deliveryCity}</td>
                                                            <td className="font-sans p-2 border border-black">{order.deliveryState}</td>
                                                            <td className="font-sans p-2 border border-black">{order.pincode}</td>
                                                            <td className="font-sans p-2 border border-black"><button onClick={() => {setVerification(true);handleVerification(order.orderId,order.productName,order.customerName)}} className={order.status === "Pending" ? "bg-yellow-400 hover:cursor-pointer p-1 rounded-lg" : order.status === "Payment Received" ? "bg-green-500 text-white hover:cursor-pointer p-1 rounded-lg" : "bg-red-500 text-white hover:cursor-pointer p-1 rounded-lg"}>{order.status}</button></td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                            }
                        </div>
                }

                {
                    stocks && 
                        <div className="mx-auto mb-10 w-75 md:w-190 lg:w-250 xl:w-350 rounded-xl p-2 border-t-4 border-r-2 border-l-2 border-b-1 border-blue-700 bg-gradient-to-br from-blue-200 via-blue-100 to-pink-100">
                            <div onClick={() => setStocks(false)} className="select-none font-sans flex justify-end font-bold md:text-lg text-blue-900 mb-4"><h1 className="hover:cursor-pointer">❌</h1></div>
                            <h1 className="select-none font-sans flex justify-center font-bold text-lg md:text-3xl text-blue-900 mb-4">Stocks</h1>
                            
                            {
                                products.length == 0 
                                ?
                                    <h1 className="select-none flex justify-center font-sans text-lg text-blue-900">Add products to see them here😊</h1>
                                :
                                    <div className="overflow-hidden border border-gray-300 mx-auto overflow-x-auto border border-black md:w-185 lg:w-240 xl:w-340">
                                        <table className="mx-auto text-center">
                                            <thead className="bg-blue-950 text-white">
                                                <tr>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">Product Name</th>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">Product Description</th>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">Actual Price</th>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">Discount Price</th>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">Date added</th>
                                                    <th className="font-sans p-2 font-semibold border border-gray-400">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    products.map((product,index) => (
                                                        <tr key={index} className="hover:bg-purple-100 transition duration-300 ease-in-out">
                                                            <td className="font-sans p-2 border border-black">{product.productName}</td>
                                                            <td className="font-sans p-2 border border-black">{product.productDescription}</td>
                                                            <td className="font-sans p-2 border border-black">{product.actualPrice}</td>
                                                            <td className="font-sans p-2 border border-black">{product.discountPrice}</td>
                                                            <td className="font-sans p-2 border border-black">{product.createdAt.toDate().toLocaleString()}</td>
                                                            <td className="font-sans p-2 border border-black">
                                                                <div className=" flex flex-row justify-between text-xl">
                                                                    <FaEdit onClick={() => {setUpdateProdId(product.id);handleUpdateProduct(product.productName,product.productDescription,product.actualPrice,product.discountPrice)}} className="text-green-700 hover:cursor-pointer"/>
                                                                    <MdDelete onClick={() => {setProductDelete(true);setDelProdName(product.productName);setDelProdId(product.docId)}} className="text-red-500 hover:cursor-pointer"/>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                            }
                        </div>
                }

                {
                    verification && 
                    <div className="fixed inset-0 z-50 flex flex-col justify-center backdrop-blur-sm items-center">
                        <div className="select-none w-75 md:w-100 font-sans bg-gradient-to-br from-blue-100 via-purple-200 to-purple-100 rounded-xl shadow-xl p-4 border border-blue-700">
                            <p onClick={() => setVerification(false)} className="flex justify-end hover:cursor-pointer text-blue-900">❌</p>
                            <p className="flex justify-center font-semibold mb-2 text-xl text-blue-900">Payment Verification</p>
                            <p className="text-lg text-blue-900 font-semibold">Product Name:</p>
                            <p className="text-lg text-blue-900">{productName}</p>
                            <p className="text-lg font-semibold text-blue-900">Customer Name:</p>
                            <p className="text-lg text-blue-900">{customerName}</p>
                            <div className="flex justify-center flex-row gap-x-2">
                                <button onClick={() => {setVerification(false);handlePaymentVerification(true)}} className="bg-green-600 text-white rounded-xl mt-2 p-2 hover:bg-green-700 hover:scale-105 hover:cursor-pointer transition duration-300 ease-in-out">Payment Received</button>
                                <button onClick={() => {setVerification(false);handlePaymentVerification(false)}} className="bg-red-500 text-white rounded-xl mt-2 p-2 hover:bg-red-600 hover:scale-105 hover:cursor-pointer transition duration-300 ease-in-out">Payment not Received</button>
                            </div>
                        </div>
                    </div>
                }

                {
                    productDelete && 
                    <div className="fixed inset-0 z-50 flex flex-col justify-center backdrop-blur-sm items-center">
                        <div className="select-none font-sans w-70 md:w-100 bg-gradient-to-br from-blue-100 via-purple-200 to-purple-100 rounded-xl shadow-xl p-4 border border-blue-700">
                            <p onClick={() => setProductDelete(false)} className="flex justify-end hover:cursor-pointer text-blue-900">❌</p>
                            <p className="flex justify-center text-center font-semibold mb-2 text-blue-900">Are you sure to delete this product? This action will permanently delete this product from your stocks.</p>
                            <p className="text-blue-900 flex justify-center">Product Name: {delProdName}</p>
                            <div className="flex flex-row gap-x-2 justify-center">
                                <div className="flex justify-center"><button onClick={handleProductDelete} className="bg-red-500 w-25 text-white rounded-lg mt-2 p-2 hover:bg-red-600 hover:scale-105 hover:cursor-pointer transition duration-300 ease-in-out">Delete</button></div>
                                <div className="flex justify-center"><button onClick={() => setProductDelete(false)} className="bg-gray-500 w-25 text-white rounded-lg mt-2 p-2 hover:bg-gray-600 hover:scale-105 hover:cursor-pointer transition duration-300 ease-in-out">Cancel</button></div>
                            </div>
                        </div>
                    </div>
                }
                
                {
                    profileClick && 
                    <div className="fixed inset-0 z-50 flex flex-col justify-center backdrop-blur-sm items-center">
                        <div className="select-none font-sans bg-gradient-to-br from-blue-100 via-purple-200 to-purple-100 rounded-xl shadow-xl p-4 border border-blue-700">
                            <p onClick={() => setProfileClick(false)} className="flex justify-end hover:cursor-pointer text-blue-900">❌</p>
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
                            <p className="flex justify-center font-sans select-none font-bold text-2xl text-blue-900">Products Form</p>
                            <form onSubmit={(e) => {e.preventDefault(e);handleAddProduct(prodName,prodDesc,actualPrice,discPrice)}}>
                                <div className="flex justify-center"><input value={prodName} onChange={(e) => setProdName(e.target.value)} required type="text" className="font-sans w-100 border rounded-xl p-2 mt-4 border-blue-900 text-blue-900 font-semibold" placeholder="Product Name"/></div>
                                <div className="flex justify-center"><textarea value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} required  className="font-sans w-100 border rounded-xl p-2 mt-4 border-blue-900 text-blue-900 font-semibold" placeholder="Product Description"/></div>
                                <div className="flex justify-center"><input value={actualPrice} onChange={(e) => setActualPrice(e.target.value)} required  type="number" className="font-sans w-100 border rounded-xl p-2 mt-4 border-blue-900 text-blue-900 font-semibold" placeholder="Actual Price"/></div>
                                <div className="flex justify-center"><input value={discPrice} onChange={(e) => setDiscPrice(e.target.value)} required  type="number" className="font-sans w-100 border rounded-xl p-2 mt-4 border-blue-900 text-blue-900 font-semibold" placeholder="Discount Price"/></div>
                                <div className="flex justify-center"><input onChange={handleImageChange} required type="file" accept="image/*" multiple className="font-sans ml-30 md:ml-6 rounded-xl p-2 mt-4 text-blue-900 font-semibold hover:cursor-pointer" placeholder="Product Name"/></div>
                                <div className="flex justify-center"><button className="flex justify-center font-sans mt-6 font-bold w-25 rounded-xl shadow-xl p-2 border-2 border-blue-900 hover:bg-blue-900 hover:text-fuchsia-100 hover:scale-110 hover:cursor-pointer transtion duration-300 ease-in-out">Submit</button></div>
                            </form>
                        </div>
                    </div>
                }

            </div>
        </>
    )
}