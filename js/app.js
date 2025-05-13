// Common functionality for the application

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem("user") !== null
}

// Get current user
function getCurrentUser() {
  const userJson = localStorage.getItem("user")
  return userJson ? JSON.parse(userJson) : null
}

// Redirect if not logged in
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = "login.html"
    return false
  }
  return true
}

// Initialize navigation based on user role
function initNavigation() {
  const user = getCurrentUser()
  if (!user) return

  const navLinks = document.getElementById("navLinks")
  if (!navLinks) return

  // Clear existing links
  navLinks.innerHTML = ""

  // Define navigation links based on user role
  const links = {
    directie: [
      { href: "dashboard.html", label: "Home" },
      { href: "medewerkers.html", label: "Medewerkers" },
      { href: "producten.html", label: "Producten" },
      { href: "klanten.html", label: "Klanten" },
      { href: "leveranciers.html", label: "Leveranciers" },
      { href: "voedselpakketten.html", label: "Voedselpakketten" },
    ],
    magazijn: [
      { href: "dashboard.html", label: "Home" },
      { href: "producten.html", label: "Producten" },
      { href: "leveranciers.html", label: "Leveranciers" },
    ],
    vrijwilliger: [
      { href: "dashboard.html", label: "Home" },
      { href: "producten.html", label: "Producten" },
      { href: "voedselpakketten.html", label: "Voedselpakketten" },
    ],
    klant: [
      { href: "dashboard.html", label: "Home" },
      { href: "voedselpakketten.html", label: "Voedselpakketten" },
    ],
  }

  // Add links for the user's role
  const roleLinks = links[user.role] || []
  roleLinks.forEach((link) => {
    const li = document.createElement("li")
    const a = document.createElement("a")
    a.href = link.href
    a.textContent = link.label

    // Mark active link
    if (window.location.pathname.endsWith(link.href)) {
      a.classList.add("active")
    }

    li.appendChild(a)
    navLinks.appendChild(li)
  })
}

// Toggle user dropdown menu
function initUserMenu() {
  const userMenuButton = document.getElementById("userMenuButton")
  const userDropdown = document.getElementById("userDropdown")

  if (userMenuButton && userDropdown) {
    userMenuButton.addEventListener("click", () => {
      userDropdown.classList.toggle("active")
    })

    // Close when clicking outside
    document.addEventListener("click", (event) => {
      if (!userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
        userDropdown.classList.remove("active")
      }
    })
  }

  // Handle logout
  const logoutButton = document.getElementById("logoutButton")
  if (logoutButton) {
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault()
      localStorage.removeItem("user")
      window.location.href = "login.html"
    })
  }
}

// Toggle mobile menu
function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle")
  const navLinks = document.getElementById("navLinks")

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active")
    })
  }
}

// Initialize tabs
function initTabs() {
  const tabs = document.querySelectorAll(".tab")

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active"))

      // Add active class to clicked tab
      tab.classList.add("active")

      // Hide all tab content
      const tabContents = document.querySelectorAll(".tab-content")
      tabContents.forEach((content) => content.classList.remove("active"))

      // Show the corresponding tab content
      const tabId = tab.getAttribute("data-tab")
      const tabContent = document.getElementById(`${tabId}Tab`)
      if (tabContent) {
        tabContent.classList.add("active")
      }
    })
  })
}

// Format date to DD-MM-YYYY
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("nl-NL")
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Check if this is a protected page
  const isProtectedPage = !["index.html", "login.html", "register.html"].some((page) =>
    window.location.pathname.endsWith(page),
  )

  if (isProtectedPage) {
    if (!requireAuth()) return
    initNavigation()
    initUserMenu()
    initMobileMenu()
    initTabs()
  }
})
