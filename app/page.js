import NavBar from './NavBar'
import Footer from './Footer'
import { FaSearch } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import Image from 'next/image';

export default function Home(){
  return(
    <>
      <div className="relative bg-gradient-to-b from-purple-100 via-purple-100 to-blue-100 py-1 min-h-screen">
        <NavBar/>
        <div className="sticky top-18 z-10 md:top-20 flex flex-row justify-center items-center mt-0">
            <input className="font-sans p-2 rounded-lg w-67 md:w-180 lg:w-240 xl:w-340 border-t-3 border-l-3 border-b-3 bg-purple-100 text-blue-900 font-semibold border-blue-700" placeholder="What are you looking for?" type="search"></input>
            <FaSearch className="hover:cursor-pointer hover:scale-105 border-3 border-blue-700 rounded-lg bg-purple-100 p-1 text-blue-900 transition duration-300 ease-in-out" size={35}/>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center my-5 gap-y-1 md:gap-x-8 lg:gap-x-4 xl:gap-x-8">

            <div className="bg-gradient-to-br from-blue-100 via-fuchsia-100 to-fuchsia-200 border-t-4 border-l-2 border-r-2 border-b-2 border-blue-700 w-75 md:w-80 rounded-xl shadow-xl mb-5 transition duration-300 ease-in-out">
              <div className="flex flex-col items-center">
                <Image src="/products/1.1.jpg" className="rounded-xl md:mt-2" width={300} height={10} alt='logo'></Image>
                <div className="flex flex-col items-center w-75 md:w-80 p-2 md:p-4">
                  <h1 className="select-none font-sans font-semibold text-lg lg:text-xl mb-4 text-blue-900">Product Name</h1>
                  <h1 className="select-none font-sans font-semibold text-center lg:text-lg mb-2 text-blue-900">lorem ipsum sbah bdb kbdfk jkjfjk kjsnj kjj ksj kjsfkjbbf kbfjk</h1>
                  <div className="flex flex-row items-end gap-x-2">
                    <div className="flex flex-row items-center">
                      <FaIndianRupeeSign className="font-sans text-blue-900 font-bold md:text-xl lg:text-3xl"/>
                      <h1 className="select-none font-sans text-blue-900 font-bold md:text-xl lg:text-3xl">150.00</h1>
                    </div>
                    <h1 className="select-none font-sans text-blue-900 line-through lg:text-xl">Rs. 250.00</h1>
                  </div>
                </div>
                <button className="select-none font-sans font-semibold bg-blue-800 rounded-xl hover:cursor-pointer hover:bg-blue-900 lg:text-lg text-purple-200 mb-4 p-2 transition duration-300 ease-in-out">Add to Cart</button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 via-fuchsia-100 to-fuchsia-200 border-t-4 border-l-2 border-r-2 border-b-2 border-blue-700 w-75 md:w-80 rounded-xl shadow-xl mb-5 transition duration-300 ease-in-out">
              <div className="flex flex-col items-center">
                <Image src="/products/1.2.jpg" className="rounded-xl md:mt-2" width={300} height={10} alt='logo'></Image>
                <div className="flex flex-col items-center w-75 md:w-80 p-2 md:p-4">
                  <h1 className="font-sans font-semibold text-lg lg:text-xl mb-4 text-blue-900">Product Name</h1>
                  <h1 className="font-sans font-semibold text-center lg:text-lg mb-2 text-blue-900">lorem ipsum sbah bdb kbdfk jkjfjk kjsnj kjj ksj kjsfkjbbf kbfjk</h1>
                  <div className="flex flex-row items-end gap-x-2">
                    <div className="flex flex-row items-center">
                      <FaIndianRupeeSign className="font-sans text-blue-900 font-bold md:text-xl lg:text-3xl"/>
                      <h1 className="font-sans text-blue-900 font-bold md:text-xl lg:text-3xl">150.00</h1>
                    </div>
                    <h1 className="font-sans text-blue-900 line-through lg:text-xl">Rs. 250.00</h1>
                  </div>
                </div>
                <button className="font-sans font-semibold bg-blue-800 rounded-xl hover:cursor-pointer hover:bg-blue-900 lg:text-lg text-purple-200 mb-4 p-2 transition duration-300 ease-in-out">Add to Cart</button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 via-fuchsia-100 to-fuchsia-200 border-t-4 border-l-2 border-r-2 border-b-2 border-blue-700 w-75 md:w-80 rounded-xl shadow-xl mb-5 transition duration-300 ease-in-out">
              <div className="flex flex-col items-center">
                <Image src="/products/1.3.jpg" className="rounded-xl md:mt-2" width={300} height={10} alt='logo'></Image>
                <div className="flex flex-col items-center w-75 md:w-80 p-2 md:p-4">
                  <h1 className="font-sans font-semibold text-lg lg:text-xl mb-4 text-blue-900">Product Name</h1>
                  <h1 className="font-sans font-semibold text-center lg:text-lg mb-2 text-blue-900">lorem ipsum sbah bdb kbdfk jkjfjk kjsnj kjj ksj kjsfkjbbf kbfjk</h1>
                  <div className="flex flex-row items-end gap-x-2">
                    <div className="flex flex-row items-center">
                      <FaIndianRupeeSign className="font-sans text-blue-900 font-bold md:text-xl lg:text-3xl"/>
                      <h1 className="font-sans text-blue-900 font-bold md:text-xl lg:text-3xl">150.00</h1>
                    </div>
                    <h1 className="font-sans text-blue-900 line-through lg:text-xl">Rs. 250.00</h1>
                  </div>
                </div>
                <button className="font-sans font-semibold bg-blue-800 rounded-xl hover:cursor-pointer hover:bg-blue-900 lg:text-lg text-purple-200 mb-4 p-2 transition duration-300 ease-in-out">Add to Cart</button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 via-fuchsia-100 to-fuchsia-200 border-t-4 border-l-2 border-r-2 border-b-2 border-blue-700 w-75 md:w-80 rounded-xl shadow-xl mb-5 transition duration-300 ease-in-out">
              <div className="flex flex-col items-center">
                <Image src="/products/1.4.jpg" className="rounded-xl md:mt-2" width={300} height={10} alt='logo'></Image>
                <div className="flex flex-col items-center w-75 md:w-80 p-2 md:p-4">
                  <h1 className="font-sans font-semibold text-lg lg:text-xl mb-4 text-blue-900">Product Name</h1>
                  <h1 className="font-sans font-semibold text-center lg:text-lg mb-2 text-blue-900">lorem ipsum sbah bdb kbdfk jkjfjk kjsnj kjj ksj kjsfkjbbf kbfjk</h1>
                  <div className="flex flex-row items-end gap-x-2">
                    <div className="flex flex-row items-center">
                      <FaIndianRupeeSign className="font-sans text-blue-900 font-bold md:text-xl lg:text-3xl"/>
                      <h1 className="font-sans text-blue-900 font-bold md:text-xl lg:text-3xl">150.00</h1>
                    </div>
                    <h1 className="font-sans text-blue-900 line-through lg:text-xl">Rs. 250.00</h1>
                  </div>
                </div>
                <button className="font-sans font-semibold bg-blue-800 rounded-xl hover:cursor-pointer hover:bg-blue-900 lg:text-lg text-purple-200 mb-4 p-2 transition duration-300 ease-in-out">Add to Cart</button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 via-fuchsia-100 to-fuchsia-200 border-t-4 border-l-2 border-r-2 border-b-2 border-blue-700 w-75 md:w-80 rounded-xl shadow-xl mb-5 transition duration-300 ease-in-out">
              <div className="flex flex-col items-center">
                <Image src="/products/1.5.jpg" className="rounded-xl md:mt-2" width={300} height={10} alt='logo'></Image>
                <div className="flex flex-col items-center w-75 md:w-80 p-2 md:p-4">
                  <h1 className="font-sans font-semibold text-lg lg:text-xl mb-4 text-blue-900">Product Name</h1>
                  <h1 className="font-sans font-semibold text-center lg:text-lg mb-2 text-blue-900">lorem ipsum sbah bdb kbdfk jkjfjk kjsnj kjj ksj kjsfkjbbf kbfjk</h1>
                  <div className="flex flex-row items-end gap-x-2">
                    <div className="flex flex-row items-center">
                      <FaIndianRupeeSign className="font-sans text-blue-900 font-bold md:text-xl lg:text-3xl"/>
                      <h1 className="font-sans text-blue-900 font-bold md:text-xl lg:text-3xl">150.00</h1>
                    </div>
                    <h1 className="font-sans text-blue-900 line-through lg:text-xl">Rs. 250.00</h1>
                  </div>
                </div>
                <button className="font-sans font-semibold bg-blue-800 rounded-xl hover:cursor-pointer hover:bg-blue-900 lg:text-lg text-purple-200 mb-4 p-2 transition duration-300 ease-in-out">Add to Cart</button>
              </div>
            </div>
            
        </div>
        <Footer/>
      </div>
    </>
  )
}