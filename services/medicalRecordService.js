import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firestore";

export const getMedicalRecords = async (uid) => {
  try {
    const recordsRef = collection(db, "users", uid, "medicalRecords");
    const snapshot = await getDocs(recordsRef);

    const records = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return records;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};