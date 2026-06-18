"use client";

import { useAuth } from "../../hooks/useAuth";
import { getMedicalRecords } from "@/services/medicalRecordService";
import { getFriendUids } from "@/services/getSharedAccessUids";
import { useState, useEffect } from "react";


export default function ShowFriendMedicalRecords() {
    const { uid, isLoggedIn } = useAuth();
    const [friendsRecords, setFriendsRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!isLoggedIn || !uid) {
                setLoading(false);
                return;
            }

            try {
                const acceptedOwners = await getFriendUids(uid);

                const results = await Promise.all(
                    acceptedOwners.map(async (owner) => {
                        const records = await getMedicalRecords(owner.ownerUid);

                        return {
                            ownerName: owner.ownerName,
                            ownerUid: owner.ownerUid,
                            medicines: records.map((record) => ({
                                medicineName: record.medicineName,
                                doseTimes: record.doseTimes || [],
                            })),
                        };
                    })
                );

                setFriendsRecords(results);
            } catch (error) {
                console.error("Error fetching friend records:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [uid, isLoggedIn]);

    if (loading) {
        return <div>Loading...</div>;
    }



    return (
        <div>
            <h2>Shared Medicines</h2>

            {friendsRecords.length === 0 ? (
                <p>No shared medicines found.</p>
            ) : (
                friendsRecords.map((friend) => (
                    <div
                        key={friend.ownerUid}
                        className="border rounded p-4 mb-4"
                    >
                        <h3 className="font-bold text-lg mb-2">
                            {friend.ownerName}
                        </h3>

                        {friend.medicines.length === 0 ? (
                            <p>No medicines available.</p>
                        ) : (
                            friend.medicines.map((medicine, index) => (
                                <div
                                    key={index}
                                    className="border-b py-2"
                                >
                                    <p>
                                        <strong>Medicine:</strong>{" "}
                                        {medicine.medicineName}
                                    </p>

                                    <p>
                                        <strong>Time:</strong>{" "}
                                        {medicine.doseTimes.join(", ")}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                ))
            )}
        </div>
    );
}