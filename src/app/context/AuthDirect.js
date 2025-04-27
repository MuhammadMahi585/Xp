"use client"
import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

export default function AuthDirect() {
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Safeguard against undefined auth
        if (!auth || auth.isLoading) {
            router.push("/componets/Loading/screen")
        }
        if (!auth.isAuthenticated) {
            router.push('/components/authentication/login');
        } else {
            cconsole.log(auth.role)
            const redirectPath = auth.role === "admin" 
                ? '/components/dashboard/admin' 
                : '/components/dashboard/customer';
              
            router.push(redirectPath);
            window.history.replaceState(null, '', redirectPath);
        }
    }, [auth, router]);

    return null;
}