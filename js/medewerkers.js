// Medewerkers management functionality

document.addEventListener("DOMContentLoaded", () => {
  // Mock authentication and user functions (replace with actual implementation)
  function requireAuth() {
    // In a real application, this would check if the user is authenticated
    // and redirect to the login page if not.
    console.log("Authentication check (mock)")
  }

  function getCurrentUser() {
    // In a real application, this would retrieve the current user's information.
    console.log("Getting current user (mock)")
    return {
      id: 1,
      role: "directie",
    }
  }

  function getAllUsers() {
    // In a real application, this would retrieve all users from the database.
    return JSON.parse(localStorage.getItem("users")) || []
  }

  function updateUser(userId, userData) {
    // In a real application, this would update the user in the database.
    const users = JSON.parse(localStorage.getItem("users")) || []
    const index = users.findIndex((u) => u.id === userId)
    if (index !== -1) {
      users[index] = { ...users[index], ...userData }
      localStorage.setItem("users", JSON.stringify(users))
      return true
    }
    return false
  }

  function createUser(userData) {
    // In a real application, this would create a new user in the database.
    const users = JSON.parse(localStorage.getItem("users")) || []
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1
    const newUser = { id: newId, ...userData }
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))
    return newUser
  }

  // Require authentication
  requireAuth()

  // Get current user
  const user = getCurrentUser()

  // Only directie can access this page
  if (user.role !== "directie") {
    window.location.href = "dashboard.php"
  }

  // Load medewerkers
  loadMedewerkers()

  // Add event listeners
 const addMedewerkerBtn = document.getElementById("add-medewerker")
if (addMedewerkerBtn) {
    addMedewerkerBtn.addEventListener("click", () => {
        openMedewerkerModal()
    })
}




  const multiSelectBtn = document.getElementById("multi-select")
  if (multiSelectBtn) {
    multiSelectBtn.addEventListener("click", () => {
      toggleMultiSelect()
    })
  }

  const selectAllMedewerkersCheckbox = document.getElementById("select-all-medewerkers")
  if (selectAllMedewerkersCheckbox) {
    selectAllMedewerkersCheckbox.addEventListener("change", () => {
      const checkboxes = document.querySelectorAll(".medewerker-checkbox")
      checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAllMedewerkersCheckbox.checked
      })
    })
  }

  const searchInput = document.getElementById("search-medewerkers")
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      loadMedewerkers()
    })
  }

  // Medewerker modal form
  const medewerkerForm = document.getElementById("medewerker-form")
  if (medewerkerForm) {
    medewerkerForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveMedewerker()
    })
  }

  const cancelMedewerkerBtn = document.getElementById("cancel-medewerker")
  if (cancelMedewerkerBtn) {
    cancelMedewerkerBtn.addEventListener("click", () => {
      closeMedewerkerModal()
    })
  }

  const closeModalBtn = document.getElementById("close-modal")
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      closeMedewerkerModal()
    })
  }

  // Functions
  function loadMedewerkers() {
    const users = getAllUsers()
    const tableBody = document.getElementById("medewerkers-table-body")
    const searchTerm = document.getElementById("search-medewerkers")?.value.toLowerCase() || ""

    // Filter users by search term
    let filteredUsers = users
    if (searchTerm) {
      filteredUsers = users.filter(
        (user) =>
          (user.firstName + " " + user.lastName).toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm),
      )
    }

    // Clear table
    tableBody.innerHTML = ""

    // Add users to table
    filteredUsers.forEach((user) => {
      const row = document.createElement("tr")

      // Get role display name
      const roleDisplayNames = {
        directie: "Directie",
        magazijn: "Magazijnmedewerker",
        vrijwilliger: "Vrijwilliger",
      }

      // Get status badge class
      let statusBadgeClass = ""
      switch (user.status) {
        case "actief":
          statusBadgeClass = "bg-green-100 text-green-800"
          break
        case "geblokkeerd":
          statusBadgeClass = "bg-red-100 text-red-800"
          break
        default:
          statusBadgeClass = "bg-gray-100 text-gray-800"
      }

      row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap hidden multi-select-col">
                    <input type="checkbox" class="medewerker-checkbox focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" data-id="${user.id}">
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${user.firstName} ${user.lastName}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${user.email}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${user.phone || "-"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${roleDisplayNames[user.role] || user.role}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadgeClass}">
                        ${user.status || "actief"}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="edit-medewerker text-green-600 hover:text-green-900" data-id="${user.id}">Wijzig</button>
                </td>
            `

      tableBody.appendChild(row)
    })

    // Add event listeners to edit buttons
    const editButtons = document.querySelectorAll(".edit-medewerker")
    editButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const medewerkerId = Number.parseInt(button.getAttribute("data-id"))
        openMedewerkerModal(medewerkerId)
      })
    })
  }

  function toggleMultiSelect() {
    const multiSelectCols = document.querySelectorAll(".multi-select-col")
    multiSelectCols.forEach((col) => {
      col.classList.toggle("hidden")
    })
  }

  function openMedewerkerModal(medewerkerId = null) {
    const modal = document.getElementById("medewerker-modal")
    const modalTitle = document.getElementById("modal-title")
    const medewerkerForm = document.getElementById("medewerker-form")
    const medewerkerIdInput = document.getElementById("medewerker-id")

    // Clear form
    medewerkerForm.reset()

    if (medewerkerId) {
      // Edit existing medewerker
      modalTitle.textContent = "Medewerker wijzigen"

      // Get medewerker data
      const users = getAllUsers()
      const medewerker = users.find((u) => u.id === medewerkerId)

      if (medewerker) {
        // Fill form with medewerker data
        medewerkerIdInput.value = medewerker.id
        document.getElementById("voornaam").value = medewerker.firstName
        document.getElementById("achternaam").value = medewerker.lastName
        document.getElementById("email").value = medewerker.email
        document.getElementById("telefoon").value = medewerker.phone || ""
        document.getElementById("rol").value = medewerker.role
        document.getElementById("status").value = medewerker.status || "actief"
      }
    } else {
      // Add new medewerker
      modalTitle.textContent = "Medewerker toevoegen"
      medewerkerIdInput.value = ""
      document.getElementById("status").value = "actief"
    }

    // Show modal
    modal.classList.remove("hidden")
    modal.classList.add("flex")
  }

  function closeMedewerkerModal() {
    const modal = document.getElementById("medewerker-modal")
    modal.classList.add("hidden")
    modal.classList.remove("flex")
  }

  function saveMedewerker() {
    const medewerkerId = document.getElementById("medewerker-id").value
    const voornaam = document.getElementById("voornaam").value
    const achternaam = document.getElementById("achternaam").value
    const email = document.getElementById("email").value
    const telefoon = document.getElementById("telefoon").value
    const rol = document.getElementById("rol").value
    const status = document.getElementById("status").value
    const wachtwoord = document.getElementById("wachtwoord").value

    const userData = {
      firstName: voornaam,
      lastName: achternaam,
      email: email,
      phone: telefoon,
      role: rol,
      status: status,
    }

    if (wachtwoord) {
      userData.password = wachtwoord
    }

    if (medewerkerId) {
      // Update existing medewerker
      updateUser(Number.parseInt(medewerkerId), userData)
    } else {
      // Add new medewerker
      // Require password for new users
      if (!wachtwoord) {
        alert("Wachtwoord is verplicht voor nieuwe medewerkers.")
        return
      }
      createUser(userData)
    }

    // Close modal and reload medewerkers
    closeMedewerkerModal()
    loadMedewerkers()
  }
})
