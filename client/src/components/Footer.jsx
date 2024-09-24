import React from 'react'
import { HousePlus} from 'lucide-react'
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { FiFacebook } from "react-icons/fi";
import { FaRegCopyright } from "react-icons/fa";
export default function Footer() {
  return (
    <div className='px-4 md:px-16'>
        <hr className='my-2 w-full border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8'/>
        <div className="grid w-full justify-between sm:flex md:grid-cols-1  dark:bg-gray-900">
            <div className="left-footer font-semibold text-xl mt-4" >
                <div className="">
                    <a className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white" href="/">
                        <h1 className='flex  gap-2 font-montserrat'><HousePlus size={28} strokeWidth={2}/> StackTask.com</h1>
                    </a>
                    <div className="flex mt-6 gap-2 items-center text-2xl">
                        <a href=""><FaInstagram/></a>
                        <a href=""><FaXTwitter/></a>
                        <a href=""><FaDiscord/></a>
                        <a href=""><FiFacebook/></a>
                    </div>


                </div>

            </div>
            <div className="right-footer grid grid-cols-2 gap-8 mt-4 md:grid-cols-3 md:gap-6">
                <div className='text-sm  text-gray-500 dark:text-white'>
                    <h2 className="mb-6 uppercase font-semibold">
                        New Features
                    </h2>
                    <ul>
                        Security
                    </ul>
                    <ul>Cloud Sync</ul>
                    <ul>Local Storage</ul>
                    <ul>Task Status</ul>
                </div>
                <div className='text-sm  text-gray-500 dark:text-white'>
                    <h2 className="mb-6 uppercase font-semibold">
                        Pricing
                    </h2>
                    <ul>Flexible Data</ul>
                    <ul>High Volume Data</ul>
                    <ul>Enterprise</ul>
                </div>
                <div className='text-sm  text-gray-500 dark:text-white'>
                    <h2 className="mb-6 uppercase font-semibold">
                        Let's Talk
                    </h2>
                    <ul>+85 6587 9844 1259</ul>
                    <ul>contact@stacktask.com</ul>

                </div>

            </div>
        </div>
        <hr className='my-2 w-full border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8'/>
        <div className="w-full sm:flex sm:items-center  sm:justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400 sm:text-center flex items-center gap-2">
                <FaRegCopyright/> <a href="/">2024 stacktask.com</a>
            </div>
            <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center text-sm text-gray-500 dark:text-gray-400">
                <span>Privacy & Policy</span>
                <span>Terms & Conditions</span> 
            </div>
            

        </div>
    </div>
  )
}