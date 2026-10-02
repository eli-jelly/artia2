// importing firebase database and tools I need to find and load saved reports
import { db, auth, collection, getDocs, query, where, orderBy } from "./firebase.js";
// importing firebase authentication tools for checking the login state and log out
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// checks if a user is signed in to decide if the library should be locked or unlocked
const libraryContent = document.getElementById("libraryContent");
const libraryLock = document.getElementById("libraryLock");

// user contains the current signed-in user's firebase information
// if there is no user signed-in it will be null
onAuthStateChanged(auth, (user) => {
  // when user is signed in
  if (user) {
    libraryContent.classList.remove("locked");
    libraryLock.classList.remove("show");
    logoutButton.style.display = "inline-block";

    loadReports(user.uid);
    console.log("User is signed in");
  }
  // when user is not signed in
  else {
    libraryContent.classList.add("locked");
    libraryLock.classList.add("show");
    logoutButton.style.display = "none";

    console.log("No user is signed in");
  }
});


// when the logout button is clicked it signs the current user out
const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  }
  catch (error) {
    console.error("Logout error:", error);
  }
});


// loads and displays all of the saved reports that belongs to the signed-in user
// parameter used: userId- the unique firebase ID of the current user
// value returns: nothing- the function just updates the reports shown on the page
async function loadReports(userId) {

  const reportsContainer = document.getElementById("reportsContainer");

  // shows this while Firebase is loading the reports
  reportsContainer.innerHTML = "<p>Loading your reports...</p>";

  // creates a query to only get this user's reports 
  // & show the newest reports first
  const reportsQuery = query(
    collection(db, "reports"), 
    where("userId", "==", userId), 
    orderBy("createdAt", "desc")
  );

  try {
    const querySnapshot = await getDocs(reportsQuery);

    // removes loading message once reports are ready
    reportsContainer.innerHTML = "";
  
    if (querySnapshot.empty) {
      reportsContainer.innerHTML =  '<h3 class="empty-library-message">You haven\'t saved any reports yet.</h3>';
      return;
    }

    // loops each saved report and creates a report card for it
    querySnapshot.forEach((doc) => {
      const report = doc.data();
      const reportId = doc.id;
      const reportCard = document.createElement("div");
      reportCard.className = "report-card";
      reportCard.innerHTML = `
        <small class="report-date">${new Date(report.createdAt).toLocaleDateString()}</small>
        <p>${report.result.substring(0, 150)}...</p>
        <h3>Click for full report</h3>
      `;

      // opens the full saved report by using its document ID in the URL
      reportCard.addEventListener("click", () => {
        window.location.href = `saved-report.html?id=${reportId}`;
      });
      reportsContainer.appendChild(reportCard);
    });
  } 
  catch (error) {
    console.error("Error loading reports:", error);
    reportsContainer.innerHTML = "<p>Could not load your reports. Please try again.</p>";
  }
}