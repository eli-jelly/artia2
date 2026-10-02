// this JS file controls creating and saving the user's report

// importing fireBase tools I need to save reports
import { db, auth, collection, addDoc } from "./firebase.js";

// stores the current report information so it can be saved later
const saveReportBtn = document.getElementById("saveReportBtn");

let currentReport = "";
let currentPrompt = "";
let currentImageCount = 0;

let reportSaved = false;
let isSaving = false;

// runs when the user clicks "send"
// & prevents the page from refreshing
document.getElementById("sendBtn").addEventListener("click", async (event) => {
  event.preventDefault();
  
  // gets the user's additional prompt request uploaded images, and output area
  const prompt = document.getElementById("prompt").value;
  const imageInput = document.getElementById("image");
  const output = document.getElementById("output");


  // prevents the user from uploading more than 5 images feedback
  if (imageInput.files.length > 5) {
    output.textContent = "You can upload a maximum of 5 images.";
    currentReport = "";
    currentPrompt = "";
    currentImageCount = 0;
    saveReportBtn.style.display = "none";
    return;
  }

  // checks each uploaded file to make sure it is an image feedback
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

  // checks that each of the uploaded image is not bigger than 10MB
  for (const file of imageInput.files) {
    if (file.size > 10 * 1024 * 1024) {
      output.textContent = "Each image must be 10MB or smaller.";
      currentReport = "";
      currentPrompt = "";
      currentImageCount = 0;
      saveReportBtn.style.display = "none";
      return;
    }
  }

  // prevents user from sending if they didn't upload an image
  if (imageInput.files.length === 0) {
    output.textContent = "Please upload an image first.";
    currentReport = "";
    currentPrompt = "";
    currentImageCount = 0;
    saveReportBtn.style.display = "none";
    return;
  }
  
  output.textContent = "Loading...";

  // creates FormData with the user's prompt and images
  // then sends it to the backend and waits for the AI response
  // then displays the result on the page
  try {
    const formData = new FormData();
    formData.append("prompt", prompt);

    // loop to add all the uploaded images
    for (let i = 0; i < imageInput.files.length; i++) {
      formData.append("images", imageInput.files[i]);
    }

    // sending FormData to the backend route
    const response = await fetch("/analyze-room", {
      method: "POST",
      body: formData
    });

    // converts the backend response from JSON so the we can use the result
    const data = await response.json();

    // if the request failed- stops the whole process
    // sends the error to the catch block
    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    // displays the AI result in the page
    const resultBox = document.getElementById("result");
    resultBox.style.display = "block";
    resultBox.innerText = data.result;

    currentReport = data.result;
    currentPrompt = prompt;
    currentImageCount = imageInput.files.length;
    reportSaved = false;

    // shows the save button because a report now exists
    saveReportBtn.style.display = "inline-block";

    // hiding the "Nothing yet..."/ "Loading..."
    output.style.display = "none";
  }

  // shows the high demand or went wrong message if the API AI fails
  catch (error) {
    console.error("script error:", error);
    if (error.message.includes("503") || error.message.includes("high demand")) {
      output.textContent = "The API AI service is busy right now. Please try again in a moment.";
    }
    else {
      output.textContent = "Something went wrong. Please try again.";
    }
  }
});


// saving the current report to firebase when the user clicks the save button
saveReportBtn.addEventListener("click", async () => {
  // if a user is not logged in it sends them to connect 
  // either through creating an account or logging in
  if (!auth.currentUser) {
    alert("Please log in or create an account to save your report.");
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
    // saveing the report details to the reports collection in firebase
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

