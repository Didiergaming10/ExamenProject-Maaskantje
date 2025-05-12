// Suppliers functionality

// Mock data for suppliers
const mockSuppliers = [
  {
    id: 1,
    name: "Supermarkt Hoogvliet",
    address: "Hoofdstraat 123, 5473 AB Maaskantje",
    contactName: "Peter Janssen",
    email: "p.janssen@hoogvliet.nl",
    phone: "06-12345678",
    nextDelivery: "2025-05-15",
    products: ["Aardappelen", "Melk", "Brood"],
  },
  {
    id: 2,
    name: "Bakkerij Van Doorn",
    address: "Kerkstraat 45, 5473 CD Maaskantje",
    contactName: "Lisa van Doorn",
    email: "info@bakkerijvandoorn.nl",
    phone: "06-23456789",
    nextDelivery: "2025-05-18",
    products: ["Brood", "Koekjes", "Taart"],
  },
  {
    id: 3,
    name: "Groenteboer Jansen",
    address: "Marktplein 7, 5473 EF Maaskantje",
    contactName: "Kees Jansen",
    email: "kees@groenteboerjansen.nl",
    phone: "06-34567890",
    nextDelivery: "2025-05-20",
    products: ["Aardappelen", "Appels", "Wortels"],
  },
  {
    id: 4,
    name: "Zuivelboer De Wit",
    address: "Boerenweg 12, 5473 GH Maaskantje",
    contactName: "Jan de Wit",
    email: "jan@zuivelboerdewit.nl",
    phone: "06-45678901",
    nextDelivery: "2025-05-22",
    products: ["Melk", "Kaas", "Yoghurt"],
  },
  {
    id: 5,
    name: "Slagerij Van Vliet",
    address: "Dorpsstraat 34, 5473 IJ Maaskantje",
    contactName: "Henk van Vliet",
    email: "info@slagerijvanvliet.nl",
    phone: "06-56789012",
    nextDelivery: "2025-05-25",
    products: ["Gehakt", "Kipfilet", "Worst"],
  },
  {
    id: 6,
    name: "Albert Heijn",
    address: "Winkelcentrum 1, 5473 KL Maaskantje",
    contactName: "Sandra Bakker",
    email: "s.bakker@ah.nl",
    phone: "06-67890123",
    nextDelivery: "2025-05-28",
    products: ["Diverse producten"],
  },
]

// Mock getCurrentUser function (replace with actual implementation)
function getCurrentUser() {
  return { role: "directie" } // Example: User with 'directie' role
}

// Mock formatDate function (replace with actual implementation)
function formatDate(dateString) {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

// Initialize suppliers page
function initSuppliersPage() {
  const user = getCurrentUser()
  if (!user) return

  // Set up action buttons based on user role
  setupSupplierActions(user.role)

  // Load suppliers
  loadSuppliers()

  // Set up search functionality
  setupSupplierSearch()
}

// Set up supplier action buttons based on user role
function setupSupplierActions(role) {
  const supplierActions = document.getElementById("supplierActions")
  if (!supplierActions) return

  if (role === "directie") {
    supplierActions.innerHTML = `
      <button class="btn btn-primary">
        <i class="bi bi-plus"></i>
        Toevoegen
      </button>
    `
  }
}

// Load suppliers with filtering
function loadSuppliers(searchTerm = "") {
  const supplierList = document.getElementById("supplierList")
  if (!supplierList) return

  // Filter suppliers
  const filteredSuppliers = mockSuppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Render suppliers
  supplierList.innerHTML = filteredSuppliers
    .map(
      (supplier) => `
    <div class="card">
      <div class="card-header">
        <h3>${supplier.name}</h3>
      </div>
      <div class="card-content">
        <div class="supplier-info">
          <div>
            <p class="text-sm text-muted">Adres</p>
            <p>${supplier.address}</p>
          </div>
          <div>
            <p class="text-sm text-muted">Contact</p>
            <p>${supplier.contactName}</p>
            <p class="text-sm">${supplier.email}</p>
            <p class="text-sm">${supplier.phone}</p>
          </div>
          <div>
            <p class="text-sm text-muted">Volgende levering</p>
            <p>${formatDate(supplier.nextDelivery)}</p>
          </div>
          <div>
            <p class="text-sm text-muted">Product(en)</p>
            <ul class="product-list">
              ${supplier.products.map((product) => `<li>${product}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-outline btn-sm">Wijzig</button>
      </div>
    </div>
  `,
    )
    .join("")
}

// Set up supplier search functionality
function setupSupplierSearch() {
  const searchInput = document.getElementById("supplierSearch")
  if (!searchInput) return

  searchInput.addEventListener("input", () => {
    loadSuppliers(searchInput.value)
  })
}

// Add additional CSS for suppliers
function addSupplierStyles() {
  const style = document.createElement("style")
  style.textContent = `
    .supplier-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .product-list {
      list-style-type: disc;
      margin-left: 1.5rem;
      font-size: 0.875rem;
    }
  `
  document.head.appendChild(style)
}

// Initialize suppliers page
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("leveranciers.html")) {
    addSupplierStyles()
    initSuppliersPage()
  }
})
