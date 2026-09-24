import { db, auth, collection, getDocs, query, where, orderBy } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


/*signed in/not library*/
const libraryContent = document.getElementById("libraryContent");
const libraryLock = document.getElementById("libraryLock");



// you need to describe the function of the code, what arguments deoes it take, and what value does it return
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
  const reportsQuery = query(
    collection(db, "reports"), 
    where("userId", "==", userId), 
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(reportsQuery);

  reportsContainer.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const report = doc.data();
    const reportId = doc.id;
    const reportCard = document.createElement("div");
    reportCard.className = "report-card";

    reportCard.innerHTML = `
      <h3>Saved Report</h3>
      <p>${report.result.substring(0, 150)}...</p>
      <small class="report-date">${new Date(report.createdAt).toLocaleDateString()}</small>
    `;

    reportCard.addEventListener("click", () => {
      window.location.href = `saved-report.html?id=${reportId}`;
    });

    reportsContainer.appendChild(reportCard);
  });
}
