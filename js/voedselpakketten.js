// Voedselpakketten management functionality

document.addEventListener("DOMContentLoaded", () => {
  // Mock authentication and user for demonstration purposes
  const requireAuth = () => {
    // In a real application, this would check for a valid session/token
    console.log("Authentication check (mock)")
    // Redirect to login page if not authenticated
    // window.location.href = '/login';
  }

  const getCurrentUser = () => {
    // In a real application, this would retrieve the user from session/token
    return {
      id: 1,
      name: "Test User",
    }
  }

  // Require authentication
  requireAuth()

  // Get current user
  const user = getCurrentUser()

  // Initialize voedselpakketten data in localStorage if not exists
  if (!localStorage.getItem("voedselpakketten")) {
    const initialPakketten = [
      {
        id: 1,
        gezinId: 1,
        gezinNaam: "Familie Jansen",
        datum: new Date().toISOString().split("T")[0],
        status: "afgeleverd",
        items: [
          { productId: 1, productNaam: "Melk (halfvol)", categorie: "zuivel", aantal: 2 },
          { productId: 2, productNaam: "Brood (volkoren)", categorie: "bakkerij", aantal: 1 },
          { productId: 3, productNaam: "Appels (Elstar)", categorie: "aardappelen", aantal: 5 },
        ],
      },
      {
        id: 2,
        gezinId: 2,
        gezinNaam: "Familie Pietersen",
        datum: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        status: "in verwerking",
        items: [
          { productId: 1, productNaam: "Melk (halfvol)", categorie: "zuivel", aantal: 3 },
          { productId: 4, productNaam: "Gehakt (half-om-half)", categorie: "kaas", aantal: 1 },
          { productId: 5, productNaam: "Pasta (spaghetti)", categorie: "pasta", aantal: 2 },
        ],
      },
    ]
    localStorage.setItem("voedselpakketten", JSON.stringify(initialPakketten))
  }

  // Load voedselpakketten
  loadVoedselpakketten()

  // Add event listeners
  const createPakketBtn = document.getElementById("create-pakket")
  if (createPakketBtn) {
    createPakketBtn.addEventListener("click", () => {
      openPakketModal()
    })
  }

  const searchInput = document.getElementById("search-pakketten")
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      loadVoedselpakketten()
    })
  }

  // Pakket modal form
  const pakketForm = document.getElementById("pakket-form")
  if (pakketForm) {
    pakketForm.addEventListener("submit", (e) => {
      e.preventDefault()
      savePakket()
    })
  }

  const cancelPakketBtn = document.getElementById("cancel-pakket")
  if (cancelPakketBtn) {
    cancelPakketBtn.addEventListener("click", () => {
      closePakketModal()
    })
  }

  const closeModalBtn = document.getElementById("close-modal")
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      closePakketModal()
    })
  }

  // Gezin select
  const gezinSelect = document.getElementById("gezin-select")
  if (gezinSelect) {
    // Load gezinnen
    const gezinnen = JSON.parse(localStorage.getItem("gezinnen")) || []

    // Add options to select
    gezinnen.forEach((gezin) => {
      const option = document.createElement("option")
      option.value = gezin.id || gezinnen.indexOf(gezin) + 1
      option.textContent = gezin.naam
      gezinSelect.appendChild(option)
    })

    // Add event listener
    gezinSelect.addEventListener("change", () => {
      const gezinId = Number.parseInt(gezinSelect.value)
      if (gezinId) {
        showGezinInfo(gezinId)
      } else {
        document.getElementById("gezin-info").classList.add("hidden")
      }
    })
  }

  // Product search
  const productSearch = document.getElementById("product-search")
  if (productSearch) {
    productSearch.addEventListener("input", () => {
      const searchTerm = productSearch.value.toLowerCase()
      if (searchTerm.length >= 2) {
        searchProducts(searchTerm)
      } else {
        document.getElementById("product-search-results").classList.add("hidden")
      }
    })
  }

  // Functions
  function loadVoedselpakketten() {
    const pakketten = JSON.parse(localStorage.getItem("voedselpakketten")) || []
    const container = document.getElementById("pakketten-container")
    const searchTerm = document.getElementById("search-pakketten")?.value.toLowerCase() || ""

    // Filter pakketten by search term
    let filteredPakketten = pakketten
    if (searchTerm) {
      filteredPakketten = pakketten.filter(
        (pakket) =>
          pakket.gezinNaam.toLowerCase().includes(searchTerm) ||
          pakket.items.some((item) => item.productNaam.toLowerCase().includes(searchTerm)),
      )
    }

    // Clear container
    container.innerHTML = ""

    // Add pakketten to container
    filteredPakketten.forEach((pakket) => {
      const card = document.createElement("div")
      card.className = "bg-white p-4 rounded-lg shadow"

      // Get status badge class
      let statusBadgeClass = ""
      switch (pakket.status) {
        case "afgeleverd":
          statusBadgeClass = "bg-green-100 text-green-800"
          break
        case "in verwerking":
          statusBadgeClass = "bg-yellow-100 text-yellow-800"
          break
        default:
          statusBadgeClass = "bg-gray-100 text-gray-800"
      }

      card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-semibold">${pakket.gezinNaam}</h3>
                        <p class="text-sm text-gray-500">${formatDate(pakket.datum)}</p>
                    </div>
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadgeClass}">
                        ${pakket.status}
                    </span>
                </div>
                <div class="mb-4">
                    <p class="text-sm text-gray-500">Inhoud (${pakket.items.length} producten):</p>
                    <ul class="list-disc pl-5 mt-2">
                        ${pakket.items
                          .slice(0, 3)
                          .map((item) => `<li>${item.aantal}x ${item.productNaam}</li>`)
                          .join("")}
                        ${pakket.items.length > 3 ? `<li>... en ${pakket.items.length - 3} meer</li>` : ""}
                    </ul>
                </div>
                <div class="flex justify-end">
                    <button class="view-pakket px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500" data-id="${pakket.id}">
                        Bekijken
                    </button>
                </div>
            `

      container.appendChild(card)
    })

    // Add event listeners to view buttons
    const viewButtons = document.querySelectorAll(".view-pakket")
    viewButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const pakketId = Number.parseInt(button.getAttribute("data-id"))
        openPakketModal(pakketId)
      })
    })
  }

  function openPakketModal(pakketId = null) {
    const modal = document.getElementById("pakket-modal")
    const modalTitle = document.getElementById("modal-title")
    const pakketForm = document.getElementById("pakket-form")
    const pakketIdInput = document.getElementById("pakket-id")
    const pakketItems = document.getElementById("pakket-items")

    // Clear form
    pakketForm.reset()
    pakketItems.innerHTML = ""

    if (pakketId) {
      // View/edit existing pakket
      modalTitle.textContent = "Voedselpakket bekijken"

      // Get pakket data
      const pakketten = JSON.parse(localStorage.getItem("voedselpakketten")) || []
      const pakket = pakketten.find((p) => p.id === pakketId)

      if (pakket) {
        // Fill form with pakket data
        pakketIdInput.value = pakket.id
        document.getElementById("gezin-select").value = pakket.gezinId

        // Show gezin info
        showGezinInfo(pakket.gezinId)

        // Add items to table
        pakket.items.forEach((item) => {
          addItemToTable(item)
        })
      }
    } else {
      // Create new pakket
      modalTitle.textContent = "Voedselpakket samenstellen"
      pakketIdInput.value = ""
    }

    // Show modal
    modal.classList.remove("hidden")
    modal.classList.add("flex")
  }

  function closePakketModal() {
    const modal = document.getElementById("pakket-modal")
    modal.classList.add("hidden")
    modal.classList.remove("flex")
  }

  function showGezinInfo(gezinId) {
    const gezinnen = JSON.parse(localStorage.getItem("gezinnen")) || []
    const gezin = gezinnen.find((g) => g.id === gezinId || gezinnen.indexOf(g) + 1 === gezinId)

    if (gezin) {
      const gezinInfo = document.getElementById("gezin-info")
      const gezinNaam = document.getElementById("gezin-naam")
      const gezinLeden = document.getElementById("gezin-leden")
      const gezinDieetwensen = document.getElementById("gezin-dieetwensen")

      gezinNaam.textContent = `Naam: ${gezin.naam}`
      gezinLeden.textContent = `Aantal leden: ${gezin.gezinsleden ? gezin.gezinsleden.length + 1 : 1}`

      // Clear dieetwensen
      gezinDieetwensen.innerHTML = ""

      // Add dieetwensen
      if (gezin.dieetwensen && gezin.dieetwensen.length > 0) {
        gezin.dieetwensen.forEach((wens) => {
          const li = document.createElement("li")
          li.textContent = wens
          gezinDieetwensen.appendChild(li)
        })

        if (gezin.allergenen) {
          const li = document.createElement("li")
          li.textContent = `Allergieën: ${gezin.allergenen}`
          gezinDieetwensen.appendChild(li)
        }
      } else {
        const li = document.createElement("li")
        li.textContent = "Geen specifieke dieetwensen"
        gezinDieetwensen.appendChild(li)
      }

      gezinInfo.classList.remove("hidden")
    }
  }

  function searchProducts(searchTerm) {
    const products = JSON.parse(localStorage.getItem("products")) || []
    const resultsContainer = document.getElementById("product-search-results")
    const resultsList = resultsContainer.querySelector("ul")

    // Filter products by search term
    const filteredProducts = products.filter(
      (product) => product.naam.toLowerCase().includes(searchTerm) || product.ean.toLowerCase().includes(searchTerm),
    )

    // Clear results
    resultsList.innerHTML = ""

    // Add products to results
    filteredProducts.forEach((product) => {
      const li = document.createElement("li")
      li.className = "px-4 py-2 hover:bg-gray-100 cursor-pointer"
      li.innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-medium">${product.naam}</p>
                        <p class="text-sm text-gray-500">EAN: ${product.ean}</p>
                    </div>
                    <span class="text-sm text-gray-500">Voorraad: ${product.voorraad}</span>
                </div>
            `

      // Add event listener
      li.addEventListener("click", () => {
        addProductToPakket(product)
        resultsContainer.classList.add("hidden")
        document.getElementById("product-search").value = ""
      })

      resultsList.appendChild(li)
    })

    // Show results
    resultsContainer.classList.remove("hidden")
  }

  function addProductToPakket(product) {
    // Check if product is already in pakket
    const pakketItems = document.getElementById("pakket-items")
    const existingItem = pakketItems.querySelector(`[data-product-id="${product.id}"]`)

    if (existingItem) {
      // Increment aantal
      const aantalCell = existingItem.querySelector(".product-aantal")
      const aantalInput = aantalCell.querySelector("input")
      aantalInput.value = Number.parseInt(aantalInput.value) + 1
    } else {
      // Add new item
      const item = {
        productId: product.id,
        productNaam: product.naam,
        categorie: product.categorie,
        aantal: 1,
      }

      addItemToTable(item)
    }
  }

  function addItemToTable(item) {
    const pakketItems = document.getElementById("pakket-items")
    const row = document.createElement("tr")
    row.setAttribute("data-product-id", item.productId)

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
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${item.productNaam}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${categoryDisplayNames[item.categorie] || item.categorie}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 product-aantal">
                <div class="flex items-center">
                    <button type="button" class="decrement-aantal px-2 py-1 border border-gray-300 rounded-l-md">-</button>
                    <input type="number" value="${item.aantal}" min="1" class="w-12 text-center border-t border-b border-gray-300">
                    <button type="button" class="increment-aantal px-2 py-1 border border-gray-300 rounded-r-md">+</button>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button type="button" class="remove-item text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `

    // Add event listeners
    const decrementBtn = row.querySelector(".decrement-aantal")
    const incrementBtn = row.querySelector(".increment-aantal")
    const removeBtn = row.querySelector(".remove-item")
    const aantalInput = row.querySelector("input")

    decrementBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(aantalInput.value)
      if (currentValue > 1) {
        aantalInput.value = currentValue - 1
      }
    })

    incrementBtn.addEventListener("click", () => {
      aantalInput.value = Number.parseInt(aantalInput.value) + 1
    })

    removeBtn.addEventListener("click", () => {
      row.remove()
    })

    pakketItems.appendChild(row)
  }

  function savePakket() {
    const pakketId = document.getElementById("pakket-id").value
    const gezinId = Number.parseInt(document.getElementById("gezin-select").value)
    const gezinNaam =
      document.getElementById("gezin-select").options[document.getElementById("gezin-select").selectedIndex].text

    // Get items from table
    const items = []
    document.querySelectorAll("#pakket-items tr").forEach((row) => {
      const productId = Number.parseInt(row.getAttribute("data-product-id"))
      const productNaam = row.querySelector("td:first-child").textContent.trim()
      const categorie = row.querySelector("td:nth-child(2)").textContent.trim()
      const aantal = Number.parseInt(row.querySelector("input").value)

      items.push({
        productId,
        productNaam,
        categorie,
        aantal,
      })
    })

    // Validate
    if (!gezinId) {
      alert("Selecteer een gezin.")
      return
    }

    if (items.length === 0) {
      alert("Voeg minimaal één product toe aan het pakket.")
      return
    }

    // Get pakketten from localStorage
    const pakketten = JSON.parse(localStorage.getItem("voedselpakketten")) || []

    if (pakketId) {
      // Update existing pakket
      const index = pakketten.findIndex((p) => p.id === Number.parseInt(pakketId))
      if (index !== -1) {
        pakketten[index] = {
          ...pakketten[index],
          gezinId,
          gezinNaam,
          items,
        }
      }
    } else {
      // Add new pakket
      const newId = pakketten.length > 0 ? Math.max(...pakketten.map((p) => p.id)) + 1 : 1
      pakketten.push({
        id: newId,
        gezinId,
        gezinNaam,
        datum: new Date().toISOString().split("T")[0],
        status: "in verwerking",
        items,
      })
    }

    // Save to localStorage
    localStorage.setItem("voedselpakketten", JSON.stringify(pakketten))

    // Close modal and reload pakketten
    closePakketModal()
    loadVoedselpakketten()
  }

  // Helper function to format date
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("nl-NL", options)
  }
})
