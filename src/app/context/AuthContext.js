"use client"
import { createContext, useState, useEffect, useContext } from "react"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        role: null,
        isLoading: true,
        error: null
    })

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/authentication/admin', {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                
                if (!res.ok) {
                   
                    const errorData = await res.json().catch(() => ({}))
                    throw new Error(
                        errorData.message || 
                        `Auth check failed with status ${res.status}`
                    )
                }

                const data = await res.json()
                
                setAuth({
                    isAuthenticated: data.isAuthenticated,
                    role: data.role,
                    isLoading: false,
                    error: null
                })
                console.log(auth)
            } catch (error) {
                console.error('Authentication check error:', error)
                setAuth({
                    isAuthenticated: false,
                    role: null,
                    isLoading: false,
                    error: error.message
                })
            }
        }
        
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}