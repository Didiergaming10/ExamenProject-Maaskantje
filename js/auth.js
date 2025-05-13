// Authentication and user management

// Mock user data (in a real application, this would be stored in a database)
let users = [
  {
    id: 1,
    firstName: "Admin",
    lastName: "User",
    email: "admin@maaskantje.nl",
    password: "admin123",
    role: "directie",
    status: "actief",
  },
  {
    id: 2,
    firstName: "Magazijn",
    lastName: "Medewerker",
    email: "magazijn@maaskantje.nl",
    password: "magazijn123",
    role: "magazijn",
    status: "actief",
  },
  {
    id: 3,
    firstName: "Vrijwilliger",
    lastName: "Helper",
    email: "vrijwilliger@maaskantje.nl",
    password: "vrijwilliger123",
    role: "vrijwilliger",
    status: "actief",
  },
]

// Check if users are stored in localStorage
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(users))
} else {
  users = JSON.parse(localStorage.getItem("users"))
}

// Current user session
let currentUser = null

// Check if user is logged in (from localStorage)
if (localStorage.getItem("currentUser")) {
  currentUser = JSON.parse(localStorage.getItem("currentUser"))
}

// Function to handle login
function login(email, password) {
  const users = JSON.parse(localStorage.getItem("users")) || []
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    if (user.status === "geblokkeerd") {
      return { success: false, message: "Uw account is geblokkeerd. Neem contact op met de beheerder." }
    }

    // Set current user in localStorage
    localStorage.setItem("currentUser", JSON.stringify(user))
    return { success: true, user }
  }

  return { success: false, message: "Ongeldige email of wachtwoord." }
}

// Function to handle logout
function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
}

// Function to create a new user
function createUser(userData) {
  const users = JSON.parse(localStorage.getItem("users")) || []

  // Check if email already exists
  if (users.some((u) => u.email === userData.email)) {
    return { success: false, message: "Email is al in gebruik." }
  }

  // Generate new user ID
  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1

  // Create new user object
  const newUser = {
    id: newId,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    status: "actief",
  }

  // Add to users array
  users.push(newUser)

  // Save to localStorage
  localStorage.setItem("users", JSON.stringify(users))

  return { success: true, user: newUser }
}

// Function to update user
function updateUser(userId, userData) {
  const users = JSON.parse(localStorage.getItem("users")) || []
  const userIndex = users.findIndex((u) => u.id === userId)

  if (userIndex === -1) {
    return { success: false, message: "Gebruiker niet gevonden." }
  }

  // Update user data
  users[userIndex] = { ...users[userIndex], ...userData }

  // Save to localStorage
  localStorage.setItem("users", JSON.stringify(users))

  // If current user is updated, update the session
  if (currentUser && currentUser.id === userId) {
    localStorage.setItem("currentUser", JSON.stringify(users[userIndex]))
  }

  return { success: true, user: users[userIndex] }
}

// Function to delete user
function deleteUser(userId) {
  const users = JSON.parse(localStorage.getItem("users")) || []
  const filteredUsers = users.filter((u) => u.id !== userId)

  if (filteredUsers.length === users.length) {
    return { success: false, message: "Gebruiker niet gevonden." }
  }

  // Save to localStorage
  localStorage.setItem("users", JSON.stringify(filteredUsers))

  return { success: true }
}

// Function to check if user is authenticated
function isAuthenticated() {
  return localStorage.getItem("currentUser") !== null
}

// Function to check user role
function hasRole(role) {
  if (!isAuthenticated()) return false

  const user = JSON.parse(localStorage.getItem("currentUser"))
  return user.role === role
}

// Function to get current user
function getCurrentUser() {
  if (!isAuthenticated()) return null

  return JSON.parse(localStorage.getItem("currentUser"))
}

// Function to get all users
function getAllUsers() {
  return JSON.parse(localStorage.getItem("users")) || []
}

// Function to redirect if not authenticated
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = "index.html"
  }
}

// Function to redirect if not authorized for role
function requireRole(role) {
  if (!isAuthenticated() || !hasRole(role)) {
    window.location.href = "index.html"
  }
}

// Initialize login form if it exists
document.addEventListener("DOMContentLoaded", () => {
  // Check if login form exists
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    // Add event listener for form submission
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      const result = login(email, password)

      if (result.success) {
        // Redirect based on user role
        switch (result.user.role) {
          case "directie":
          case "magazijn":
          case "vrijwilliger":
            window.location.href = "dashboard.html"
            break
          default:
            window.location.href = "dashboard.html"
        }
      } else {
        alert(result.message)
      }
    })

    // Toggle password visibility
    const togglePassword = document.getElementById("toggle-password")
    if (togglePassword) {
      togglePassword.addEventListener("click", () => {
        const passwordInput = document.getElementById("password")
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
        passwordInput.setAttribute("type", type)
        togglePassword.textContent = type === "password" ? "wachtwoord tonen" : "wachtwoord verbergen"
      })
    }

    // Create account link
    const createAccountLink = document.getElementById("create-account-link")
    if (createAccountLink) {
      createAccountLink.addEventListener("click", (e) => {
        e.preventDefault()
        window.location.href = "create-account.html"
      })
    }
  }

  // Check if create account form exists
  const createAccountForm = document.getElementById("create-account-form")
  if (createAccountForm) {
    createAccountForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const firstName = document.getElementById("firstname").value
      const lastName = document.getElementById("lastname").value
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirm-password").value
      const role = document.querySelector('input[name="role"]:checked').value

      // Validate passwords match
      if (password !== confirmPassword) {
        alert("Wachtwoorden komen niet overeen.")
        return
      }

      const result = createUser({
        firstName,
        lastName,
        email,
        password,
        role,
      })

      if (result.success) {
        if (role === "klant") {
          // Redirect to gezin information page
          window.location.href = "gezin-informatie.html"
        } else {
          // Log in the new user
          login(email, password)
          window.location.href = "dashboard.html"
        }
      } else {
        alert(result.message)
      }
    })
  }

  // Initialize mobile menu toggle if it exists
  const mobileMenuButton = document.getElementById("mobile-menu-button")
  const mobileMenu = document.getElementById("mobile-menu")

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
    })
  }

  // Initialize navigation based on user role
  const mainNav = document.getElementById("main-nav")
  const mobileNav = document.getElementById("mobile-menu")

  if ((mainNav || mobileNav) && isAuthenticated()) {
    const user = getCurrentUser()
    let navLinks = ""

    switch (user.role) {
      case "directie":
        navLinks = `
                    <a href="medewerkers.html" class="text-gray-700 hover:text-green-600">Medewerkers</a>
                    <a href="producten.html" class="text-gray-700 hover:text-green-600">Producten</a>
                    <a href="klanten.html" class="text-gray-700 hover:text-green-600">Klanten</a>
                    <a href="leveranciers.html" class="text-gray-700 hover:text-green-600">Leveranciers</a>
                    <a href="voedselpakketten.html" class="text-gray-700 hover:text-green-600">Voedselpakketten</a>
                `
        break
      case "magazijn":
        navLinks = `
                    <a href="producten.html" class="text-gray-700 hover:text-green-600">Producten</a>
                    <a href="leveranciers.html" class="text-gray-700 hover:text-green-600">Leveranciers</a>
                `
        break
      case "vrijwilliger":
        navLinks = `
                    <a href="producten.html" class="text-gray-700 hover:text-green-600">Producten</a>
                    <a href="voedselpakketten.html" class="text-gray-700 hover:text-green-600">Voedselpakketten</a>
                `
        break
    }

    // Add logout link
    navLinks += `<a href="#" id="logout-link" class="text-gray-700 hover:text-green-600">Uitloggen</a>`

    if (mainNav) mainNav.innerHTML = navLinks
    if (mobileNav) mobileNav.innerHTML = navLinks

    // Add event listener for logout
    const logoutLinks = document.querySelectorAll("#logout-link")
    logoutLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        logout()
      })
    })
  }
})
