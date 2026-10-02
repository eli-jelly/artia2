// back to top button
const topButton = document.getElementById("topBtn");

// shows the button only when the user scrolled down the page
window.onscroll = function() {
  if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
    topButton.style.display = "block";
  } 
  else {
    topButton.style.display = "none";
  }
};

// smooth scroll effect
topButton.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});