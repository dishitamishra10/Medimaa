"use client";

import AddMedicationForm from "@/components/medications/AddMedicationForm";
import { useAuth } from "@/hooks/useAuth";
import { saveMedicationForm } from "@/actions/medication-actions/actions";
import { useRouter } from "next/navigation";


export default function MedicationPage(){
    const { user, uid, isLoading, isLoggedIn } = useAuth();
    const router = useRouter();

    const handleSave = async (medicationData) => {
        if(!isLoggedIn){
            router.push("/signin");
            return;
        }
        
        if(isLoading) return;

        if(!uid){
            router.push("/signin");
            return;
        }

        const email = user?.email || "";

        await saveMedicationForm(uid, medicationData, email);

        router.push("/dashboard");
    }
  
    const handleCancel = () => {
        router.back();
    };

    return <AddMedicationForm onSave={handleSave} onCancel={handleCancel}/>
}