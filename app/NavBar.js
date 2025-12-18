"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineShoppingCart  } from "react-icons/md";
import { BsPersonSquare } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { auth } from ".//_util/config.js"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";

export default function NavBar({footRef}){
    const [home,setHome] = useState(true);
    const [about,setAbout] = useState(false);
    const [shop,setShop] = useState(false);
    const [contact,setContact] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [signIn,setSignIn] = useState(false);
    const [signInEmail,setSignInEmail] = useState("");
    const [signInPassword,setSignInPassword] = useState("");
    const [signUpClick,setSignUpClick] = useState(false);
    const [signUpName,setSignUpName] = useState("");
    const [signUpEmail,setSignUpEmail] = useState("");
    const [signUpPassword,setSignUpPassword] = useState("");
    const [signUpConfirmPassword,setSignUpConfirmPassword] = useState("");
    const [pwdError,setPwdError] = useState("");
    const [loading,setLoading] = useState(false);
    const [invalidEmailPassword,setInvalidEmailPassword] = useState(false);
    const [username,setUserName] = useState("");
    const [email,setEmail] = useState("");
    const [profileClick,setProfileClick] = useState(false);

    const router = useRouter();

    const scrollToFooter = () => {
        footRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleNav = (item) => {
        setHome(item === "home");
        setAbout(item === "about");
        setShop(item === "shop");
        setContact(item === "contact");
    }

    useEffect(() => {
        onAuthStateChanged(auth,(user) => {
            if (user){
                setUserName(user.displayName);
                setEmail(user.email);
            }
        });
    });

    function handlePasswordCheck(password,confirmPassword){
        if (password !== confirmPassword)
            setPwdError("Passwords do not match");
        else
            setPwdError("");
    }

    async function signUpWithFirebase(name,email,password){
        if (pwdError){
            alert(pwdError);
            return;
        }
        try
        {   
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth,email,password);
            const user = userCredential.user;
            setSignUpName("");setSignUpPassword("");
            setSignUpEmail("");setSignUpConfirmPassword("");
            setSignUpClick(false);setSignIn(true);
            await updateProfile(user, {displayName: name});
            alert("Success! Created account with Kanavu Creations");
        }
        catch(error)
        {
            if (error.code === "auth/password-does-not-meet-requirements")
                setPwdError("Password must contain at least 8 characters, an upper case character, numeric character, a non-alphanumeric character");
            if (error.code == "auth/email-already-in-use")
                alert("Looks like you already have an account. Sign in with this email");
        }
        finally{
            setLoading(false);
        }
    }

    async function signInWithFirebase(email,password){
        try{
            setLoading(true);
            await signInWithEmailAndPassword(auth,email,password);
            if (email === "admin@kanavucreations.in")
                router.push("/adminpanel");
            setSignInEmail("");setSignInPassword("");
            setSignIn(false);
        }
        catch(error){
            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential"){
                setSignIn(false);
                setInvalidEmailPassword(true);
            }
            else
                setInvalidEmailPassword(false);
        }
        finally{
            setLoading(false);
        }
    }

    async function handleLogout(){
        try{
            await signOut(auth);
            alert("Signed out successfully!");
            router.push("/");
            window.location.reload();
        }
        catch(error){
            console.log(error.message);
        }
    }

    return (
        <>
            <div className="z-25 sticky top-0 mx-auto my-4 p-1 md:p-4 rounded-xl border-blue-700 border-t-4 border-r-3 border-l-3 border-b-2 bg-gradient-to-b from-blue-200 via-purple-100 to-purple-100 w-77 md:w-190 lg:w-250 xl:w-350">
                <div className="flex flex-row justify-between items-center">
                    <div onClick={() => router.push("/")} className="hover:cursor-pointer"><Image className="w-14" src={"/logo.png"} width={70} height={20} alt="logo"></Image></div>
                    
                    <div className="font-sans font-bold text-sm lg:text-2xl xl:text-3xl flex md:flex-row flex-col md:gap-x-4 lg:gap-x-8">
                        <h1 className="select-none text-pink-500">K A N A V U</h1>
                        <h1 className="select-none text-blue-800">C R E A T I O N S</h1>
                    </div>

                    {/*Desktop*/}
                    <div className="hidden font-sans select-none md:flex md:flex-row md:justify-between md:gap-x-2 lg:gap-x-4 xl:gap-x-8">
                        <div onClick={() => {router.push("/");handleNav("home")}} className={home ? "bg-gradient-to-b from-blue-200 to-purple-100 rounded-xl p-2 font-semibold text-blue-900 hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out md:text-sm lg:text-lg" : "md:text-sm lg:text-lg p-2 text-blue-900 font-semibold hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out"}>Home</div>
                        <div onClick={() => {router.push("/");handleNav("about")}} className={about ? "bg-gradient-to-b from-blue-200 to-purple-100 rounded-xl p-2 font-semibold text-blue-900 hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out md:text-sm lg:text-lg" : "md:text-sm lg:text-lg p-2 text-blue-900 font-semibold hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out"}>About</div>
                        <div onClick={() => {router.push("/");handleNav("shop")}} className={shop ? "bg-gradient-to-b from-blue-200 to-purple-100 rounded-xl p-2 font-semibold text-blue-900 hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out md:text-sm lg:text-lg" : "md:text-sm lg:text-lg p-2 text-blue-900 font-semibold hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out"}>Shop</div>
                        <div onClick={() => {scrollToFooter();handleNav("contact")}} className={contact ? "bg-gradient-to-b from-blue-200 to-purple-100 rounded-xl p-2 font-semibold text-blue-900 hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out md:text-sm lg:text-lg" : "md:text-sm lg:text-lg p-2 text-blue-900 font-semibold hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out"}>Contact</div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-x-8 items-center">
                        <div className="flex flex-row items-center gap-x-2">
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
                            {/*Mobile*/}
                            <div className="md:hidden">
                                <GiHamburgerMenu onClick={() => setMenuOpen(!menuOpen)} className="text-blue-900" size={25}/>
                            </div>
                        </div>
                        <div onClick={() => router.push("/cart")} className="flex flex-row hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out">
                            <MdOutlineShoppingCart className="text-blue-900" size={35}/>
                            <h1 className="select-none font-sans text-sm md:text-lg text-blue-900 font-bold mt-3">Cart</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`fixed top-0 right-0 h-full w-64 bg-white z-50
                transform transition-transform duration-300 ease-in-out
                ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
                >
                {/* Close button */}
                <div className="flex justify-end p-4">
                    <button
                    className="text-xl font-bold"
                    onClick={() => setMenuOpen(false)}
                    >
                    ✕
                    </button>
                </div>

                {/* Menu items */}
                <div className="flex flex-col gap-4 px-6">
                    <div onClick={() => { router.push("/");handleNav("home"); setMenuOpen(false); }} className={home ? "bg-gradient-to-b from-blue-200 to-purple-100 rounded-xl p-2 font-semibold text-blue-900 hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out md:text-sm lg:text-lg" : "md:text-sm lg:text-lg p-2 text-blue-900 font-semibold hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out"}>Home</div>
                    <div onClick={() => { handleNav("about"); setMenuOpen(false); }} className={about ? "bg-gradient-to-b from-blue-200 to-purple-100 rounded-xl p-2 font-semibold text-blue-900 hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out md:text-sm lg:text-lg" : "md:text-sm lg:text-lg p-2 text-blue-900 font-semibold hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out"}>About</div>
                    <div onClick={() => { handleNav("shop"); setMenuOpen(false); }} className={shop ? "bg-gradient-to-b from-blue-200 to-purple-100 rounded-xl p-2 font-semibold text-blue-900 hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out md:text-sm lg:text-lg" : "md:text-sm lg:text-lg p-2 text-blue-900 font-semibold hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out"}>Shop</div>
                    <div onClick={() => { scrollToFooter();handleNav("contact"); setMenuOpen(false); }} className={contact ? "bg-gradient-to-b from-blue-200 to-purple-100 rounded-xl p-2 font-semibold text-blue-900 hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out md:text-sm lg:text-lg" : "md:text-sm lg:text-lg p-2 text-blue-900 font-semibold hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out"}>Contact</div>
                </div>
            </div>

            {
                signIn && 
                <div className="fixed inset-0 z-50 flex flex-col justify-center backdrop-blur-sm items-center">
                    <div className="flex flex-col justify-center select-none font-sans bg-gradient-to-br from-blue-200 via-purple-200 to-purple-100 rounded-xl shadow-xl p-5 border-3 border-blue-700 w-75 md:w-90">
                        <h1 onClick={() => setSignIn(false)} className="flex justify-end hover:cursor-pointer">❌</h1>
                        <h1 className="select-none flex justify-center text-blue-900 font-sans font-semibold text-2xl pt-2">Sign In</h1>                        
                        <form onSubmit={(e) => {e.preventDefault();signInWithFirebase(signInEmail,signInPassword)}}>
                            <div className="flex flex-col">
                                <input value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} required className="font-sans p-2 rounded-lg mx-4 mt-4 mb-2 text-blue-900 border border-blue-700 h-10" type="email" placeholder="Email"/>
                                <input value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} required className="font-sans p-2 rounded-lg mx-4 text-blue-900 border border-blue-700 h-10" type="password" placeholder="Password"/>
                                <button type="submit" className={(signInEmail === "" || signInPassword === "") ? "font-sans rounded-lg mt-4 mx-4 border-2 border-blue-900 bg-blue-900 text-purple-100 text-xl h-10 hover:cursor-not-allowed" : "font-sans rounded-lg mt-4 mx-4 text-purple-100 text-xl bg-blue-900 h-10 hover:cursor-pointer"}>Sign In</button>
                            </div>
                        </form>
                        <button className="flex justify-end font-sans my-2 mx-4 text-sm md:text-md text-red-500 font-semibold hover:cursor-pointer">Forgot Password?</button>
                        <div className="flex flex-row justify-center">
                            <p className="select-none font-sans text-blue-900 md:mx-4 mb-2 p-1">New to Kanavu Creations?</p>
                            <button onClick={() => {setSignIn(false);setSignUpClick(true)}} className="font-sans rounded-lg mb-2 font-semibold p-1 text-blue-900 border-2 border-blue-900 hover:bg-blue-900 hover:text-purple-100 hover:cursor-pointer transition duration-300 ease-in-out">Sign Up</button>
                        </div>
                    </div>
                </div>
            }

            {
                signUpClick &&
                <div className="fixed inset-0 z-50 flex flex-col justify-center backdrop-blur-sm items-center">
                    <div className="font-sans bg-gradient-to-br from-blue-200 via-purple-200 to-purple-100 border-3 border-blue-700 rounded-3xl shadow-2xl shadow-gray-400 m-auto w-70 md:m-auto md:w-120">
                        <h1 onClick={() => setSignUpClick(false)} className="flex justify-end mr-2 mt-2 hover:cursor-pointer">❌</h1>
                        <h1 className="select-none flex justify-center text-blue-900 font-sans font-semibold text-2xl pt-2">Sign Up</h1>                                            
                        <form onSubmit={(e) => {e.preventDefault();signUpWithFirebase(signUpName,signUpEmail,signUpPassword)}}>
                            <div className="flex flex-col">
                                <input value={signUpName} onChange={(e) => setSignUpName((e.target.value).toUpperCase())} required className="font-sans p-2 rounded-lg m-4 text-blue-900 border border-blue-700 h-10" type="text" placeholder="Name"/>
                                <input value={signUpEmail} onChange={(e) => {setSignUpEmail(e.target.value)}} required className="font-sans p-2 rounded-lg mx-4 text-blue-900 mb-4 border border-blue-700 h-10" type="email" placeholder="Email"/>
                                <input value={signUpPassword} onChange={(e) => {setSignUpPassword(e.target.value);handlePasswordCheck(e.target.value,signUpConfirmPassword)}} required className="font-sans p-2 rounded-lg mx-4 mb-4 text-blue-900 border border-blue-700 h-10" type="password" placeholder="Password"/>
                                <input value={signUpConfirmPassword} onChange={(e) => {setSignUpConfirmPassword(e.target.value);handlePasswordCheck(signUpPassword,e.target.value)}} required className="font-sans p-2 rounded-lg mx-4 text-blue-900 border border-blue-700 h-10" type="password" placeholder="Confirm Password"/>
                                <label className="font-sans mx-4 mt-2 text-sm text-red-500">{pwdError}</label>
                                <button type="submit" className={(signUpName === "" || signUpEmail === "" || signUpPassword === "" || signUpConfirmPassword === "") ? "font-sans rounded-lg m-4 border-2 text-xl border-blue-900 bg-blue-900 text-purple-100 h-10 hover:cursor-not-allowed" : "font-sans rounded-lg m-4 text-purple-100 text-xl bg-blue-900 text-xl h-10 hover:cursor-pointer"}>Sign Up</button>
                            </div>
                        </form>
                        <div className="flex flex-row justify-center">
                            <p className="select-none font-sans mx-4 mb-4 md:mx-4 p-1 text-blue-900 text-sm md:text-lg">Already part of Kanavu Creations?</p>
                            <button onClick={() => {setSignUpClick(false);setSignIn(true)}} className="font-sans rounded-lg mx-4 mb-4 text-sm md:text-lg font-semibold p-1 text-blue-900 border-2 border-blue-900 hover:bg-blue-900 hover:text-purple-100 hover:cursor-pointer transition duration-300 ease-in-out">Sign In</button>
                        </div>
                    </div>
                </div>
            }

            {
                invalidEmailPassword && 
                <div className="fixed inset-0 z-50 flex flex-col justify-center backdrop-blur-sm items-center">
                    <div className="select-none font-sans bg-gradient-to-br from-blue-100 via-purple-200 to-purple-100 rounded-xl shadow-xl p-5 border border-blue-700">
                    <p className="text-lg text-blue-900">Invalid Email or Password</p>
                    <div className="flex justify-center "><button onClick={() => {setInvalidEmailPassword(false);setSignIn(true)}} className="bg-blue-900 text-purple-100 w-10 rounded-xl mt-2 p-2 hover:cursor-pointer">OK</button></div>
                    </div>
                </div>
            }

            {
                profileClick && 
                <div className="fixed inset-0 z-50 flex flex-col justify-center backdrop-blur-sm items-center">
                    <div className="select-none font-sans bg-gradient-to-br from-blue-100 via-purple-200 to-purple-100 rounded-xl shadow-xl p-5 border border-blue-700">
                    <h1 onClick={() => setProfileClick(false)} className="flex justify-end hover:cursor-pointer">❌</h1>
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

            <br/>
        </>
    )
}