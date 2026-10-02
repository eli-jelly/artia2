// importing authentication
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// allowing user to hide and show the password with the eye toggle
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

// runs when user clicks the eye icon to switch between visible and hidden
togglePassword.addEventListener("click", () => {
    if (password.type === "password") {
        password.type = "text";
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
    } 
    else {
        password.type = "password";
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");
    }
});

const signupForm = document.getElementById("signupForm");
const passwordHint = document.getElementById("passwordHint");

// checks the password live to make sure it has at least 6 characters & doesn't contain spaces
// the input event runs every time the user changes the password (deletes, adds, replaces characters)
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

// validates the password 
// then uses firebase authentication to create the user's account
signupForm.addEventListener("submit", async (event) => {
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

    // creating the account using the email and password entered by the user
    try {
        await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );
        
        alert("Account created successfully!");
        window.location.href = "library.html";
    } 

    // showing different messages depenting on the firebase signup errors
    catch (error) {
        console.error("Signup error:", error);

        if (error.code === "auth/email-already-in-use") {
            alert("An account with this email already exists. Please log in instead.");
        }
        else if (error.code === "auth/invalid-email") {
            alert("Please enter a valid email address.");
        }
        else if (error.code === "auth/weak-password") {
            alert("Please choose a stronger password.");
        }
        else {
            alert("Could not create your account. Please try again.");
        }
    }
});

