"use client"

import { useEffect, useRef, useState } from "react";
import Footer from "../Footer";
import NavBar from "../NavBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../_util/config";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function Cart(){

    const [cartProd,setCartProd] = useState([]);
    const [userName,setUserName] = useState("");
    const [email,setEmail] = useState("");
    const [loading,setLoading] = useState(true);    

    const footRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        onAuthStateChanged(auth,(user) => {
            if (user){
                setUserName(user.displayName);
                setEmail(user.email);
            }
        });
    },[]);

    useEffect(() => {
        async function fetchCart(){
            setLoading(true);
            const q = query(
                collection(db,"cart"),
                where("email","==",email),
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => ({
                cartDocId: doc.id,
                ...doc.data()
            }));

            const q1 = query(
                collection(db,"products")
            );
            const querySnapshot1 = await getDocs(q1);
            let data1 = querySnapshot1.docs.map((doc) => doc.data());

            let data2 = [];

            for (const product of data){
                for (const prod of data1){
                    if (product.id === prod.id){
                        prod.quantity = product.quantity;
                        prod.cartDocId = product.cartDocId;
                        data2.push(prod);
                        break;
                    }
                }
            }

            setCartProd(data2);
            setLoading(false);
        }
        fetchCart();
    },[userName,email]);

    async function handleDelete(id){
        try{
            await deleteDoc(doc(db,"cart",id));
            window.location.reload();
        }
        catch(error){
            alert(error)
        }
    }

    return (
        <>
            <div className="relative bg-gradient-to-b from-purple-100 via-purple-100 to-blue-100 py-1 min-h-screen">
                <NavBar footRef={footRef}/>
                
                <div className="mx-auto mb-10 w-75 md:w-150 rounded-xl p-2 border-t-4 border-r-2 border-l-2 border-b-1 border-blue-700 bg-gradient-to-br from-blue-200 via-blue-100 to-pink-100">
                    <h1 className="select-none font-sans flex justify-center font-bold text-lg md:text-3xl text-blue-900 mb-4">Shopping Cart</h1>
                    
                    {
                        cartProd.length == 0 
                        ?
                            <h1 className="flex justify-center font-sans text-lg text-blue-900">Cart is empty</h1>
                        :
                            <div className="overflow-hidden border border-gray-300 mx-auto overflow-x-auto border border-black">
                                <table className="mx-auto text-center">
                                    <thead className="bg-blue-950 text-white">
                                        <tr>
                                            <th className="font-sans p-2 font-semibold border border-gray-400">Product</th>
                                            <th className="font-sans p-2 font-semibold border border-gray-400">Product Name</th>
                                            <th className="font-sans p-2 font-semibold border border-gray-400">Product Description</th>
                                            <th className="font-sans p-2 font-semibold border border-gray-400">Price</th>
                                            <th className="font-sans p-2 font-semibold border border-gray-400">Action</th>
                                            <th className="font-sans p-2 font-semibold border border-gray-400">Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            cartProd.map((product,index) => (
                                                <tr key={index} className="hover:bg-purple-100 transition duration-300 ease-in-out">
                                                    <td className="font-sans md:text-lg p-2 border border-black hover:cursor-pointer"><Image onClick={() => router.push("/products/"+product.id)} src={product.images[0]} width={200} height={100} alt="cart-img"/></td>
                                                    <td className="font-sans md:text-lg p-2 border border-black">{product.productName}</td>
                                                    <td className="font-sans md:text-lg p-2 border border-black">{product.productDescription}</td>
                                                    <td className="font-sans md:text-lg p-2 border border-black">{Number(product.discountPrice)*Number(product.quantity)}.00</td>
                                                    <td className="font-sans md:text-lg p-2 border border-black"><button onClick={() => router.push("/checkout/"+product.id)} className="bg-blue-300 rounded-xl p-1 hover:bg-blue-400 hover:cursor-pointer transition duration-300 ease-in-out">Buy Now</button></td>
                                                    <td className="font-sans md:text-lg p-2 border border-black"><MdDelete onClick={() => handleDelete(product.cartDocId)} className="mx-auto text-3xl text-red-500 hover:cursor-pointer transition duration-300 ease-in-out"/></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                    }
                </div>
                {
                    loading && 
                        <div className="fixed inset-0 z-100 flex flex-col justify-center backdrop-blur-sm items-center">
                            <div className="mx-auto font-mono font-bold text-2xl text-white">
                                <Image src={"/loading1.gif"} width={200} height={20} alt="Loading..."></Image>
                            </div>
                        </div>
                }
                <Footer footRef={footRef}/>
            </div>
        </>
    )
}