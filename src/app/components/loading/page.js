'use client'

import 'primeicons/primeicons.css';
        
export default function Loading(){
    return(
        <div className="flex justify-center items-center h-screen bg-gray-700">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
      </div>
    )
}