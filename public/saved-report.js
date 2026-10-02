// importing firebse database & authentication
import {db, auth } from "./firebase.js";
// importing the firebase tools I need to get each saved report
import {doc, getDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// importing authentication to check which user is currently signed in
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const savedReport = document.getElementById("savedReport");
const reportDate = document.getElementById("reportDate");
// gets the report ID from the URL so the correct saved report will be loaded
const params = new URLSearchParams(window.location.search);
const reportId = params.get("id");

// checks which user is signed in BEFORE allowing the access to the saved reports
onAuthStateChanged(auth, async (user) => {
  // if the user is not signed in it sends them to connect
  // either through creating an account or logging in
  if (!user) {
    window.location.href = "connect.html";
    return;
  }

  try {
    // finds the report with this ID in firebase
    // loads the data it has
    const reportRef = doc(db, "reports", reportId);
    const reportSnapshot = await getDoc(reportRef);

    if (!reportSnapshot.exists()) {
      savedReport.innerText = "Report not found.";
      return;
    }

    // checks that the saved report that is about to open belongs to the current user that is signed-in
    const report = reportSnapshot.data();
    if (report.userId !== user.uid) {
      savedReport.innerText = "You cannot access this report.";
      return;
    }

    //displays the saved report and the daye it was made
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