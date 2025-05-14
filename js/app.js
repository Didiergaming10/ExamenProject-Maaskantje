// Main application functionality

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  function isAuthenticated() {
    // Replace this with your actual authentication logic
    // For example, check for a token in local storage
    return localStorage.getItem("currentUser") !== null
  }

  //if (isAuthenticated()) {
    // Redirect to dashboard
  //  window.location.href = "dashboard.php"
 // }
})
