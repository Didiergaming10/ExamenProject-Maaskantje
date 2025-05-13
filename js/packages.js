// Food packages functionality

// Mock data for food packages
const mockFoodPackages = [
  {
    id: 1,
    clientName: "Familie Jansen",
    createdAt: "2025-05-08",
    status: "ready",
    pickupDate: "2025-05-14",
    products: [
      { name: "Aardappelen", quantity: 2 },
      { name: "Melk", quantity: 3 },
      { name: "Brood", quantity: 2 },
      { name: "Pasta", quantity: 1 },
      { name: "Appels", quantity: 5 },
    ],
  },
  {
    id: 2,
    clientName: "Familie De Vries",
    createdAt: "2025-05-07",
    status: "ready",
    pickupDate: "2025-05-14",
    products: [
      { name: "Aardappelen", quantity: 1 },
      { name: "Melk", quantity: 2 },
      { name: "Brood", quantity: 1 },
      { name: "Soep", quantity: 3 },
      { name: "Chocolade", quantity: 1 },
    ],
  },
  {
    id: 3,
    clientName: "Familie Bakker",
    createdAt: "2025-05-06",
    status: "pending",
    pickupDate: "2025-05-14",
    products: [
      { name: "Aardappelen", quantity: 2 },
      { name: "Kaas", quantity: 1 },
      { name: "Brood", quantity: 2 },
      { name: "Sap", quantity: 2 },
    ],
  },
]

// Mock data for products
const mockProducts = [
  { id: 1, name: "Aardappelen", category: "Groente", stock: 10 },
  { id: 2, name: "Melk", category: "Zuivel", stock: 5 },
  { id: 3, name: "Brood", category: "Bakkerij", stock: 3 },
  { id: 4, name: "Pasta", category: "Graanproducten", stock: 8 },
  { id: 5, name: "Appels", category: "Fruit", stock: 12 },
  { id: 6, name: "Soep", category: "Conserven", stock: 6 },
  { id: 7, name: "Chocolade", category: "Zoetwaren", stock: 9 },
  { id: 8, name: "Kaas", category: "Zuivel", stock: 4 },
  { id: 9, name: "Sap", category: "Dranken", stock: 7 },
]

// Mock function to get current user
function getCurrentUser() {
  return { role: "medewerker" } // Or 'klant'
}

// Mock function to format date
function formatDate(dateString) {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

// Initialize packages page
function initPackagesPage() {
  const user = getCurrentUser()
  if (!user) return

  // Adjust UI based on user role
  adjustPackageUI(user.role)

  // Load packages
  loadPackages()

  // Set up search functionality
  setupPackageSearch()

  // Load products for selection if needed
  if (user.role !== "klant") {
    loadProductSelection()
  }
}

// Adjust UI based on user role
function adjustPackageUI(role) {
  // Adjust subtitle
  const packageSubtitle = document.getElementById("packageSubtitle")
  if (packageSubtitle) {
    packageSubtitle.textContent =
      role === "klant" ? "Bekijk en stel uw voedselpakketten samen" : "Beheer de voedselpakketten voor klanten"
  }

  // Adjust new package button text
  const newPackageText = document.getElementById("newPackageText")
  if (newPackageText) {
    newPackageText.textContent = role === "klant" ? "Nieuw pakket samenstellen" : "Nieuw voedselpakket"
  }

  // Hide create tab for klant
  const createTab = document.getElementById("createTab")
  if (createTab && role === "klant") {
    createTab.style.display = "none"
  }
}

// Load packages with filtering
function loadPackages(searchTerm = "") {
  const packageList = document.getElementById("packageList")
  if (!packageList) return

  // Filter packages
  const filteredPackages = mockFoodPackages.filter((pkg) =>
    pkg.clientName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Render packages
  packageList.innerHTML = filteredPackages
    .map(
      (pkg) => `
    <div class="card">
      <div class="card-header">
        <h3>${pkg.clientName}</h3>
        <div class="flex-between">
          <span class="text-sm text-muted">Aangemaakt: ${formatDate(pkg.createdAt)}</span>
          <span class="status-badge ${pkg.status === "ready" ? "status-ready" : "status-pending"}">
            ${pkg.status === "ready" ? "Klaar" : "In behandeling"}
          </span>
        </div>
      </div>
      <div class="card-content">
        <div class="package-info">
          <div>
            <p class="text-sm text-muted">Ophalen op</p>
            <p>${formatDate(pkg.pickupDate)}</p>
          </div>
          <div>
            <p class="text-sm text-muted">Inhoud</p>
            <ul class="product-list">
              ${pkg.products
                .map(
                  (product) => `
                <li>${product.name} (${product.quantity}x)</li>
              `,
                )
                .join("")}
            </ul>
          </div>
          <div class="button-group">
            <button class="btn btn-outline btn-sm">Details</button>
            ${
              getCurrentUser().role !== "klant" && pkg.status !== "ready"
                ? '<button class="btn btn-primary btn-sm">Verwerken</button>'
                : ""
            }
          </div>
        </div>
      </div>
    </div>
  `,
    )
    .join("")
}

// Set up package search functionality
function setupPackageSearch() {
  const searchInput = document.getElementById("packageSearch")
  if (!searchInput) return

  searchInput.addEventListener("input", () => {
    loadPackages(searchInput.value)
  })
}

// Load products for selection
function loadProductSelection() {
  const productSelection = document.getElementById("productSelection")
  if (!productSelection) return

  productSelection.innerHTML = mockProducts
    .map(
      (product) => `
    <div class="card product-selection-card ${product.stock === 0 ? "out-of-stock" : ""}">
      <div class="card-content">
        <div class="product-selection-item">
          <div class="checkbox-item">
            <input type="checkbox" id="select-product-${product.id}" ${product.stock === 0 ? "disabled" : ""}>
            <div>
              <label for="select-product-${product.id}" class="font-medium">${product.name}</label>
              <p class="text-sm text-muted">${product.category}</p>
            </div>
          </div>
          <div class="text-sm">
            Voorraad: <span class="${product.stock === 0 ? "text-red" : ""}">${product.stock}</span>
          </div>
        </div>
      </div>
    </div>
  `,
    )
    .join("")

  // Add event listeners to checkboxes
  document.querySelectorAll('#productSelection input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", updateSelectedProducts)
  })
}

// Update selected products
function updateSelectedProducts() {
  const selectedProducts = document.getElementById("selectedProducts")
  if (!selectedProducts) return

  const checkedProducts = Array.from(document.querySelectorAll('#productSelection input[type="checkbox"]:checked'))

  if (checkedProducts.length === 0) {
    selectedProducts.innerHTML = '<p class="text-muted">Geen producten geselecteerd</p>'
    return
  }

  selectedProducts.innerHTML = checkedProducts
    .map((checkbox) => {
      const productId = checkbox.id.replace("select-product-", "")
      const product = mockProducts.find((p) => p.id === Number.parseInt(productId))

      if (!product) return ""

      return `
      <div class="selected-product">
        <span>${product.name}</span>
        <input type="number" min="1" max="${product.stock}" value="1" class="quantity-input">
      </div>
    `
    })
    .join("")
}

// Add additional CSS for packages
function addPackageStyles() {
  const style = document.createElement("style")
  style.textContent = `
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
    }
    
    .status-ready {
      background-color: #dcfce7;
      color: #166534;
    }
    
    .status-pending {
      background-color: #fef9c3;
      color: #854d0e;
    }
    
    .product-selection-card {
      border: 1px solid var(--border);
    }
    
    .product-selection-card.out-of-stock {
      opacity: 0.5;
    }
    
    .product-selection-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .selected-product {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }
    
    .quantity-input {
      width: 4rem;
      height: 1.75rem;
      font-size: 0.75rem;
    }
    
    .text-red {
      color: #ef4444;
    }
    
    .flex-between {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `
  document.head.appendChild(style)
}

// Initialize packages page
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("voedselpakketten.html")) {
    addPackageStyles()
    initPackagesPage()
  }
})
