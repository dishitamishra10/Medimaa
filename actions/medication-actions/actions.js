import { db } from "@/lib/firestore";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";


export async function saveMedicationForm(uid, medicationData, email) {
    if(!uid){
        throw new Error("User not logged in");
    }

    try{
        await addDoc(collection(db, "users", uid, "medicalRecords"), {
            ...medicationData,

            userId: uid,
            email: email,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    }
    catch(error){
        throw new Error(error.message);
    }
}