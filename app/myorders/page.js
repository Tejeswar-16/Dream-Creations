"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import { auth, db } from "../_util/config";
import { onAuthStateChanged } from "firebase/auth";
import NavBar from "../NavBar";
import Footer from "../Footer";

export default function MyOrders(){

    const [orders,setOrders] = useState([]);
    const [loading,setLoading] = useState(false);
    const [email,setEmail] = useState("");

    const router = useRouter();

    useEffect(() => {
        onAuthStateChanged(auth,(user) => {
            if (user)
                setEmail(user.email);
        });
    },[]);

    useEffect(() => {
        async function fetchOrders(){
            try{
                setLoading(true);
                const q = query(
                    collection(db,"orders"),
                    where("customerEmail","==",email)
                );
                const querySnapshot = await getDocs(q);
                let data = querySnapshot.docs.map((doc) => doc.data());
                data = data.sort((x,y) => y.timestamp - x.timestamp);
                setOrders(data);
            }
            catch(error){
                alert(error);
            }
            finally{
                setLoading(false);
            }
        }
        fetchOrders();
    },[email]);

    return (
        <>
            <div className="relative bg-gradient-to-b from-purple-100 via-purple-100 to-blue-100 py-1 min-h-screen">
                <NavBar/>
                <div className="mx-auto border-3 border-blue-700 rounded-xl shadow-lg shadow-blue-900 p-4 mb-10 bg-gradient-to-br from-blue-100 via-purple-200 to-purple-100 w-75 md:w-190 lg:w-250 xl:w-350">
                    <h1 className="flex justify-center mb-4 font-sans mx-auto font-bold text-blue-900 text-2xl">My Orders</h1>
                    {
                        orders.length == 0 
                        ?
                            <h1 className="select-none flex justify-center font-sans text-lg text-blue-900">You haven&apos;t placed any orders yet. Start shopping to see them here!</h1>
                        :
                            <>
                                <div className="overflow-hidden border border-gray-300 mx-auto overflow-x-auto border border-black md:w-180 lg:w-190">
                                    <table className="mx-auto text-center">
                                        <thead className="bg-blue-950 text-white">
                                            <tr>
                                                <th className="font-sans p-2 font-semibold border border-gray-400">Product Name</th>
                                                <th className="font-sans p-2 font-semibold border border-gray-400">Quantity</th>
                                                <th className="font-sans p-2 font-semibold border border-gray-400">Date of Order</th>
                                                <th className="font-sans p-2 font-semibold border border-gray-400">Customer Name</th>
                                                <th className="font-sans p-2 font-semibold border border-gray-400">Customer Mobile</th>
                                                <th className="font-sans p-2 font-semibold border border-gray-400">Payment Status</th>
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
                                                        <td className="font-sans p-2 border border-black"><button className={order.status === "Pending" ? "bg-yellow-400 p-1 rounded-lg" : order.status === "Payment Received" ? "bg-green-500 text-white p-1 rounded-lg" : "bg-red-500 text-white p-1 rounded-lg"}>{order.status}</button></td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <h1 className="mx-auto flex justify-center text-center font-sans mt-4 text-blue-900">If the payment status remains “Pending” or “Payment Not Received” for more than 24 hours, please contact us at +91 9092886206.</h1>
                            </>
                        }
                        <button onClick={() => router.push("/")} className="font-sans flex justify-center mx-auto mt-6 bg-blue-700 text-white p-2 rounded-xl hover:cursor-pointer hover:scale-105 transition duraton-300 ease-in-out">Go to Home</button>   
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