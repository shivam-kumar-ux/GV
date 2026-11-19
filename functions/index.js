const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Approve a staff admin signup request.
 * Callable, requires caller to have 'super_admin' claim.
 */
exports.approveStaffAdmin = functions.https.onCall(async (data, context) => {
  // Check auth and role
  if (!context.auth || context.auth.token.role !== "super_admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only Super Admin can approve staff accounts."
    );
  }

  const uid = data.uid;
  if (!uid) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a valid 'uid' payload."
    );
  }

  try {
    // 1. Fetch pending registration
    const pendingRef = db.collection("pendingAdmins").doc(uid);
    const pendingDoc = await pendingRef.get();

    if (!pendingDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Pending admin request not found."
      );
    }

    const docData = pendingDoc.data();

    // 2. Set custom claims: { role: 'staff_admin', approved: true }
    await admin.auth().setCustomUserClaims(uid, {
      role: "staff_admin",
      approved: true
    });

    const now = admin.firestore.FieldValue.serverTimestamp();

    // 3. Update pendingAdmins status
    await pendingRef.update({
      status: "approved",
      approvedAt: now,
      approvedBy: context.auth.uid
    });

    // 4. Copy/move to approvedAdmins collection
    const approvedRef = db.collection("approvedAdmins").doc(uid);
    await approvedRef.set({
      uid: docData.uid,
      name: docData.name,
      email: docData.email,
      staffId: docData.staffId,
      status: "approved",
      requestedAt: docData.requestedAt || now,
      approvedAt: now,
      approvedBy: context.auth.uid
    });

    return { success: true };
  } catch (error) {
    console.error("Error in approveStaffAdmin:", error);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "An error occurred during approval."
    );
  }
});

/**
 * Reject a staff admin signup request.
 * Callable, requires caller to have 'super_admin' claim.
 */
exports.rejectStaffAdmin = functions.https.onCall(async (data, context) => {
  // Check auth and role
  if (!context.auth || context.auth.token.role !== "super_admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only Super Admin can reject staff accounts."
    );
  }

  const uid = data.uid;
  if (!uid) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a valid 'uid' payload."
    );
  }

  try {
    // 1. Fetch pending registration
    const pendingRef = db.collection("pendingAdmins").doc(uid);
    const pendingDoc = await pendingRef.get();

    if (!pendingDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Pending admin request not found."
      );
    }

    // 2. Set custom claims to block access
    await admin.auth().setCustomUserClaims(uid, {
      role: "staff_admin",
      approved: false
    });

    // 3. Update pendingAdmins status to rejected
    await pendingRef.update({
      status: "rejected",
      rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
      rejectedBy: context.auth.uid
    });

    // 4. Optionally delete their Firebase Auth account to prevent clutter
    try {
      await admin.auth().deleteUser(uid);
    } catch (authError) {
      console.warn(`Could not delete user auth account for UID: ${uid}`, authError);
    }

    return { success: true };
  } catch (error) {
    console.error("Error in rejectStaffAdmin:", error);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "An error occurred during rejection."
    );
  }
});

/**
 * Revoke staff admin access.
 * Callable, requires caller to have 'super_admin' claim.
 */
exports.revokeStaffAdmin = functions.https.onCall(async (data, context) => {
  // Check auth and role
  if (!context.auth || context.auth.token.role !== "super_admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only Super Admin can revoke staff accounts."
    );
  }

  const uid = data.uid;
  if (!uid) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a valid 'uid' payload."
    );
  }

  try {
    // 1. Set custom claims to block access
    await admin.auth().setCustomUserClaims(uid, {
      role: "staff_admin",
      approved: false
    });

    // 2. Remove from approvedAdmins
    await db.collection("approvedAdmins").doc(uid).delete();

    // 3. Update pendingAdmins status to rejected/revoked
    const pendingRef = db.collection("pendingAdmins").doc(uid);
    const pendingDoc = await pendingRef.get();
    if (pendingDoc.exists) {
      await pendingRef.update({
        status: "rejected",
        revokedAt: admin.firestore.FieldValue.serverTimestamp(),
        revokedBy: context.auth.uid
      });
    }

    // 4. Delete Firebase Auth account to completely revoke access
    try {
      await admin.auth().deleteUser(uid);
    } catch (authError) {
      console.warn(`Could not delete user auth account for UID: ${uid}`, authError);
    }

    return { success: true };
  } catch (error) {
    console.error("Error in revokeStaffAdmin:", error);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "An error occurred during revocation."
    );
  }
});
