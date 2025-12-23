"use client"

import { useEffect, useState } from "react";
import Footer from "../../Footer";
import NavBar from "../../NavBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../_util/config";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode";
import { addDoc, collection, getDocs, query, serverTimestamp, Timestamp, where } from "firebase/firestore";

export default function Checkout(){

    const [userName,setUserName] = useState("");
    const [email,setEmail] = useState("");
    const [address,setAddress] = useState("");
    const [city,setCity] = useState("");
    const [state,setState] = useState("");
    const [pincode,setPincode] = useState("");
    const [mobile,setMobile] = useState("");
    const [product,setProduct] = useState([]);
    const [quantity,setQuantity] = useState(1);
    const [loading,setLoading] = useState(false);
    const [proceed,setProceed] = useState(false);
    const [upiLink,setUpiLink] = useState("");
    const [qrImage,setQrImage] = useState("");

    const router = useRouter();
    
    useEffect(() => {
        onAuthStateChanged(auth,(user) => {
            setUserName(user.displayName);
            setEmail(user.email);
        })
    },[]);

    const params = useParams();

    useEffect(() => {
        async function fetchProduct(){
            setLoading(true);
            const q = query(
                collection(db,"products"),
                where("id","==",Number(params.productId))
            )
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => doc.data());
            setProduct(data[0]);
            setLoading(false);
        }
        fetchProduct();
    },[]);

    async function handleSubmit(){
        try{
            setLoading(true);
            await addDoc(collection(db,"orders"),{
                orderId: product.id + email.split("@")[0],
                productName: product.productName,
                quantity: quantity,
                customerName: userName,
                customerEmail: email,
                customerMobile: mobile,
                deliveryAddress: address.toUpperCase(),
                deliveryCity: city.toUpperCase(),
                deliveryState: state.toUpperCase(),
                pincode: pincode,
                status: "Pending",
                date: new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear(),
                timestamp: serverTimestamp() 
            });

            const upi = generateUPIQR({
                upiId: "lhema2889-1@okicici",
                name: "Kanavu Creations",
                amount: (Number(product.discountPrice*quantity)+40).toFixed(2)
            });

            const qr = await QRCode.toDataURL(upi);
            window.location.href = upi;
            setUpiLink(upi);
            setQrImage(qr);
            setProceed(true);
            setLoading(false);
        }   
        catch(error){
            alert(error);
        }
    }

    function generateUPIQR({upiId,name,amount}){
        console.log(upiLink);
        return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent("Ordered "+product.productName)}`
    }

    return (
        <>
            <div className="relative bg-gradient-to-b from-purple-100 via-purple-100 to-blue-100 py-1 min-h-screen">
                <NavBar/>
                <div className="flex flex-col gap-y-4 md:flex-row mx-auto border-3 border-blue-700 rounded-xl shadow-lg shadow-blue-900 p-4 mb-10 bg-gradient-to-br from-blue-100 via-purple-200 to-purple-100 w-75 md:w-190 lg:w-250 xl:w-350">
                    <div className="flex-1 lg:p-2">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <div className="flex justify-start gap-x-4 items-center">                                
                                {
                                    product?.images?.length > 0 && 
                                        <Image onClick={() => router.push("/products/"+product.id)} className="rounded-xl hover:cursor-pointer" src={product?.images[0]} width={70} height={50} alt="prod-image"></Image>
                                } 
                                <div className="flex flex-col gap-y-1">
                                    <h1 className="font-sans text-blue-900 font-bold lg:text-xl">{product.productName}</h1>
                                    <h1 className="font-sans text-blue-900 font-semibold text-sm lg:text-lg">{product.productDescription}</h1>
                                    <div className="flex items-center gap-4">
                                        <span className="font-sans font-semibold text-blue-900">Quantity</span>
                                        <div className="select-none font-sans flex border border-blue-700 rounded-lg text-blue-900">
                                            <button disabled={proceed} onClick={() => setQuantity(quantity<=1 ? 1 : quantity-1)} className={proceed ? "px-3 hover:cursor-not-allowed disabled  " : "px-3 hover:cursor-pointer"}>−</button>
                                            <span className="px-2 md:px-4">{quantity}</span>
                                            <button disabled={proceed} onClick={() => setQuantity(quantity+1)} className={proceed ? "px-3 hover:cursor-not-allowed" : "px-3 hover:cursor-pointer"}>+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mr-30 mt-1 md:mr-20">
                                <h1 className="font-sans text-blue-900 font-semibold lg:text-lg">₹{(Number(product.discountPrice)*quantity).toFixed(2)}</h1>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between mt-4 items-center">
                            <h1 className="font-sans text-blue-900 font-semibold text-lg">Subtotal</h1>
                            <h1 className="font-sans text-blue-900 font-semibold text-lg md:mr-20">₹{(Number(product.discountPrice)*quantity).toFixed(2)}</h1>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="font-sans text-blue-900 font-semibold text-lg">Delivery Charges</h1>
                            <h1 className="font-sans text-blue-900 font-semibold text-lg md:mr-20">₹40.00</h1>
                        </div>
                        <div className="flex flex-row justify-between items-center mt-4">
                            <h1 className="font-sans text-blue-900 font-bold text-xl">Total</h1>
                            <h1 className="font-sans text-blue-900 font-bold text-xl md:mr-20">₹{(Number(product.discountPrice*quantity)+40).toFixed(2)}</h1>
                        </div>
                    </div>
                    <div className="flex-1 lg:p-2">
                        <div className="border border-fuchsia-900 p-2 rounded-xl md:w-90 lg:w-150 xl:w-175">
                            <h1 className="select-none font-sans font-bold text-xl text-blue-900">Delivering to {userName}</h1>
                            <form onSubmit={(e) => {e.preventDefault();handleSubmit()}}>
                                <input required value={address} onChange={(e) => setAddress(e.target.value)} className="font-sans border border-blue-900 p-1 text-blue-900 rounded-lg mt-2 mb-1 w-59 md:w-85 lg:w-145 xl:w-168" type="text" placeholder="Address"></input>
                                <div className="flex flex-row flex-wrap justify-center gap-x-4 w-59 md:w-85 lg:w-145 xl:w-168">
                                    <input required value={city} onChange={(e) => setCity(e.target.value)} className="font-sans border border-blue-900 p-1 text-blue-900 rounded-lg my-2 md:w-40 lg:w-40 xl:w-45" type="text" placeholder="City"></input>
                                    <input required value={state} onChange={(e) => setState(e.target.value)} className="font-sans border border-blue-900 p-1 text-blue-900 rounded-lg my-2 md:w-40  lg:w-40 xl:w-45" type="text" placeholder="State"></input>
                                    <input required value={pincode} onChange={(e) => setPincode(e.target.value)} className="font-sans border border-blue-900 p-1 text-blue-900 rounded-lg my-2 md:w-40 lg:w-40 xl:w-45" type="number" placeholder="Pincode"></input>
                                    <input required value={mobile} onChange={(e) => setMobile(e.target.value)} className="font-sans border border-blue-900 p-1 text-blue-900 rounded-lg my-2 lg:mt-1 md:w-40 lg:w-40 xl:w-45" type="number" placeholder="Mobile Number"></input>
                                </div>
                                <button type="submit" className="flex justify-center mx-auto font-sans mt-1 mb-2 p-1 w-50 rounded-lg bg-blue-700 hover:bg-blue-800 cursor-pointer text-white transition duration-300 ease-in-out">Proceed</button>
                            </form>
                        </div>
                        {
                            proceed && 
                                <div className="hidden sm:block border border-fuchsia-900 p-2 rounded-xl mt-4">
                                    <h1 className="select-none font-sans font-bold text-xl text-blue-900">Payment</h1>
                                    <p className="select-none font-sans text-blue-900 italic">We accept payment only through UPI</p>
                                    <div className="flex flex-col justify-center items-center">
                                        <p className="select-none mt-4 font-semibold font-sans text-blue-900">Scan QR Code to Complete Payment</p>
                                        <p className="select-none text-sm font-sans text-blue-900">Please scan the QR code below to pay ₹{(Number(product.discountPrice*quantity)+40).toFixed(2)}</p>
                                        <div className="mt-2 flex flex-row gap-x-1 items-center">
                                            <p className="select-none font-sans font-semibold text-fuchsia-900">Amount:</p>
                                            <p className="select-none text-lg font-sans font-bold text-fuchsia-900">₹{(Number(product.discountPrice*quantity)+40).toFixed(2)}</p>
                                        </div>
                                        {     
                                            qrImage && 
                                                <Image className="rounded-xl" src={qrImage} width={200} height={50} alt="qr-code"></Image>
                                        }
                                        <p className="select-none text-sm font-sans text-fuchsia-900 mt-2 font-semibold">UPI ID: lhema2889-1@okicici</p>
                                        <p className="select-none text-sm font-sans text-fuchsia-900 font-semibold">Name: Kanavu Creations</p>
                                        <button onClick={() => router.push("/myorders")} className="flex justify-center mx-auto font-sans my-4 p-1 w-50 rounded-lg bg-blue-700 hover:bg-blue-800 cursor-pointer text-white transition duration-300 ease-in-out">Check Payment Status</button>
                                    </div>
                                </div>
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
                <Footer/>
            </div>
        </>
    )
}