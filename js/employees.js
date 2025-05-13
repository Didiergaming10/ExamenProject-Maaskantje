// Employees functionality

// Mock data for employees
const mockEmployees = [
  { id: 1, name: "Jan Jansen", email: "jan.jansen@voedselbank.nl", role: "directie", active: true },
  { id: 2, name: "Petra de Vries", email: "petra.devries@voedselbank.nl", role: "magazijn", active: true },
  { id: 3, name: "Kees Bakker", email: "kees.bakker@voedselbank.nl", role: "vrijwilliger", active: true },
  { id: 4, name: "Lisa van Dijk", email: "lisa.vandijk@voedselbank.nl", role: "vrijwilliger", active: true },
  { id: 5, name: "Mohammed El Amrani", email: "mohammed.elamrani@voedselbank.nl", role: "magazijn", active: true },
  { id: 6, name: "Sophie Visser", email: "sophie.visser@voedselbank.nl", role: "vrijwilliger", active: false },
]

// Initialize employees page
function initEmployeesPage() {
  // Load employees
  loadEmployees()

  // Set up search and filter functionality
  setupEmployeeFilters()

  // Set up modal functionality
  setupEmployeeModal()

  // Set up selection functionality
  setupEmployeeSelection()
}

// Load employees with filtering
function loadEmployees() {
  const employeesList = document.getElementById("employeesList")
  if (!employeesList) return

  // Get filter values
  const searchTerm = document.getElementById("employeeSearch")?.value.toLowerCase() || ""
  const showInactive = document.getElementById("showInactive")?.checked || false
  const roleFilter = document.getElementById("roleFilter")?.value || "all"

  // Filter employees
  const filteredEmployees = mockEmployees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm) || employee.email.toLowerCase().includes(searchTerm)
    const matchesActive = showInactive || employee.active
    const matchesRole = roleFilter === "all" || employee.role === roleFilter

    return matchesSearch && matchesActive && matchesRole
  })

  // Render employees
  if (filteredEmployees.length === 0) {
    employeesList.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <p>Geen medewerkers gevonden</p>
        </td>
      </tr>
    `
    return
  }

  employeesList.innerHTML = filteredEmployees
    .map(
      (employee) => `
    <tr data-id="${employee.id}">
      <td>
        <div class="checkbox-item">
          <input type="checkbox" id="employee-${employee.id}" class="employee-checkbox">
          <label for="employee-${employee.id}" class="sr-only">Selecteer ${employee.name}</label>
        </div>
      </td>
      <td class="font-medium">${employee.name}</td>
      <td>${employee.email}</td>
      <td>${translateRole(employee.role)}</td>
      <td>
        <span class="status-badge ${employee.active ? "status-active" : "status-inactive"}">
          ${employee.active ? "Actief" : "Inactief"}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-outline btn-sm edit-employee" data-id="${employee.id}">Bewerken</button>
          <button class="btn btn-outline btn-sm ${
            employee.active ? "deactivate-employee" : "activate-employee"
          }" data-id="${employee.id}">
            ${employee.active ? "Deactiveren" : "Activeren"}
          </button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("")

  // Add event listeners to action buttons
  document.querySelectorAll(".edit-employee").forEach((button) => {
    button.addEventListener("click", () => {
      const employeeId = Number.parseInt(button.getAttribute("data-id"))
      openEmployeeModal(employeeId)
    })
  })

  document.querySelectorAll(".activate-employee, .deactivate-employee").forEach((button) => {
    button.addEventListener("click", () => {
      const employeeId = Number.parseInt(button.getAttribute("data-id"))
      toggleEmployeeStatus(employeeId)
    })
  })

  // Update checkboxes
  updateEmployeeCheckboxes()
}

// Set up search and filter functionality
function setupEmployeeFilters() {
  const searchInput = document.getElementById("employeeSearch")
  const showInactiveCheckbox = document.getElementById("showInactive")
  const roleFilter = document.getElementById("roleFilter")

  if (searchInput) {
    searchInput.addEventListener("input", loadEmployees)
  }

  if (showInactiveCheckbox) {
    showInactiveCheckbox.addEventListener("change", loadEmployees)
  }

  if (roleFilter) {
    roleFilter.addEventListener("change", loadEmployees)
  }
}

// Set up employee selection functionality
function setupEmployeeSelection() {
  const selectAllCheckbox = document.getElementById("selectAllEmployees")
  const deleteButton = document.getElementById("deleteEmployeesBtn")

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", () => {
      const checkboxes = document.querySelectorAll(".employee-checkbox")
      checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAllCheckbox.checked
      })
      updateDeleteButton()
    })
  }

  if (deleteButton) {
    deleteButton.addEventListener("click", deleteSelectedEmployees)
  }

  // Event delegation for employee checkboxes
  document.addEventListener("change", (event) => {
    if (event.target.classList.contains("employee-checkbox")) {
      updateSelectAllCheckbox()
      updateDeleteButton()
    }
  })
}

// Update select all checkbox state
function updateSelectAllCheckbox() {
  const selectAllCheckbox = document.getElementById("selectAllEmployees")
  const checkboxes = document.querySelectorAll(".employee-checkbox")
  const checkedCheckboxes = document.querySelectorAll(".employee-checkbox:checked")

  if (selectAllCheckbox) {
    selectAllCheckbox.checked = checkboxes.length > 0 && checkboxes.length === checkedCheckboxes.length
    selectAllCheckbox.indeterminate = checkedCheckboxes.length > 0 && checkboxes.length !== checkedCheckboxes.length
  }
}

// Update delete button state
function updateDeleteButton() {
  const deleteButton = document.getElementById("deleteEmployeesBtn")
  const checkedCheckboxes = document.querySelectorAll(".employee-checkbox:checked")

  if (deleteButton) {
    deleteButton.disabled = checkedCheckboxes.length === 0
  }
}

// Update employee checkboxes
function updateEmployeeCheckboxes() {
  document.querySelectorAll(".employee-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateSelectAllCheckbox()
      updateDeleteButton()
    })
  })
}

// Delete selected employees
function deleteSelectedEmployees() {
  const checkedCheckboxes = document.querySelectorAll(".employee-checkbox:checked")
  const employeeIds = Array.from(checkedCheckboxes).map((checkbox) => {
    const row = checkbox.closest("tr")
    return Number.parseInt(row.getAttribute("data-id"))
  })

  if (employeeIds.length === 0) return

  if (confirm(`Weet je zeker dat je ${employeeIds.length} medewerker(s) wilt verwijderen?`)) {
    // In a real application, you would send a request to delete these employees
    // For this demo, we'll just remove them from the mock data
    employeeIds.forEach((id) => {
      const index = mockEmployees.findIndex((employee) => employee.id === id)
      if (index !== -1) {
        mockEmployees.splice(index, 1)
      }
    })

    // Reload the employees list
    loadEmployees()
  }
}

// Toggle employee active status
function toggleEmployeeStatus(employeeId) {
  const employee = mockEmployees.find((e) => e.id === employeeId)
  if (!employee) return

  employee.active = !employee.active
  loadEmployees()
}

// Set up employee modal functionality
function setupEmployeeModal() {
  const modal = document.getElementById("employeeModal")
  const openModalButton = document.querySelector(".btn-primary")
  const closeModalButton = document.getElementById("closeModal")
  const cancelButton = document.getElementById("cancelEmployee")
  const form = document.getElementById("employeeForm")

  if (openModalButton) {
    openModalButton.addEventListener("click", () => openEmployeeModal())
  }

  if (closeModalButton) {
    closeModalButton.addEventListener("click", closeEmployeeModal)
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", closeEmployeeModal)
  }

  if (form) {
    form.addEventListener("submit", handleEmployeeFormSubmit)
  }

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeEmployeeModal()
    }
  })
}

// Open employee modal
function openEmployeeModal(employeeId = null) {
  const modal = document.getElementById("employeeModal")
  const modalTitle = document.getElementById("modalTitle")
  const form = document.getElementById("employeeForm")
  const nameInput = document.getElementById("employeeName")
  const emailInput = document.getElementById("employeeEmail")
  const roleSelect = document.getElementById("employeeRole")
  const passwordInput = document.getElementById("employeePassword")
  const activeCheckbox = document.getElementById("employeeActive")

  if (!modal || !form) return

  // Reset form
  form.reset()

  // Set form data if editing an existing employee
  if (employeeId) {
    const employee = mockEmployees.find((e) => e.id === employeeId)
    if (employee) {
      modalTitle.textContent = "Medewerker bewerken"
      nameInput.value = employee.name
      emailInput.value = employee.email
      roleSelect.value = employee.role
      passwordInput.value = "password123" // For demo purposes
      activeCheckbox.checked = employee.active
      form.setAttribute("data-id", employeeId)
    }
  } else {
    modalTitle.textContent = "Medewerker toevoegen"
    form.removeAttribute("data-id")
  }

  // Show modal
  modal.classList.add("active")
}

// Close employee modal
function closeEmployeeModal() {
  const modal = document.getElementById("employeeModal")
  if (modal) {
    modal.classList.remove("active")
  }
}

// Handle employee form submission
function handleEmployeeFormSubmit(event) {
  event.preventDefault()

  const form = event.target
  const employeeId = form.getAttribute("data-id")
  const nameInput = document.getElementById("employeeName")
  const emailInput = document.getElementById("employeeEmail")
  const roleSelect = document.getElementById("employeeRole")
  const passwordInput = document.getElementById("employeePassword")
  const activeCheckbox = document.getElementById("employeeActive")

  // Validate form
  if (!nameInput.value || !emailInput.value || !passwordInput.value) {
    alert("Vul alle verplichte velden in.")
    return
  }

  // Create employee data
  const employeeData = {
    name: nameInput.value,
    email: emailInput.value,
    role: roleSelect.value,
    password: passwordInput.value, // In a real app, you would hash this
    active: activeCheckbox.checked,
  }

  if (employeeId) {
    // Update existing employee
    const index = mockEmployees.findIndex((e) => e.id === Number.parseInt(employeeId))
    if (index !== -1) {
      mockEmployees[index] = { ...mockEmployees[index], ...employeeData }
    }
  } else {
    // Add new employee
    const newId = Math.max(...mockEmployees.map((e) => e.id), 0) + 1
    mockEmployees.push({ id: newId, ...employeeData })
  }

  // Close modal and reload employees
  closeEmployeeModal()
  loadEmployees()
}

// Translate role to Dutch
function translateRole(role) {
  switch (role) {
    case "directie":
      return "Directie"
    case "magazijn":
      return "Magazijnmedewerker"
    case "vrijwilliger":
      return "Vrijwilliger"
    default:
      return role
  }
}

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

// Add additional CSS for employees page
function addEmployeeStyles() {
  const style = document.createElement("style")
  style.textContent = `
    .filter-bar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .filter-options {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
    }
    
    .search-container {
      position: relative;
      max-width: 400px;
    }
    
    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted-foreground);
    }
    
    .search-input {
      padding-left: 2.5rem;
    }
    
    .table-container {
      overflow-x: auto;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.875rem;
    }
    
    .data-table th {
      padding: 0.75rem 1rem;
      background-color: var(--muted);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
    }
    
    .data-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border);
    }
    
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
    }
    
    .status-active {
      background-color: #dcfce7;
      color: #166534;
    }
    
    .status-inactive {
      background-color: #fee2e2;
      color: #991b1b;
    }
    
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    
    .loading-cell {
      height: 200px;
    }
    
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: var(--muted-foreground);
    }
    
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      overflow: auto;
    }
    
    .modal.active {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .modal-content {
      background-color: var(--background);
      border-radius: var(--radius);
      width: 100%;
      max-width: 500px;
      box-shadow: var(--shadow-md);
      margin: 1rem;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    
    .modal-body {
      padding: 1.5rem;
    }
    
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    
    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--muted-foreground);
    }
    
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
    
    @media (min-width: 768px) {
      .filter-bar {
        flex-direction: row;
        justify-content: space-between;
      }
    }
  `
  document.head.appendChild(style)
}

// Initialize employees page
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("medewerkers.html")) {
    addEmployeeStyles()
    initEmployeesPage()
  }
})
