"use client"
import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

export default function AuthDirect() {
    const auth =  useAuth();
    const router = useRouter();

    useEffect(() => {      
        if (!auth || auth.isLoading) {
            router.push("/components/loading")
        }
        else if (!auth.isAuthenticated) {
            router.replace('/components/customerComponents/products');
        } 
        else {
            const redirectPath = auth.role === "admin" 
                ? '/components/dashboard/admin' 
                : '/components/dashboard/customer';
              
            router.replace(redirectPath);
            window.history.replaceState(null, '', redirectPath);
        }
    }, [auth, router]);

    return null;
}