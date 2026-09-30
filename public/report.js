// This js file mainly controls what happens when the user click send

// FireBase
import { db, auth, collection, addDoc } from "./firebase.js";

console.log("NEW SCRIPT LOADED");

const saveReportBtn = document.getElementById("saveReportBtn");

let currentReport = "";
let currentPrompt = "";
let currentImageCount = 0;

let reportSaved = false;
let isSaving = false;

// Waiting for user to click the button, and prevent page from refreshing
document.getElementById("sendBtn").addEventListener("click", async (event) => {
  event.preventDefault();
  
  // Taking user's input
  const prompt = document.getElementById("prompt").value;
  const imageInput = document.getElementById("image");
  const output = document.getElementById("output");


  // max images is 5 feedback
  if (imageInput.files.length > 5) {
    output.textContent = "You can upload a maximum of 5 images.";

    currentReport = "";
    currentPrompt = "";
    currentImageCount = 0;
    saveReportBtn.style.display = "none";

    return;
  }

  // images only check
  for (const file of imageInput.files) {
    if (!file.type.startsWith("image/")) {
      output.textContent = "Please upload image files only.";

      currentReport = "";
      currentPrompt = "";
      currentImageCount = 0;
      saveReportBtn.style.display = "none";

      return;
    }
  }
  //testing
  console.log("clicked");
  console.log("prompt:", prompt);
  console.log("files:", imageInput.files.length);

  output.textContent = "Loading...";

  // creates the form data, 
  // then sends request to AI api, 
  // loads response in bacgrounf then shoes the resuts
  try {
    const formData = new FormData();
    formData.append("prompt", prompt);

    // Loop to add all the uploaded image
    for (let i = 0; i < imageInput.files.length; i++) {
      formData.append("images", imageInput.files[i]);
    }

    console.log("sending request");

    // Sending data to the backend
    const response = await fetch("/analyze-room", {
      method: "POST",
      body: formData
    });

    console.log("got response status:", response.status);

    const data = await response.json();
    console.log("response data:", data);

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    // Showing results
    const resultBox = document.getElementById("result");
    resultBox.style.display = "block";
    resultBox.innerText = data.result;

    currentReport = data.result;
    currentPrompt = prompt;
    currentImageCount = imageInput.files.length;
    reportSaved = false;

    /*Show save button because a report now exists*/
    saveReportBtn.style.display = "inline-block";

    /*Hiding the "Nothing yet..."*/
    output.style.display = "none";
  }

  catch (error) {
    console.error("script error:", error);
    output.textContent = "Error: " + error.message;
  }
});



saveReportBtn.addEventListener("click", async () => {
  if (!auth.currentUser) {
    window.location.href = "connect.html";
    return;
  }
  // prevents saving the same report twice
  if (reportSaved) {
    alert("This report has already been saved!");
    return;
  }
  // prevents very fast double-clicks while firebase is still saving
  if (isSaving) {
    return;
  }
  isSaving = true;
  saveReportBtn.disabled = true;

  try {
    await addDoc(collection(db, "reports"), {
      userId: auth.currentUser.uid,
      prompt: currentPrompt,
      result: currentReport,
      imageCount: currentImageCount,
      createdAt: new Date().toISOString()
    });
    reportSaved = true;
    alert("Report saved to your library!");
  } 
  catch (error) {
    console.error("Error saving report:", error);
    alert("Could not save report. Please try again.");
  }
  isSaving = false;
  saveReportBtn.disabled = false;
});

