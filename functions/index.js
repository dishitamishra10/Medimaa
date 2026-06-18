const { setGlobalOptions } = require("firebase-functions/v2");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { beforeUserCreated } = require("firebase-functions/v2/identity");
const crypto = require("crypto");
const admin = require("firebase-admin");
const { Resend } = require("resend");


setGlobalOptions({ 
    region: "asia-south2",
    maxInstances: 10 
});

admin.initializeApp();
const db = admin.firestore();



function getISTDateAndMinutes() {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(now).map((p) => [p.type, p.value])
  );

  const todayString = `${parts.year}-${parts.month}-${parts.day}`;
  const currentMinutes = Number(parts.hour) * 60 + Number(parts.minute);

  return { todayString, currentMinutes };
}



function buildTargetMinutes(currentMinutes, windowSize = 5) {
  const targetMinutes = [];

  for (let i = currentMinutes - windowSize + 1; i <= currentMinutes; i++) {
    targetMinutes.push((i + 1440) % 1440);
  }

  return targetMinutes;
}



// ==========================================
// FUNCTION : Medicine reminder function
// ==========================================
exports.checkMedicineReminders = onSchedule(
  {
    schedule: "every 5 minutes",
    timeZone: "Asia/Kolkata",
    region: "asia-south1"
  },
  async () => {
    console.log("Medicine reminder function started");

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY missing");
      return;
    }

    const resend = new Resend(apiKey);

    const { todayString, currentMinutes } = getISTDateAndMinutes();
    const targetMinutesRange = buildTargetMinutes(currentMinutes, 5);

    console.log("Today:", todayString);
    console.log("Current minutes:", currentMinutes);
    console.log("Target minutes:", targetMinutesRange);

    try {
      const snapshot = await db
        .collectionGroup("medicalRecords")
        .where("reminder", "==", true)
        .where("doseTimesInMinutes", "array-contains-any", targetMinutesRange)
        .where("startDate", "<=", todayString)
        .where("endDate", ">=", todayString)
        .get();

      console.log("Matching records found:", snapshot.size);

      if (snapshot.empty) {
        console.log("No reminders to send");
        return;
      }

      const emailPromises = snapshot.docs.map(async (doc) => {
        const data = doc.data();

        if (!data.email) {
          console.log("No email found for doc:", doc.id);
          return;
        }

        const matchedDoseMinute = data.doseTimesInMinutes?.find((minute) =>
          targetMinutesRange.includes(minute)
        );

        if (matchedDoseMinute === undefined) {
          return;
        }

        const reminderKey = `${todayString}-${matchedDoseMinute}`;

        if (data.lastReminderKey === reminderKey) {
          console.log("Already sent for this dose:", doc.id);
          return;
        }

        try {
          await resend.emails.send({
            from: "Medimaa Team <noreply@medimaa.online>",
            to: data.email,
            subject: `💊 Medicine Reminder: ${data.medicineName || "Your Medicine"}`,

            text: `
            Medicine Reminder

            Hi ${data.patientName || "there"},

            This is a friendly reminder to take your scheduled medicine.

            Medicine: ${data.medicineName || "Not provided"}
            Dosage: ${data.dosage || "Not provided"}
            Frequency: ${data.frequency || "Not provided"}

            ${data.notes ? `Notes: ${data.notes}` : ""}

            Please take your medicine as prescribed by your healthcare provider.

            Stay healthy!

            Medimaa Team
            https://medimaa.online
            `,

            html: `
          <div style="
            font-family: Arial, Helvetica, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            color: #333333;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
          ">
            <div style="
              background-color: #16a34a;
              color: white;
              padding: 20px;
              text-align: center;
            ">
              <h1 style="margin: 0; font-size: 24px;">
                💊 Medicine Reminder
              </h1>
            </div>

            <div style="padding: 24px;">

              <p style="margin-top: 0;">
                Hello <strong>${data.patientName || "there"}</strong>,
              </p>

              <p>
              This is a friendly reminder that it's time to take your medicine.
              </p>

              <div style="
                background-color: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 16px;
                margin: 20px 0;
              ">

                <p style="margin: 8px 0;">
                  <strong>Medicine:</strong>
                  ${data.medicineName || "Not provided"}
                </p>

                <p style="margin: 8px 0;">
                  <strong>Dosage:</strong>
                  ${data.dosage || "Not provided"}
                </p>

                <p style="margin: 8px 0;">
                  <strong>Frequency:</strong>
                  ${data.frequency || "Not provided"}
                </p>

                ${data.notes
                          ? `
                <p style="margin: 8px 0;">
                  <strong>Notes:</strong>
                  ${data.notes}
                </p>
                `
                          : ""
                        }

              </div>

              <p>
                Please take your medication as prescribed by your healthcare provider.
              </p>

              <p>
                Wishing you good health and a speedy recovery.
              </p>

            </div>

            <div style="
              background-color: #f9fafb;
              padding: 16px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            ">
              <p style="margin: 0;">
                This is an automated reminder from <strong>Medimaa</strong>.
              </p>

              <p style="margin: 8px 0 0 0;">
                Please do not reply to this email.
              </p>

              <p style="margin: 8px 0 0 0;">
                © ${new Date().getFullYear()} Medimaa. All rights reserved.
              </p>
            </div>

          </div>
          `,
          });

          await doc.ref.update({
            lastReminderSentAt: admin.firestore.FieldValue.serverTimestamp(),
            lastReminderKey: reminderKey,
          });

          console.log("Email sent successfully to:", data.email);
        } catch (error) {
          console.error("Email failed for doc:", doc.id, error);
        }
      });

      await Promise.all(emailPromises);
    } catch (error) {
      console.error("Reminder function failed:", error);
    }

    console.log("Medicine reminder function finished");
  }
);





// ==========================================
// FUNCTION : Send Friend Invite
// ==========================================

exports.sendFriendInvite = onCall(async (request) => {
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError("unauthenticated", "You must be logged in");
  }

  const { friendEmail } = request.data;

  if (!friendEmail) {
    throw new HttpsError("invalid-argument", "Friend email is required");
  }

  // Get current user's data
  const userDoc = await db.collection("users").doc(uid).get();

  if (!userDoc.exists) {
    throw new HttpsError("not-found", "User not found");
  }

  const userData = userDoc.data();
  const senderName = userData.displayName;

  const token = crypto.randomBytes(32).toString("hex");

  const inviteRef = db
    .collection("users")
    .doc(uid)
    .collection("invites")
    .doc();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1);

  await inviteRef.set({
    ownerUid: uid,
    friendEmail: friendEmail.toLowerCase(),
    token,
    status: "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt,
  });

  const acceptLink = `http://localhost:3000/invite/accept?token=${token}`;

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Medimaa Team <noreply@medimaa.online>",
    to: friendEmail,
    subject: `Medical Record Access Request from ${senderName}`,

    text: `
    Medical Record Access Request

    ${senderName} has requested to share selected medical records with you through Medimaa.

    Review the request:
    ${acceptLink}

    This link will expire in 24 hours.

    If you were not expecting this request, you can safely ignore this email.

    Medimaa Team
    https://medimaa.online
    `,

    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">

      <h2 style="color: #2563eb; margin-bottom: 20px;">
        Medical Record Access Request
      </h2>

      <p>Hello,</p>

      <p>
        <strong>${senderName}</strong> has requested to share selected medical records with you
        through
        <strong>Medimaa</strong>.
      </p>

      <p>
        To review and accept this request, click the button below:
      </p>

      <div style="margin: 30px 0;">
        <a
        href="${acceptLink}"
        style="
          background-color: #2563eb;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          display: inline-block;
        "
      >
        Review Access Request
      </a>
    </div>

    <p>
      <strong>Security Notice:</strong>
      This invitation link will expire in
      <strong>24 hours</strong>.
    </p>

    <p>
      If you were not expecting this request, you can safely ignore this email.
      No action will be taken unless you approve the request.
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

    <p style="font-size: 12px; color: #666;">
      This is an automated message from <strong>Medimaa</strong>.
      Please do not reply to this email.
    </p>

    <p style="font-size: 12px; color: #666;">
      © ${new Date().getFullYear()} Medimaa. All rights reserved.
    </p>

  </div>
  `,
  });



  return {
    success: true,
    message: "Invite sent successfully",
  };
});



// ==========================================
// FUNCTION : Accept Friend Invite
// ==========================================

exports.acceptFriendInvite = onCall(async (request) => {
  // 1. Authentication Check
  const friendUid = request.auth?.uid;
  if (!friendUid) {
    throw new HttpsError("unauthenticated", "Please login first");
  }

  // 2. Input Validation
  const { token } = request.data;
  if (!token) {
    throw new HttpsError("invalid-argument", "Missing invitation token");
  }

  // 3. Find the invitation record via global collectionGroup scan
  const invitesSnap = await db
    .collectionGroup("invites")
    .where("token", "==", token)
    .limit(1)
    .get();

  if (invitesSnap.empty) {
    throw new HttpsError("not-found", "Invite not found or invalid");
  }

  const inviteDocRef = invitesSnap.docs[0].ref;

  try {
    // Execute all reads and writes inside an atomic transaction to prevent race conditions
    const result = await db.runTransaction(async (transaction) => {
      // Get fresh data inside the transaction
      const inviteDoc = await transaction.get(inviteDocRef);
      const invite = inviteDoc.data();
      const ownerUid = invite.ownerUid;

      // Business Logic Checks
      if (invite.status !== "pending") {
        throw new HttpsError("failed-precondition", "Invite already used");
      }

      if (invite.expiresAt.toDate() < new Date()) {
        throw new HttpsError("deadline-exceeded", "Invite expired");
      }

      if (friendUid === ownerUid) {
        throw new HttpsError("invalid-argument", "You cannot accept your own invitation.");
      }

      const userEmail = request.auth?.token?.email?.toLowerCase();
      if (!userEmail || userEmail !== invite.friendEmail?.toLowerCase()) {
        throw new HttpsError("permission-denied", "This invitation was sent to a different email address.");
      }

      // Fetch user profile info inside the transaction
      const friendDocRef = db.collection("users").doc(friendUid);
      const ownerDocRef = db.collection("users").doc(ownerUid);

      const [friendDoc, ownerDoc] = await Promise.all([
        transaction.get(friendDocRef),
        transaction.get(ownerDocRef)
      ]);

      const friendData = friendDoc.exists ? friendDoc.data() : {};
      const ownerData = ownerDoc.exists ? ownerDoc.data() : {};

      // Reference definitions for writes
      const ownerSideRef = db
        .collection("users")
        .doc(ownerUid)
        .collection("sharedUsers")
        .doc(friendUid);

      const friendSideRef = db
        .collection("users")
        .doc(friendUid)
        .collection("receivedAccess")
        .doc(ownerUid);

      // Perform atomic writes
      transaction.update(inviteDocRef, {
        status: "accepted",
        acceptedAt: admin.firestore.FieldValue.serverTimestamp(),
        friendUid,
      });

      transaction.set(ownerSideRef, {
        friendUid,
        friendEmail: invite.friendEmail,
        friendName: friendData.displayName || "",
        status: "accepted",
        accessType: "specific",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      transaction.set(friendSideRef, {
        ownerUid,
        ownerName: ownerData.name || ownerData.displayName || "",
        ownerEmail: ownerData.email || "",
        status: "accepted",
        accessType: "specific",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        message: "Invite accepted successfully",
      };
    });

    return result;

  } catch (error) {
    // If it's already an HttpsError we threw purposefully, pass it along
    if (error instanceof HttpsError) throw error;

    console.error("Error executing atomic acceptance transaction:", error);
    throw new HttpsError("internal", "An internal error occurred while processing acceptance.");
  }
});



// ==========================================
// FUNCTION : Create user profile
// ==========================================

exports.createUserProfile = beforeUserCreated(async (event) => {
  const user = event.data;
  await db.collection("users").doc(user.uid).set({
    displayName: user.displayName || "",
    email: user.email || "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});