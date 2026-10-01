import { db, auth, collection, getDocs, query, where, orderBy } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


/*signed in/not library*/
const libraryContent = document.getElementById("libraryContent");
const libraryLock = document.getElementById("libraryLock");


onAuthStateChanged(auth, (user) => {
  /*when user is signed in*/
  if (user) {
    libraryContent.classList.remove("locked");
    libraryLock.classList.remove("show");
    logoutButton.style.display = "inline-block";

    loadReports(user.uid);
    
    console.log("Signed in as:", user.email);
  }
  /*when user is not signed in*/
  else {
    libraryContent.classList.add("locked");
    libraryLock.classList.add("show");
    logoutButton.style.display = "none";

    console.log("No user is signed in");
  }
});

/*logging out*/
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



async function loadReports(userId) {

  const reportsContainer = document.getElementById("reportsContainer");

  // shows this while Firebase is loading the reports
  reportsContainer.innerHTML = "<p>Loading your reports...</p>";

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