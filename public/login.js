import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


/*Allowing user to hide and show the password with the eye toggle*/
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
/*If the user clicks the eye icon the password type changes between password and text*/
togglePassword.addEventListener("click", () => {
    if (password.type === "password") {
        password.type = "text";
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
    } else {
        password.type = "password";
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");
    }
});



/*Making sure the user uses at least 6 charecters when writing the password & cannot contain spaces*/
const loginForm = document.getElementById("loginForm"); 
const passwordHint = document.getElementById("passwordHint");

/*Using "input so the function will run every time(live)"*/
password.addEventListener("input", () => {
  password.setCustomValidity("");
  
  const length = password.value.length;
  const hasSpace = password.value.includes(" ");

  if (length === 0) {
      passwordHint.textContent = "";
      passwordHint.className = "password-hint";
  }
  else if (hasSpace && length < 6){
    passwordHint.textContent = "Password must be at least 6 characters and cannot contain spaces."
    passwordHint.className = "password-hint password-invalid";
  }
  else if (length < 6) {
      passwordHint.textContent = "Password must be at least 6 characters.";
      passwordHint.className = "password-hint password-invalid";
  }
  else if (hasSpace){
    passwordHint.textContent = "Password cannot contain spaces."
    passwordHint.className = "password-hint password-invalid";
  }
  else {
      passwordHint.textContent = "✓ Password looks good!";
      passwordHint.className = "password-hint password-valid";
  }
});


const email = document.getElementById("email");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (password.value.length < 6) {
    password.setCustomValidity(
      "Password must contain at least 6 characters."
    );
    password.reportValidity();
    return;
  }

  if (password.value.includes(" ")) {
    password.setCustomValidity(
      "Password cannot contain spaces."
    );
    password.reportValidity();
    return;
  }

  password.setCustomValidity("");

  try {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
    );

  alert("Welcome back!");
  window.location.href = "library.html";
  }
  
  catch (error) {
    console.error("Login error:", error);

    if (error.code === "auth/invalid-credential") {
      alert("The email or password is incorrect. Please try again.");
    }
    else if (error.code === "auth/invalid-email") {
      alert("Please enter a valid email address.");
    }
    else if (error.code === "auth/too-many-requests") {
      alert("Too many unsuccessful attempts. Please wait and try again.");
    }
    else {
      alert("Could not log in. Please try again.");
    }
  }
});






// variables
// fuctions 
// run time stuff calling your functions








/*password.addEventListener("input", () => {
    const length = password.value.length;
    if (length === 0) {
        passwordHint.textContent = "";
        passwordHint.className = "password-hint";
    }
    else if (length < 6) {
        passwordHint.textContent = "Password must be at least 6 characters.";
        passwordHint.className = "password-hint password-invalid";
    }
    else {
        passwordHint.textContent = "✓ Password looks good!";
        passwordHint.className = "password-hint password-valid";
    }
});
 password.addEventListener("input", () => {
  password.setCustomValidity("");
});


const email = document.getElementById("email");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (password.value.length < 6) {
    password.setCustomValidity(
      "Password must contain at least 6 characters."
    );
    password.reportValidity();
    return;
  }

  if (password.value.includes(" ")) {
    password.setCustomValidity(
      "Password cannot contain spaces."
    );
    password.reportValidity();
    return;
  }

  password.setCustomValidity("");

  try {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
    );

  alert("Welcome back!");
  window.location.href = "library.html";
  } */