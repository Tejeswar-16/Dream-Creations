"use client"

import { onAuthStateChanged, signOut } from "firebase/auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { auth, db } from "../../_util/config";
import { BsPersonSquare } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";
import { addDoc, collection, getDocs, query, serverTimestamp } from "firebase/firestore";

export default function AddCombo(){

    const [username,setUserName] = useState("");
    const [email,setEmail] = useState("");
    const [profileClick,setProfileClick] = useState(false);
    const [loading,setLoading] = useState(false);
    const [combo,setCombo] = useState(false);
    const [products,setProducts] = useState([]);
    const [comboName,setComboName] = useState("");
    const [comboPrice,setComboPrice] = useState("");
    const [selectedProducts,setSelectedProducts] = useState([]);
    const [combos,setCombos] = useState([]);

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

    useEffect(() => {
        async function fetchCombos(){
            try{
                setLoading(true);
                const q = query(
                    collection(db,"combos")
                )
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map((doc) => ({
                    docId: doc.id,
                    ...doc.data()
                }));
                setCombos(data);
                setLoading(false);
            }
            catch(error){
                alert(error);
            }
        }
        fetchCombos();
    },[]);

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

    function handleSelectedProducts(e,product){
        if (e.target.checked){
            setSelectedProducts((prev) => [...prev,product]);
        }
        else{
            setSelectedProducts((prev) => 
                prev.filter((p) => p.id !== product.id)
            );
        }
    }

    async function handleSubmit(){
        try{
            if (selectedProducts.length < 2){
                alert("Select atleast 2 products for a combo");
                return;
            }
            setLoading(true);
            let actualPrice = 0;
            for (const prod of selectedProducts){
                actualPrice += Number(prod.discountPrice);
            }
            await addDoc(collection(db,"combos"),{
                comboId: Date.now() + Math.floor(Math.random()*1000),
                comboName: comboName,
                comboPrice: comboPrice,
                actualPrice: actualPrice.toFixed(2),
                products: selectedProducts.map((product) => ({
                    productId: product.id,
                    productName: product.productName,
                    price: product.discountPrice,
                    productImage: product.images[0]
                })),
                createdAt: serverTimestamp()
            });
            setCombo(false);
            setSelectedProducts([]);
            setComboName("");
            setComboPrice("");
            setLoading(false);
            alert("Combo added successfully!");
        }
        catch(err){
            alert(err.message);
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
                            <h1 className="font-sans font-bold text-sm md:text-xl lg:text-2xl xl:text-3xl select-none text-blue-900">KANAVU CREATIONS ADMIN PANEL</h1>
                        </div>
                        <div className="flex flex-col md:flex-row gap-y-1 justify-end items-center md:gap-x-4">
                            <button onClick={() => router.push("/adminpanel")} className="font-sans border text-sm md:text-lg font-semibold border-blue-800 bg-blue-800 text-purple-100 p-1 rounded-xl hover:bg-blue-900 hover:text-gray-100 hover:cursor-pointer transition duration-300 ease-in-out">Admin Dashboard</button>
                            <button onClick={() => setCombo(true)} className="font-sans border text-sm md:text-lg font-semibold border-blue-800 bg-blue-800 text-purple-100 p-1 rounded-xl hover:bg-blue-900 hover:text-gray-100 hover:cursor-pointer transition duration-300 ease-in-out">Add Combo Offer</button>
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

                <div className="mx-auto mb-10 w-75 md:w-190 lg:w-250 xl:w-350 rounded-xl p-2 border-t-4 border-r-2 border-l-2 border-b-1 border-blue-700 bg-gradient-to-br from-blue-200 via-blue-100 to-pink-100">
                    <h1 className="select-none font-sans flex justify-center font-bold text-lg md:text-3xl text-blue-900 mb-4">Combo Details</h1>
                    
                    {
                        combos.length == 0 
                        ?
                            <h1 className="select-none flex justify-center font-sans text-lg text-blue-900">Add combos to view them here😊</h1>
                        :
                            <div className="overflow-hidden border border-gray-300 mx-auto overflow-x-auto border border-black md:w-185 lg:w-240 xl:w-340">
                                <table className="mx-auto text-center">
                                    <thead className="bg-blue-950 text-white">
                                        <tr>
                                            <th className="font-sans p-2 font-semibold border border-gray-400">Combo Name</th>
                                            <th className="font-sans p-2 font-semibold border border-gray-400">Combo Price</th>
                                            <th className="font-sans p-2 font-semibold border border-gray-400">Actual Price</th>
                                            <th className="font-sans p-2 font-semibold border border-gray-400">Products</th>
                                            <th className="font-sans p-2 font-semibold border border-gray-400">Date & Time</th>
                                            <th className="font-sans p-2 font-semibold border border-gray-400">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            combos.map((combo,index) => (
                                                <tr key={index} className="hover:bg-purple-100 transition duration-300 ease-in-out">
                                                    <td className="font-sans p-2 border border-black">{combo.comboName}</td>
                                                    <td className="font-sans p-2 border border-black">{combo.comboPrice}</td>
                                                    <td className="font-sans p-2 border border-black">{combo.actualPrice}</td>
                                                    <td className="font-sans p-2 border border-black">{combo.products.map(p => p.productName).join(", ")}</td>
                                                    <td className="font-sans p-2 border border-black">{combo.createdAt.toDate().toLocaleString()}</td>
                                                    <td className="font-sans p-2 border border-black"><MdDelete onClick={() => {setProductDelete(true);setDelProdName(product.productName);setDelProdId(product.docId)}} className="mx-auto text-xl text-red-500 hover:cursor-pointer"/></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                    }
                </div>

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
                    combo &&
                    <div className="fixed inset-0 z-50 flex flex-col justify-center backdrop-blur-sm items-center">
                        <div className="select-none font-sans w-75 md:w-150 bg-gradient-to-br from-blue-100 via-purple-200 to-purple-100 rounded-xl shadow-xl p-5 border border-blue-700">
                            <p onClick={() => setCombo(false)} className="flex justify-end hover:cursor-pointer">❌</p>
                            <p className="flex justify-center font-sans select-none font-bold text-xl mb-4 text-blue-900">Add Combo Offer</p>
                            <form onSubmit={(e) => {e.preventDefault();handleSubmit()}}>
                                <div className="flex flex-col gap-y-2">
                                    <input value={comboName} onChange={(e) => setComboName(e.target.value)} required type="text" className="mx-auto font-sans w-120 border rounded-xl p-2 border-blue-900 text-blue-900 font-semibold" placeholder="Combo Name"/>
                                    <input value={comboPrice} onChange={(e) => setComboPrice(e.target.value)} required  type="number" className="mx-auto font-sans w-120 border rounded-xl p-2 border-blue-900 text-blue-900 font-semibold" placeholder="Combo Price"/>
                                    <label className="w-120 mx-auto font-semibold text-blue-900">Select Products</label>
                                    <div className="w-120 h-50 overflow-y-auto border border-blue-900 rounded-xl p-2 mx-auto font-semibold text-blue-900">
                                        {
                                            products.map((product) => (
                                                <div key={product.id}>
                                                    <input type="checkbox" checked={selectedProducts.some(p => p.id === product.id)} value={product.id} onChange={(e) => handleSelectedProducts(e,product)}/> {product.productName}
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <button type="submit" className="mx-auto flex justify-center font-sans mt-2 font-semibold w-35 text-blue-900 rounded-lg shadow-xl p-2 border-2 border-blue-900 hover:bg-blue-900 hover:text-fuchsia-100 hover:scale-110 hover:cursor-pointer transtion duration-300 ease-in-out">Save Combo</button>
                                </div>
                            </form>
                        </div>
                    </div>
                }

            </div>
        </>
    )
}