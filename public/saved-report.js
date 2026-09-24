import {db, auth } from "./firebase.js";

import {doc, getDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const savedReport = document.getElementById("savedReport");
const reportDate = document.getElementById("reportDate");

const params = new URLSearchParams(window.location.search);
const reportId = params.get("id");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "connect.html";
    return;
  }

  try {
    const reportRef = doc(db, "reports", reportId);
    const reportSnapshot = await getDoc(reportRef);

    if (!reportSnapshot.exists()) {
      savedReport.innerText = "Report not found.";
      return;
    }

    const report = reportSnapshot.data();
    if (report.userId !== user.uid) {
      savedReport.innerText = "You cannot access this report.";
      return;
    }

    savedReport.innerText = report.result;
    reportDate.innerText = new Date(report.createdAt).toLocaleDateString();
  }

  catch (error) {
    console.error("Error loading report:", error);

    if (error.code === "permission-denied") {
      savedReport.innerText = "You cannot access this report.";
    }
    else {
      savedReport.innerText = "Could not load report.";
    }
  }
});