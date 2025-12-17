import { FaWhatsapp } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { GrYoutube } from "react-icons/gr";
import { IoMdMail } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";

export default function Footer(){
    const subject = "Product Inquiry";
    const body = "Hi, I am interested in your products.";
    return (
        <>
            <div className="relative bg-gradient-to-b from-pink-100 via-pink-200 to-blue-100 py-1">
                <div className="flex flex-col md:flex-row gap-y-4 mb-2">
                    <div className="flex flex-col items-center gap-y-4 justify-center flex-1">
                        <div className="flex flex-row items-center gap-x-4">
                            <Image src={"/logo.png"} width={100} height={100} alt="logo"></Image>
                            <div className="flex flex-col">
                                <h1 className="select-none font-sans font-bold text-2xl lg:text-3xl text-pink-500">K A N A V U</h1>
                                <h1 className="select-none font-sans font-bold text-2xl lg:text-3xl text-blue-900">C R E A T I O N S</h1>
                            </div>
                        </div>
                        <div className="font-sans font-semibold text-blue-900 lg:text-lg">
                            Dream • Create • Grow
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="font-sans font-semibold text-blue-900 lg:text-lg">
                                Born small !
                            </div>
                            <div className="font-sans font-semibold text-blue-900 lg:text-lg">
                                Crafted with dreams !!
                            </div>
                            <div className="font-sans font-semibold text-blue-900 lg:text-lg">
                                Growing with hope !!!
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-x-10 md:gap-x-15 lg:gap-x-18">
                            <a target="_blank" rel="noopener noreferrer" href={"https://www.instagram.com/kanavu_creations?igsh=cTFzM2tvcnA3a3l6"}><FaInstagram className="my-4 text-blue-900 font-bold text-2xl lg:text-3xl hover:scale-110 hover:cursor-pointer transition duration-300 ease-in-out"/></a>
                            <a target="_blank" rel="noopener noreferrer" href={"https://youtube.com/@kanavucreations?si=M-w4Ppwnn2wFYd8I"}><GrYoutube className="my-4 text-blue-900 font-bold text-2xl lg:text-3xl hover:scale-110 hover:cursor-pointer transition duration-300 ease-in-out"/></a>
                            <a target="_blank" rel="noopener noreferrer" href={"https://wa.me/919092886206"}><FaWhatsapp className="my-4 text-blue-900 font-bold text-2xl lg:text-3xl hover:scale-110 hover:cursor-pointer transition duration-300 ease-in-out"/></a>
                            <a target="_blank" href={`mailto:Kanavcreations@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}><IoMdMail className="my-4 text-blue-900 font-bold text-2xl lg:text-3xl hover:scale-110 hover:cursor-pointer transition duration-300 ease-in-out"/></a>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-5 md:gap-y-10 justify-center flex-1">
                        <div className="flex flex-col font-sans md:gap-y-2">
                            <h2 className="mx-auto selct-none font-bold text-lg text-blue-900">Quick Links</h2>
                            <h1 className="mx-auto text-blue-900 hover:cursor-pointer">Home</h1>
                            <h1 className="mx-auto text-blue-900 hover:cursor-pointer">Products</h1>
                            <h1 className="mx-auto text-blue-900 hover:cursor-pointer">About Us</h1>
                        </div>

                        <div className="flex flex-col font-sans md:gap-y-2">
                            <h2 className="mx-auto select-none font-bold text-lg text-blue-900">Contact Us</h2>
                            <div className="flex justify-center items-center gap-x-2">
                                <div><IoMdMail className="mx-auto text-blue-900 font-bold"/></div>
                                <div><a className="mx-auto text-blue-900 hover:underline" target="_blank" href={`mailto:Kanavcreations@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>Kanavcreations@gmail.com</a></div>
                            </div>
                            <div className="flex justify-center items-center gap-x-2">
                                <div><FaWhatsapp className="mx-auto text-blue-900 font-bold"/></div>
                                <div><a className="mx-auto text-blue-900 hover:underline" target="_blank" href={"https://wa.me/919092886206"}>+91 9092886206</a></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="select-none flex justify-center items-center mt-2 text-sm font-sans text-blue-900 font-semibold">&copy; {new Date().getFullYear()}  Kanavu Creations. All Rights Reserved.</div>
            </div>
        </>
    )
}