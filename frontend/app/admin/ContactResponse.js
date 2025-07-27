'use client'
import React from 'react'
import { useState,useEffect } from 'react'

const ContactResponse = () => {
    const [contact, setcontact] = useState([])

    useEffect(() => {
      const getContacts=async()=>{
        try {
            const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact_response`);
            const data=await res.json();
            setcontact(data);
        } catch (error) {
            console.error("Error fetching Contacts:", error);
        }

      }
      getContacts();
    }, [])
    
  return (
    <div>
       <header className='text-black relative left-[40vw] text-2xl font-bold dark:text-gray-100'>Contact Responses</header>
        <section className='h-auto bg-white flex flex-wrap justify-center dark:bg-gray-800'>
           
            {contact.map((post,index)=>{
                return(
                <div key={index} className='border border-gray-400 rounded-2xl shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 h-[50vh] m-6 w-2xs text-black dark:text-gray-200 p-2'>
                <p>Name : {post.name}</p>
                <p>Email : {post.email}</p>
                <p className='break-words overflow-auto max-w-full'>Subject : {post.subject}</p>
                <p className="break-words overflow-y-scroll max-h-40 custom-scrollbar">Message : {post.message}</p>
            </div>
                );
            })}
            
        </section>
    </div>
  )
}

export default ContactResponse