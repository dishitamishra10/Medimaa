import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useAuth() {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser ?? null);
        })

        return () => unsubscribe();
    }, [])

    return {
        user,                           // full Firebase user object
        uid: user?.uid ?? null,         // just the ID
        isLoggedIn: !!user,             // true / false
        isLoading: user === undefined,  // still checking auth state
    };
}