import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";


export async function submitUserLogin(formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        throw new Error("Enter email and password both!");
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
    }
    catch (error) {
        throw new Error(error.message);
    }
}

export async function submitUserSignUp(formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');

    // console.log(`Name : ${name}, Email : ${email}, password : ${password}, confirm password : ${confirmPassword}`);

    if (!name || !email || !password || !confirmPassword) {
        throw new Error("Enter all details!");
    }

    if (password !== confirmPassword) {
        throw new Error("Passwords do not match!");
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(
            userCredential.user,
            {
                displayName: name
            }
        );

        await sendEmailVerification(userCredential.user);
    }
    catch (error) {
        if (error.code === "auth/email-already-in-use") {
            // return {
            //     success: false,
            //     message: "This email is already registered. Please login."
            // };
            throw new Error("This email is already registered. Please login.");
        }
    }
}


export async function loginGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);

        // if (!result || !result.user) {
        //     throw new Error("User data not available");
        // }

        const user = result.user;
        console.log("Google user:", user);

    }
    catch (error) {
        throw new Error(error.message);
    }
}

export async function forgotPassword(email) {
    if (!email) {
        throw new Error("Please enter your email first");
    }

    try {
        await sendPasswordResetEmail(auth, email);
        console.log("Sending reset email to:", email);
    }
    catch (error) {
        throw new Error("❌ " + error.message);
    }
}


export async function logOut(params) {
    try{
        await signOut(auth);
    }
    catch(error){
        throw new Error(error.message)
    }
}