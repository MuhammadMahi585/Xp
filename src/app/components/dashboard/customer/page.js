"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import CustomerLayout from './layout';


const Home = () => {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuthenticated) {
     if(auth.role==="admin"){
        router.push("/components/dashboard/admin")
     }
     else if(auth.role==="customer"){
      router.push("/components/dashboard/customer")
     }
    }
  }, [auth, router]);


  return (
     <>
     <h1>Hi</h1></>
    
  );
};

export default Home;
