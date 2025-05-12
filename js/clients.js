// Clients functionality

// Mock data for clients
const mockClients = [
  {
    id: 1,
    name: "Familie Jansen",
    email: "jansen@email.nl",
    phone: "06-12345678",
    address: "Hoofdstraat 123, 5473 AB Maaskantje",
    postalCode: "5473 AB",
    familySize: 4,
    dietaryRestrictions: ["Geen varkensvlees", "Lactose-intolerant"],
    active: true,
  },
  {
    id: 2,
    name: "Familie De Vries",
    email: "devries@email.nl",
    phone: "06-23456789",
    address: "Kerkstraat 45, 5473 CD Maaskantje",
    postalCode: "5473 CD",
    familySize: 3,
    dietaryRestrictions: ["Vegetarisch"],
    active: true,
  },
  {
    id: 3,
    name: "Familie Bakker",
    email: "bakker@email.nl",
    phone: "06-34567890",
    address: "Marktplein 7, 5473 EF Maaskantje",
    postalCode: "5473 EF",
    familySize: 5,
    dietaryRestrictions: [],
    active: true,
  },
  {
    id: 4,
    name: "Familie De Wit",
    email: "dewit@email.nl",
    phone: "06-45678901",
    address: "Boerenweg 12, 5473 GH Maaskantje",
    postalCode: "5473 GH",
    familySize: 2,
    dietaryRestrictions: ["Glutenvrij"],
    active: true,
  },
  {
    id: 5,
    name: "Familie Van Vliet",
    email: "vanvliet@email.nl",
    phone: "06-56789012",
    address: "Dorpsstraat 34, 5473 IJ Maaskantje",
    postalCode: "5473 IJ",
    familySize: 6,
    dietaryRestrictions: ["Geen varkensvlees"],
    active: false,
  },
]

// Initialize clients page
function initClientsPage() {
  // Load clients
  loadClients()

  // Set up search and filter functionality
  setupClientFilters()

  // Set up modal functionality
  setupClientModal()

  // Set up selection functionality
  setupClientSelection()
}

// Load clients with filtering
function loadClients() {
  const clientsList = document.getElementById("clientsList")
  if (!clientsList) return

  // Get filter values
  const searchTerm = document.getElementById("clientSearch")?.value.toLowerCase() || ""
  const showInactive = document.getElementById("showInactiveClients")?.checked || false
  const postalCodeFilter = document.getElementById("postalCodeFilter")?.value || "all"

  // Filter clients
  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm) ||
      client.postalCode.toLowerCase().includes(searchTerm)
    const matchesActive = showInactive || client.active
    const matchesPostalCode = postalCodeFilter === "all" || client.postalCode.replace(/\s/g, "") === postalCodeFilter

    return matchesSearch && matchesActive && matchesPostalCode
  })

  // Render clients
  if (filteredClients.length === 0) {
    clientsList.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">
          <p>Geen klanten gevonden</p>
        </td>
      </tr>
    `
    return
  }

  clientsList.innerHTML = filteredClients
    .map(
      (client) => `
    <tr data-id="${client.id}">
      <td>
        <div class="checkbox-item">
          <input type="checkbox" id="client-${client.id}" class="client-checkbox">
          <label for="client-${client.id}" class="sr-only">Selecteer ${client.name}</label>
        </div>
      </td>
      <td class="font-medium">${client.name}</td>
      <td>
        <div>
          <p>${client.email}</p>
          <p>${client.phone}</p>
        </div>
      </td>
      <td>
        <div>
          <p>${client.address}</p>
          <p class="text-xs text-muted">${client.postalCode}</p>
        </div>
      </td>
      <td>${client.familySize} personen</td>
      <td>
        ${
          client.dietaryRestrictions.length > 0
            ? `<div class="diet-tags">
                ${client.dietaryRestrictions
                  .map((restriction) => `<span class="diet-tag">${restriction}</span>`)
                  .join("")}
              </div>`
            : '<span class="text-muted">Geen</span>'
        }
      </td>
      <td>
        <span class="status-badge ${client.active ? "status-active" : "status-inactive"}">
          ${client.active ? "Actief" : "Inactief"}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-outline btn-sm edit-client" data-id="${client.id}">Bewerken</button>
          <button class="btn btn-outline btn-sm ${
            client.active ? "deactivate-client" : "activate-client"
          }" data-id="${client.id}">
            ${client.active ? "Deactiveren" : "Activeren"}
          </button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("")

  // Add event listeners to action buttons
  document.querySelectorAll(".edit-client").forEach((button) => {
    button.addEventListener("click", () => {
      const clientId = Number.parseInt(button.getAttribute("data-id"))
      openClientModal(clientId)
    })
  })

  document.querySelectorAll(".activate-client, .deactivate-client").forEach((button) => {
    button.addEventListener("click", () => {
      const clientId = Number.parseInt(button.getAttribute("data-id"))
      toggleClientStatus(clientId)
    })
  })

  // Update checkboxes
  updateClientCheckboxes()
}

// Set up search and filter functionality
function setupClientFilters() {
  const searchInput = document.getElementById("clientSearch")
  const showInactiveCheckbox = document.getElementById("showInactiveClients")
  const postalCodeFilter = document.getElementById("postalCodeFilter")

  if (searchInput) {
    searchInput.addEventListener("input", loadClients)
  }

  if (showInactiveCheckbox) {
    showInactiveCheckbox.addEventListener("change", loadClients)
  }

  if (postalCodeFilter) {
    postalCodeFilter.addEventListener("change", loadClients)
  }
}

// Set up client selection functionality
function setupClientSelection() {
  const selectAllCheckbox = document.getElementById("selectAllClients")
  const deleteButton = document.getElementById("deleteClientsBtn")

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", () => {
      const checkboxes = document.querySelectorAll(".client-checkbox")
      checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAllCheckbox.checked
      })
      updateDeleteButton()
    })
  }

  if (deleteButton) {
    deleteButton.addEventListener("click", deleteSelectedClients)
  }

  // Event delegation for client checkboxes
  document.addEventListener("change", (event) => {
    if (event.target.classList.contains("client-checkbox")) {
      updateSelectAllCheckbox()
      updateDeleteButton()
    }
  })
}

// Update select all checkbox state
function updateSelectAllCheckbox() {
  const selectAllCheckbox = document.getElementById("selectAllClients")
  const checkboxes = document.querySelectorAll(".client-checkbox")
  const checkedCheckboxes = document.querySelectorAll(".client-checkbox:checked")

  if (selectAllCheckbox) {
    selectAllCheckbox.checked = checkboxes.length > 0 && checkboxes.length === checkedCheckboxes.length
    selectAllCheckbox.indeterminate = checkedCheckboxes.length > 0 && checkboxes.length !== checkedCheckboxes.length
  }
}

// Update delete button state
function updateDeleteButton() {
  const deleteButton = document.getElementById("deleteClientsBtn")
  const checkedCheckboxes = document.querySelectorAll(".client-checkbox:checked")

  if (deleteButton) {
    deleteButton.disabled = checkedCheckboxes.length === 0
  }
}

// Update client checkboxes
function updateClientCheckboxes() {
  document.querySelectorAll(".client-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateSelectAllCheckbox()
      updateDeleteButton()
    })
  })
}

// Delete selected clients
function deleteSelectedClients() {
  const checkedCheckboxes = document.querySelectorAll(".client-checkbox:checked")
  const clientIds = Array.from(checkedCheckboxes).map((checkbox) => {
    const row = checkbox.closest("tr")
    return Number.parseInt(row.getAttribute("data-id"))
  })

  if (clientIds.length === 0) return

  if (confirm(`Weet je zeker dat je ${clientIds.length} klant(en) wilt verwijderen?`)) {
    // In a real application, you would send a request to delete these clients
    // For this demo, we'll just remove them from the mock data
    clientIds.forEach((id) => {
      const index = mockClients.findIndex((client) => client.id === id)
      if (index !== -1) {
        mockClients.splice(index, 1)
      }
    })

    // Reload the clients list
    loadClients()
  }
}

// Toggle client active status
function toggleClientStatus(clientId) {
  const client = mockClients.find((c) => c.id === clientId)
  if (!client) return

  client.active = !client.active
  loadClients()
}

// Set up client modal functionality
function setupClientModal() {
  const modal = document.getElementById("clientModal")
  const openModalButton = document.querySelector(".btn-primary")
  const closeModalButton = document.getElementById("closeClientModal")
  const cancelButton = document.getElementById("cancelClient")
  const form = document.getElementById("clientForm")

  if (openModalButton) {
    openModalButton.addEventListener("click", () => openClientModal())
  }

  if (closeModalButton) {
    closeModalButton.addEventListener("click", closeClientModal)
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", closeClientModal)
  }

  if (form) {
    form.addEventListener("submit", handleClientFormSubmit)
  }

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeClientModal()
    }
  })
}

// Open client modal
function openClientModal(clientId = null) {
  const modal = document.getElementById("clientModal")
  const modalTitle = document.getElementById("clientModalTitle")
  const form = document.getElementById("clientForm")
  const nameInput = document.getElementById("clientName")
  const emailInput = document.getElementById("clientEmail")
  const phoneInput = document.getElementById("clientPhone")
  const addressInput = document.getElementById("clientAddress")
  const postalCodeInput = document.getElementById("clientPostalCode")
  const familySizeInput = document.getElementById("clientFamilySize")
  const dietPorkCheckbox = document.getElementById("dietPork")
  const dietVegetarianCheckbox = document.getElementById("dietVegetarian")
  const dietGlutenCheckbox = document.getElementById("dietGluten")
  const dietLactoseCheckbox = document.getElementById("dietLactose")
  const activeCheckbox = document.getElementById("clientActive")

  if (!modal || !form) return

  // Reset form
  form.reset()

  // Set form data if editing an existing client
  if (clientId) {
    const client = mockClients.find((c) => c.id === clientId)
    if (client) {
      modalTitle.textContent = "Klant bewerken"
      nameInput.value = client.name
      emailInput.value = client.email
      phoneInput.value = client.phone
      addressInput.value = client.address
      postalCodeInput.value = client.postalCode
      familySizeInput.value = client.familySize

      // Set dietary restrictions
      dietPorkCheckbox.checked = client.dietaryRestrictions.includes("Geen varkensvlees")
      dietVegetarianCheckbox.checked = client.dietaryRestrictions.includes("Vegetarisch")
      dietGlutenCheckbox.checked = client.dietaryRestrictions.includes("Glutenvrij")
      dietLactoseCheckbox.checked = client.dietaryRestrictions.includes("Lactose-intolerant")

      activeCheckbox.checked = client.active
      form.setAttribute("data-id", clientId)
    }
  } else {
    modalTitle.textContent = "Klant toevoegen"
    form.removeAttribute("data-id")
  }

  // Show modal
  modal.classList.add("active")
}

// Close client modal
function closeClientModal() {
  const modal = document.getElementById("clientModal")
  if (modal) {
    modal.classList.remove("active")
  }
}

// Handle client form submission
function handleClientFormSubmit(event) {
  event.preventDefault()

  const form = event.target
  const clientId = form.getAttribute("data-id")
  const nameInput = document.getElementById("clientName")
  const emailInput = document.getElementById("clientEmail")
  const phoneInput = document.getElementById("clientPhone")
  const addressInput = document.getElementById("clientAddress")
  const postalCodeInput = document.getElementById("clientPostalCode")
  const familySizeInput = document.getElementById("clientFamilySize")
  const dietPorkCheckbox = document.getElementById("dietPork")
  const dietVegetarianCheckbox = document.getElementById("dietVegetarian")
  const dietGlutenCheckbox = document.getElementById("dietGluten")
  const dietLactoseCheckbox = document.getElementById("dietLactose")
  const activeCheckbox = document.getElementById("clientActive")

  // Validate form
  if (
    !nameInput.value ||
    !emailInput.value ||
    !phoneInput.value ||
    !addressInput.value ||
    !postalCodeInput.value ||
    !familySizeInput.value
  ) {
    alert("Vul alle verplichte velden in.")
    return
  }

  // Collect dietary restrictions
  const dietaryRestrictions = []
  if (dietPorkCheckbox.checked) dietaryRestrictions.push("Geen varkensvlees")
  if (dietVegetarianCheckbox.checked) dietaryRestrictions.push("Vegetarisch")
  if (dietGlutenCheckbox.checked) dietaryRestrictions.push("Glutenvrij")
  if (dietLactoseCheckbox.checked) dietaryRestrictions.push("Lactose-intolerant")

  // Create client data
  const clientData = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    address: addressInput.value,
    postalCode: postalCodeInput.value,
    familySize: Number.parseInt(familySizeInput.value),
    dietaryRestrictions,
    active: activeCheckbox.checked,
  }

  if (clientId) {
    // Update existing client
    const index = mockClients.findIndex((c) => c.id === Number.parseInt(clientId))
    if (index !== -1) {
      mockClients[index] = { ...mockClients[index], ...clientData }
    }
  } else {
    // Add new client
    const newId = Math.max(...mockClients.map((c) => c.id), 0) + 1
    mockClients.push({ id: newId, ...clientData })
  }

  // Close modal and reload clients
  closeClientModal()
  loadClients()
}

// Add additional CSS for clients page
function addClientStyles() {
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
    
    .diet-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }
    
    .diet-tag {
      background-color: var(--muted);
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
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
    
    .font-medium {
      font-weight: 500;
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

// Initialize clients page
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("klanten.html")) {
    addClientStyles()
    initClientsPage()
  }
})
