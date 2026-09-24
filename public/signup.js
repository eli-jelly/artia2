/*Import of authentication*/
import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


/*Allowing user to hide and show the password*/
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

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

    try {
        const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
        );

        console.log("Account created:", userCredential.user);
        alert("Account created successfully!");

        window.location.href = "library.html";
    } 

    
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

