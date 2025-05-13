// Products functionality

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: "Aardappelen",
    category: "Aardappelen, groente en fruit",
    ean: "8712345678901",
    stock: 25,
    expiryDate: "2025-06-15",
  },
  {
    id: 2,
    name: "Melk",
    category: "Zuivel, plantaardig en eieren",
    ean: "8712345678902",
    stock: 18,
    expiryDate: "2025-05-20",
  },
  {
    id: 3,
    name: "Brood",
    category: "Bakkerij en banket",
    ean: "8712345678903",
    stock: 12,
    expiryDate: "2025-05-14",
  },
  {
    id: 4,
    name: "Pasta",
    category: "Pasta, rijst en wereldkeuken",
    ean: "8712345678904",
    stock: 30,
    expiryDate: "2025-12-31",
  },
  {
    id: 5,
    name: "Appels",
    category: "Aardappelen, groente en fruit",
    ean: "8712345678905",
    stock: 40,
    expiryDate: "2025-05-25",
  },
  {
    id: 6,
    name: "Soep",
    category: "Soepen, sauzen, kruiden en olie",
    ean: "8712345678906",
    stock: 15,
    expiryDate: "2025-08-10",
  },
  {
    id: 7,
    name: "Chocolade",
    category: "Snoep, koek, chips en chocolade",
    ean: "8712345678907",
    stock: 8,
    expiryDate: "2025-09-15",
  },
  {
    id: 8,
    name: "Luiers",
    category: "Baby, verzorging en hygiëne",
    ean: "8712345678908",
    stock: 5,
    expiryDate: "2026-01-20",
  },
  {
    id: 9,
    name: "Kaas",
    category: "Kaas en vleeswaren",
    ean: "8712345678909",
    stock: 10,
    expiryDate: "2025-06-05",
  },
  {
    id: 10,
    name: "Sap",
    category: "Frisdrank, sappen, koffie en thee",
    ean: "8712345678910",
    stock: 22,
    expiryDate: "2025-07-12",
  },
]

// Mock categories
const categories = [
  "Aardappelen, groente en fruit",
  "Kaas en vleeswaren",
  "Zuivel, plantaardig en eieren",
  "Bakkerij en banket",
  "Frisdrank, sappen, koffie en thee",
  "Pasta, rijst en wereldkeuken",
  "Soepen, sauzen, kruiden en olie",
  "Snoep, koek, chips en chocolade",
  "Baby, verzorging en hygiëne",
]

// Mock getCurrentUser function (replace with actual implementation)
function getCurrentUser() {
  // This is a placeholder. In a real application, you would
  // retrieve the current user information from authentication context,
  // local storage, or a server-side session.
  return {
    role: "medewerker", // Or 'directie', 'klant', etc.
  }
}

// Initialize products page
function initProductsPage() {
  const user = getCurrentUser()
  if (!user) return

  // Set up action buttons based on user role
  setupProductActions(user.role)

  // Populate category filters
  populateCategoryFilters()

  // Load products
  loadProducts()

  // Set up search functionality
  setupProductSearch()
}

// Set up product action buttons based on user role
function setupProductActions(role) {
  const productActions = document.getElementById("productActions")
  if (!productActions) return

  if (role !== "klant") {
    productActions.innerHTML = `
      <button class="btn btn-primary">
        <i class="bi bi-plus"></i>
        Product toevoegen
      </button>
      ${role === "directie" ? '<button class="btn btn-outline">Verwijderen</button>' : ""}
    `
  }
}

// Populate category filters
function populateCategoryFilters() {
  const categoryFilters = document.getElementById("categoryFilters")
  if (!categoryFilters) return

  categoryFilters.innerHTML = categories
    .map(
      (category) => `
    <div class="checkbox-item">
      <input type="checkbox" id="category-${category}" data-category="${category}">
      <label for="category-${category}">${category}</label>
    </div>
  `,
    )
    .join("")

  // Add event listeners to category checkboxes
  document.querySelectorAll('#categoryFilters input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      loadProducts()
    })
  })
}

// Load products with filtering
function loadProducts() {
  const productList = document.getElementById("productList")
  const searchInput = document.getElementById("search")
  const productCount = document.getElementById("productCount")

  if (!productList || !productCount) return

  // Get search term
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : ""

  // Get selected categories
  const selectedCategories = Array.from(
    document.querySelectorAll('#categoryFilters input[type="checkbox"]:checked'),
  ).map((checkbox) => checkbox.getAttribute("data-category"))

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.ean.includes(searchTerm)

    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)

    return matchesSearch && matchesCategory
  })

  // Update product count
  productCount.textContent = `${filteredProducts.length} producten gevonden`

  // Render products
  productList.innerHTML = filteredProducts
    .map(
      (product) => `
    <div class="card product-card">
      <div class="product-grid">
        <div>
          <label class="text-xs text-muted">Naam</label>
          <p class="font-medium">${product.name}</p>
        </div>
        <div>
          <label class="text-xs text-muted">Categorie</label>
          <p>${product.category}</p>
        </div>
        <div>
          <label class="text-xs text-muted">EAN-nummer</label>
          <p>${product.ean}</p>
        </div>
        <div>
          <label class="text-xs text-muted">Voorraad</label>
          <p>${product.stock} stuks</p>
        </div>
        <div class="text-right">
          <button class="btn btn-outline btn-sm">Wijzig</button>
        </div>
      </div>
    </div>
  `,
    )
    .join("")
}

// Set up product search functionality
function setupProductSearch() {
  const searchInput = document.getElementById("search")
  if (!searchInput) return

  searchInput.addEventListener("input", () => {
    loadProducts()
  })
}

// Initialize products page
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("producten.html")) {
    initProductsPage()
  }
})
