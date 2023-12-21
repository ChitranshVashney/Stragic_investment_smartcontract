"use client";
import Image from 'next/image'
import Modal from '@/components/Modal';
import { useState } from 'react';
import DcaCreation from '@/components/DcaCreation';
export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);



  return (
    <main className="flex flex-col items-center justify-between">
       
      {/* Your existing content */}
       <DcaCreation />
      {/* Button to open the modal */}
      {/* <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded-full mt-4">
        Open Modal
      </button> */}

      {/* Include the modal component */}
     
   
    </main>
  )
}
