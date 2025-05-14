// Products management functionality

document.addEventListener("DOMContentLoaded", () => {
  // Mock authentication and user data for demonstration
  function requireAuth() {
    // In a real application, this would check for a valid session or token
    // and redirect to the login page if not authenticated.
    console.log("Authentication check (mock)")
  }

  function getCurrentUser() {
    // In a real application, this would retrieve the current user's data
    // from a session, token, or database.
    return {
      role: "directie", // Default role for demonstration
    }
  }

  // Require authentication
  requireAuth()

  // Get current user
  const user = getCurrentUser()

  // Initialize products data in localStorage if not exists
  if (!localStorage.getItem("products")) {
    const initialProducts = [
      {
        id: 1,
        naam: "Melk (halfvol)",
        categorie: "zuivel",
        ean: "8710624000585",
        voorraad: 25,
        dieetwensen: ["vegetarisch"],
      },
      {
        id: 2,
        naam: "Brood (volkoren)",
        categorie: "bakkerij",
        ean: "8710624000592",
        voorraad: 15,
        dieetwensen: ["vegetarisch", "veganistisch"],
      },
      {
        id: 3,
        naam: "Appels (Elstar)",
        categorie: "aardappelen",
        ean: "8710624000608",
        voorraad: 50,
        dieetwensen: ["vegetarisch", "veganistisch"],
      },
      {
        id: 4,
        naam: "Gehakt (half-om-half)",
        categorie: "kaas",
        ean: "8710624000615",
        voorraad: 10,
        dieetwensen: [],
      },
      {
        id: 5,
        naam: "Pasta (spaghetti)",
        categorie: "pasta",
        ean: "8710624000622",
        voorraad: 30,
        dieetwensen: ["vegetarisch", "veganistisch"],
      },
    ]
    localStorage.setItem("products", JSON.stringify(initialProducts))
  }

  // Load products
  loadProducts()

  // Add event listeners
  const addProductBtn = document.getElementById("add-product")
  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => {
      openProductModal()
    })
  }

  const removeProductBtn = document.getElementById("remove-product")
  if (removeProductBtn) {
    // Only show remove button for directie
    if (user.role !== "directie") {
      removeProductBtn.style.display = "none"
    } else {
      removeProductBtn.addEventListener("click", () => {
        removeSelectedProducts()
      })
    }
  }

  const selectAllProductsCheckbox = document.getElementById("select-all-products")
  if (selectAllProductsCheckbox) {
    selectAllProductsCheckbox.addEventListener("change", () => {
      const checkboxes = document.querySelectorAll(".product-checkbox")
      checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAllProductsCheckbox.checked
      })
    })
  }

  const sortBySelect = document.getElementById("sort-by")
  if (sortBySelect) {
    sortBySelect.addEventListener("change", () => {
      loadProducts()
    })
  }

  const searchInput = document.getElementById("search-products")
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      loadProducts()
    })
  }

  const categoryLinks = document.querySelectorAll("#categories-list a")
  if (categoryLinks) {
    categoryLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        // Remove active class from all links
        categoryLinks.forEach((l) => l.classList.remove("bg-green-100", "text-green-800"))
        // Add active class to clicked link
        link.classList.add("bg-green-100", "text-green-800")
        // Filter products by category
        loadProducts(link.getAttribute("data-category"))
      })
    })
  }

  const dietFilters = document.querySelectorAll("#filter-geen-varkensvlees, #filter-veganistisch, #filter-vegetarisch")
  if (dietFilters) {
    dietFilters.forEach((filter) => {
      filter.addEventListener("change", () => {
        loadProducts()
      })
    })
  }

  // Product modal form
  const productForm = document.getElementById("product-form")
  if (productForm) {
    productForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveProduct()
    })
  }

  const cancelProductBtn = document.getElementById("cancel-product")
  if (cancelProductBtn) {
    cancelProductBtn.addEventListener("click", () => {
      closeProductModal()
    })
  }

  const closeModalBtn = document.getElementById("close-modal")
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      closeProductModal()
    })
  }

  // Functions
  function loadProducts(category = "all") {
    const products = JSON.parse(localStorage.getItem("products")) || []
    const tableBody = document.getElementById("products-table-body")
    const sortBy = document.getElementById("sort-by").value
    const searchTerm = document.getElementById("search-products").value.toLowerCase()

    // Get diet filters
    const filterGeenVarkensvlees = document.getElementById("filter-geen-varkensvlees")?.checked || false
    const filterVeganistisch = document.getElementById("filter-veganistisch")?.checked || false
    const filterVegetarisch = document.getElementById("filter-vegetarisch")?.checked || false

    // Filter and sort products
    let filteredProducts = products

    // Filter by category
    if (category !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.categorie === category)
    }

    // Filter by search term
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(
        (product) => product.naam.toLowerCase().includes(searchTerm) || product.ean.toLowerCase().includes(searchTerm),
      )
    }

    // Filter by diet
    if (filterGeenVarkensvlees || filterVeganistisch || filterVegetarisch) {
      filteredProducts = filteredProducts.filter((product) => {
        if (filterGeenVarkensvlees && !product.dieetwensen.includes("geen-varkensvlees")) {
          return false
        }
        if (filterVeganistisch && !product.dieetwensen.includes("veganistisch")) {
          return false
        }
        if (filterVegetarisch && !product.dieetwensen.includes("vegetarisch")) {
          return false
        }
        return true
      })
    }

    // Sort products
    filteredProducts.sort((a, b) => {
      switch (sortBy) {
        case "naam":
          return a.naam.localeCompare(b.naam)
        case "categorie":
          return a.categorie.localeCompare(b.categorie)
        case "ean":
          return a.ean.localeCompare(b.ean)
        case "voorraad":
          return a.voorraad - b.voorraad
        default:
          return 0
      }
    })

    // Clear table
    tableBody.innerHTML = ""

    // Add products to table
    filteredProducts.forEach((product) => {
      const row = document.createElement("tr")

      // Get category display name
      const categoryDisplayNames = {
        aardappelen: "Aardappelen, groente en fruit",
        kaas: "Kaas en vleeswaren",
        zuivel: "Zuivel, plantaardig en eieren",
        bakkerij: "Bakkerij en banket",
        frisdrank: "Frisdrank, sappen, koffie en thee",
        pasta: "Pasta, rijst en wereldkeuken",
        soepen: "Soepen, sauzen, kruiden en olie",
        snoep: "Snoep, koek, chips en chocolade",
        baby: "Baby, verzorging en hygiëne",
      }

      row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" class="product-checkbox focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" data-id="${product.id}">
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${product.naam}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${categoryDisplayNames[product.categorie] || product.categorie}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.ean}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.voorraad}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="edit-product text-green-600 hover:text-green-900" data-id="${product.id}">Wijzig</button>
                </td>
            `

      tableBody.appendChild(row)
    })

    // Add event listeners to edit buttons
    const editButtons = document.querySelectorAll(".edit-product")
    editButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productId = Number.parseInt(button.getAttribute("data-id"))
        openProductModal(productId)
      })
    })
  }

  function openProductModal(productId = null) {
    const modal = document.getElementById("product-modal")
    const modalTitle = document.getElementById("modal-title")
    const productForm = document.getElementById("product-form")
    const productIdInput = document.getElementById("product-id")

    // Clear form
    productForm.reset()

    if (productId) {
      // Edit existing product
      modalTitle.textContent = "Product wijzigen"

      // Get product data
      const products = JSON.parse(localStorage.getItem("products")) || []
      const product = products.find((p) => p.id === productId)

      if (product) {
        // Fill form with product data
        productIdInput.value = product.id
        document.getElementById("product-naam").value = product.naam
        document.getElementById("product-categorie").value = product.categorie
        document.getElementById("product-ean").value = product.ean
        document.getElementById("product-voorraad").value = product.voorraad

        // Set diet checkboxes
        document.getElementById("product-geen-varkensvlees").checked = product.dieetwensen.includes("geen-varkensvlees")
        document.getElementById("product-veganistisch").checked = product.dieetwensen.includes("veganistisch")
        document.getElementById("product-vegetarisch").checked = product.dieetwensen.includes("vegetarisch")
      }
    } else {
      // Add new product
      modalTitle.textContent = "Product toevoegen"
      productIdInput.value = ""
    }

    // Show modal
    modal.classList.remove("hidden")
    modal.classList.add("flex")
  }

  function closeProductModal() {
    const modal = document.getElementById("product-modal")
    modal.classList.add("hidden")
    modal.classList.remove("flex")
  }

  function saveProduct() {
    const productId = document.getElementById("product-id").value
    const productNaam = document.getElementById("product-naam").value
    const productCategorie = document.getElementById("product-categorie").value
    const productEan = document.getElementById("product-ean").value
    const productVoorraad = Number.parseInt(document.getElementById("product-voorraad").value)

    // Get diet checkboxes
    const dieetwensen = []
    if (document.getElementById("product-geen-varkensvlees").checked) {
      dieetwensen.push("geen-varkensvlees")
    }
    if (document.getElementById("product-veganistisch").checked) {
      dieetwensen.push("veganistisch")
    }
    if (document.getElementById("product-vegetarisch").checked) {
      dieetwensen.push("vegetarisch")
    }

    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem("products")) || []

    if (productId) {
      // Update existing product
      const index = products.findIndex((p) => p.id === Number.parseInt(productId))
      if (index !== -1) {
        products[index] = {
          ...products[index],
          naam: productNaam,
          categorie: productCategorie,
          ean: productEan,
          voorraad: productVoorraad,
          dieetwensen: dieetwensen,
        }
      }
    } else {
      // Add new product
      const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1
      products.push({
        id: newId,
        naam: productNaam,
        categorie: productCategorie,
        ean: productEan,
        voorraad: productVoorraad,
        dieetwensen: dieetwensen,
      })
    }

    // Save to localStorage
    localStorage.setItem("products", JSON.stringify(products))

    // Close modal and reload products
    closeProductModal()
    loadProducts()
  }

  function removeSelectedProducts() {
    // Only directie can remove products
    if (user.role !== "directie") {
      alert("U heeft geen rechten om producten te verwijderen.")
      return
    }

    const checkboxes = document.querySelectorAll(".product-checkbox:checked")
    if (checkboxes.length === 0) {
      alert("Selecteer eerst producten om te verwijderen.")
      return
    }

    if (confirm(`Weet u zeker dat u ${checkboxes.length} product(en) wilt verwijderen?`)) {
      const products = JSON.parse(localStorage.getItem("products")) || []
      const productIds = Array.from(checkboxes).map((cb) => Number.parseInt(cb.getAttribute("data-id")))

      // Filter out selected products
      const filteredProducts = products.filter((product) => !productIds.includes(product.id))

      // Save to localStorage
      localStorage.setItem("products", JSON.stringify(filteredProducts))

      // Reload products
      loadProducts()
    }
  }
})
