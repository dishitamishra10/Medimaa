import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firestore";

export const getFriendUids = async (uid) => {

    try{
        const receivedAccessRef = collection(db, "users", uid, "receivedAccess");
        const snapshot = await getDocs(receivedAccessRef);

        const records = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        const acceptedOwners = records.filter((record) => record.status === "accepted")
        .map((record) => ({
            ownerName: record.ownerName,
            ownerUid: record.ownerUid,
        }))

        return acceptedOwners;
    } 
    catch (error) {
        console.error("Error fetching records:", error);
        throw error;
    }
}