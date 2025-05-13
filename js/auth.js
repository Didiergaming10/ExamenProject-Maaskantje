// Authentication functionality

// Toggle password visibility
function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const icon = input.nextElementSibling.querySelector("i")

  if (input.type === "password") {
    input.type = "text"
    icon.classList.remove("bi-eye")
    icon.classList.add("bi-eye-slash")
  } else {
    input.type = "password"
    icon.classList.remove("bi-eye-slash")
    icon.classList.add("bi-eye")
  }
}

// Initialize mock users if they don't exist
function initMockUsers() {
  if (!localStorage.getItem("users")) {
    const mockUsers = [
      {
        email: "directie@voedselbank.nl",
        password: "password123",
        name: "Admin Gebruiker",
        role: "directie",
      },
      {
        email: "magazijn@voedselbank.nl",
        password: "password123",
        name: "Magazijn Medewerker",
        role: "magazijn",
      },
      {
        email: "vrijwilliger@voedselbank.nl",
        password: "password123",
        name: "Vrijwilliger Gebruiker",
        role: "vrijwilliger",
      },
      {
        email: "klant@voedselbank.nl",
        password: "password123",
        name: "Klant Gebruiker",
        role: "klant",
      },
    ]

    localStorage.setItem("users", JSON.stringify(mockUsers))
  }
}

// Handle login form submission
function handleLogin() {
  const loginForm = document.getElementById("loginForm")

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Find user with matching email and password
      const user = users.find((u) => u.email === email && u.password === password)

      if (user) {
        // Store user in localStorage (excluding password)
        const { password, ...userWithoutPassword } = user
        localStorage.setItem("user", JSON.stringify(userWithoutPassword))

        // Redirect to dashboard
        window.location.href = "dashboard.html"
      } else {
        alert("Ongeldige inloggegevens. Probeer opnieuw.")
      }
    })
  }
}

// Handle registration form submission
function handleRegister() {
  const registerForm = document.getElementById("registerForm")

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirmPassword").value
      const accountType = document.getElementById("accountType").value

      // Validate passwords match
      if (password !== confirmPassword) {
        alert("Wachtwoorden komen niet overeen.")
        return
      }

      // Get existing users
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Check if email already exists
      if (users.some((u) => u.email === email)) {
        alert("Dit e-mailadres is al in gebruik.")
        return
      }

      // Add new user
      const newUser = {
        name,
        email,
        password,
        role: accountType,
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Store user in localStorage (excluding password)
      const { password: _, ...userWithoutPassword } = newUser
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))

      // For a real application, you would redirect to a family info page
      // For simplicity, we'll redirect directly to the dashboard
      window.location.href = "dashboard.html"
    })
  }
}

// Initialize authentication
document.addEventListener("DOMContentLoaded", () => {
  initMockUsers()
  handleLogin()
  handleRegister()
})
