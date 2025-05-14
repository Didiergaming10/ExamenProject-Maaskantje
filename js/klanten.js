// Klanten management functionality

document.addEventListener("DOMContentLoaded", () => {
  // Mock authentication functions (replace with your actual authentication logic)
  function requireAuth() {
    // Check if the user is authenticated (e.g., token exists in localStorage)
    if (!localStorage.getItem("token")) {
      window.location.href = "login.php" // Redirect to login page if not authenticated
    }
  }

  function getCurrentUser() {
    // Retrieve user information from localStorage (assuming it's stored there after login)
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : { role: "guest" } // Return user object or a default guest user
  }

  // Require authentication
  requireAuth()

  // Get current user
  const user = getCurrentUser()

  // Only directie can access this page
  if (user.role !== "directie") {
    window.location.href = "dashboard.php"
  }

  // Initialize klanten data in localStorage if not exists
  if (!localStorage.getItem("gezinnen")) {
    const initialGezinnen = [
      {
        id: 1,
        naam: "Familie Jansen",
        postcode: "5211AB",
        email: "jansen@example.com",
        telefoon: "0612345678",
        dieetwensen: ["vegetarisch"],
        allergenen: "Lactose",
        gezinsleden: ["12/05/2010", "23/09/2015"],
      },
      {
        id: 2,
        naam: "Familie Pietersen",
        postcode: "5212CD",
        email: "pietersen@example.com",
        telefoon: "0687654321",
        dieetwensen: ["geen-varkensvlees"],
        allergenen: "",
        gezinsleden: ["05/11/2008", "17/03/2012", "30/06/2018"],
      },
    ]
    localStorage.setItem("gezinnen", JSON.stringify(initialGezinnen))
  }

  // Load klanten
  loadKlanten()

  // Add event listeners
  const addKlantBtn = document.getElementById("add-klant")
  if (addKlantBtn) {
    addKlantBtn.addEventListener("click", () => {
      openKlantModal()
    })
  }

  const multiSelectBtn = document.getElementById("multi-select")
  if (multiSelectBtn) {
    multiSelectBtn.addEventListener("click", () => {
      toggleMultiSelect()
    })
  }

  const selectAllKlantenCheckbox = document.getElementById("select-all-klanten")
  if (selectAllKlantenCheckbox) {
    selectAllKlantenCheckbox.addEventListener("change", () => {
      const checkboxes = document.querySelectorAll(".klant-checkbox")
      checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAllKlantenCheckbox.checked
      })
    })
  }

  const searchInput = document.getElementById("search-klanten")
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      loadKlanten()
    })
  }

  // Klant modal form
  const klantForm = document.getElementById("klant-form")
  if (klantForm) {
    klantForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveKlant()
    })
  }

  const cancelKlantBtn = document.getElementById("cancel-klant")
  if (cancelKlantBtn) {
    cancelKlantBtn.addEventListener("click", () => {
      closeKlantModal()
    })
  }

  const closeModalBtn = document.getElementById("close-modal")
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      closeKlantModal()
    })
  }

  const addGezinslidBtn = document.getElementById("add-gezinslid")
  if (addGezinslidBtn) {
    addGezinslidBtn.addEventListener("click", () => {
      addGezinslid()
    })
  }

  // Functions
  function loadKlanten() {
    const gezinnen = JSON.parse(localStorage.getItem("gezinnen")) || []
    const tableBody = document.getElementById("klanten-table-body")
    const searchTerm = document.getElementById("search-klanten")?.value.toLowerCase() || ""

    // Filter gezinnen by search term
    let filteredGezinnen = gezinnen
    if (searchTerm) {
      filteredGezinnen = gezinnen.filter(
        (gezin) =>
          gezin.naam.toLowerCase().includes(searchTerm) ||
          gezin.postcode.toLowerCase().includes(searchTerm) ||
          gezin.email.toLowerCase().includes(searchTerm),
      )
    }

    // Clear table
    tableBody.innerHTML = ""

    // Add gezinnen to table
    filteredGezinnen.forEach((gezin) => {
      const row = document.createElement("tr")

      row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap hidden multi-select-col">
                    <input type="checkbox" class="klant-checkbox focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" data-id="${gezin.id}">
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${gezin.naam}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${gezin.postcode}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${gezin.email}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${gezin.telefoon}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${gezin.gezinsleden ? gezin.gezinsleden.length + 1 : 1}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="edit-klant text-green-600 hover:text-green-900" data-id="${gezin.id}">Wijzig</button>
                </td>
            `

      tableBody.appendChild(row)
    })

    // Add event listeners to edit buttons
    const editButtons = document.querySelectorAll(".edit-klant")
    editButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const klantId = Number.parseInt(button.getAttribute("data-id"))
        openKlantModal(klantId)
      })
    })
  }

  function toggleMultiSelect() {
    const multiSelectCols = document.querySelectorAll(".multi-select-col")
    multiSelectCols.forEach((col) => {
      col.classList.toggle("hidden")
    })
  }

  function openKlantModal(klantId = null) {
    const modal = document.getElementById("klant-modal")
    const modalTitle = document.getElementById("modal-title")
    const klantForm = document.getElementById("klant-form")
    const klantIdInput = document.getElementById("klant-id")
    const gezinsledenContainer = document.getElementById("gezinsleden-container")

    // Clear form
    klantForm.reset()

    // Clear gezinsleden
    gezinsledenContainer.innerHTML = '<h3 class="text-lg font-medium mb-2">Gezinsleden</h3>'

    if (klantId) {
      // Edit existing klant
      modalTitle.textContent = "Klant wijzigen"

      // Get klant data
      const gezinnen = JSON.parse(localStorage.getItem("gezinnen")) || []
      const gezin = gezinnen.find((g) => g.id === klantId)

      if (gezin) {
        // Fill form with klant data
        klantIdInput.value = gezin.id
        document.getElementById("gezin-naam").value = gezin.naam
        document.getElementById("postcode").value = gezin.postcode
        document.getElementById("email").value = gezin.email
        document.getElementById("telefoon").value = gezin.telefoon

        // Set diet checkboxes
        if (gezin.dieetwensen) {
          document.getElementById("geen-varkensvlees").checked = gezin.dieetwensen.includes("geen-varkensvlees")
          document.getElementById("veganistisch").checked = gezin.dieetwensen.includes("veganistisch")
          document.getElementById("vegetarisch").checked = gezin.dieetwensen.includes("vegetarisch")
          document.getElementById("allergisch").checked = gezin.dieetwensen.includes("allergisch")
        }

        // Set allergenen
        if (gezin.allergenen) {
          document.getElementById("allergenen").value = gezin.allergenen
        }

        // Add gezinsleden
        if (gezin.gezinsleden && gezin.gezinsleden.length > 0) {
          gezin.gezinsleden.forEach((lid) => {
            addGezinslid(lid)
          })
        }
      }
    } else {
      // Add new klant
      modalTitle.textContent = "Klant toevoegen"
      klantIdInput.value = ""
    }

    // Show modal
    modal.classList.remove("hidden")
    modal.classList.add("flex")
  }

  function closeKlantModal() {
    const modal = document.getElementById("klant-modal")
    modal.classList.add("hidden")
    modal.classList.remove("flex")
  }

  function addGezinslid(geboortedatum = "") {
    const gezinsledenContainer = document.getElementById("gezinsleden-container")
    const gezinslidItem = document.createElement("div")
    gezinslidItem.className = "gezinslid-item border p-4 rounded-md mb-4"

    // Parse geboortedatum if provided
    let dag = "",
      maand = "",
      jaar = ""
    if (geboortedatum) {
      const parts = geboortedatum.split("/")
      if (parts.length === 3) {
        dag = parts[0]
        maand = parts[1]
        jaar = parts[2]
      }
    }

    gezinslidItem.innerHTML = `
            <div class="grid grid-cols-3 gap-4 mb-2">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Geboortedatum</label>
                    <div class="grid grid-cols-3 gap-2">
                        <input type="text" placeholder="DD" maxlength="2" value="${dag}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        <input type="text" placeholder="MM" maxlength="2" value="${maand}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        <input type="text" placeholder="JJJJ" maxlength="4" value="${jaar}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    </div>
                </div>
            </div>
            <button type="button" class="remove-gezinslid text-red-600 hover:text-red-900">
                <i class="fas fa-trash"></i> Verwijderen
            </button>
        `

    // Add event listener for removing gezinslid
    const removeBtn = gezinslidItem.querySelector(".remove-gezinslid")
    removeBtn.addEventListener("click", () => {
      gezinslidItem.remove()
    })

    // Add to container
    gezinsledenContainer.appendChild(gezinslidItem)
  }

  function saveKlant() {
    const klantId = document.getElementById("klant-id").value
    const gezinNaam = document.getElementById("gezin-naam").value
    const postcode = document.getElementById("postcode").value
    const email = document.getElementById("email").value
    const telefoon = document.getElementById("telefoon").value

    // Get dieetwensen
    const dieetwensen = []
    if (document.getElementById("geen-varkensvlees").checked) {
      dieetwensen.push("geen-varkensvlees")
    }
    if (document.getElementById("veganistisch").checked) {
      dieetwensen.push("veganistisch")
    }
    if (document.getElementById("vegetarisch").checked) {
      dieetwensen.push("vegetarisch")
    }
    if (document.getElementById("allergisch").checked) {
      dieetwensen.push("allergisch")
    }

    // Get allergenen
    const allergenen = document.getElementById("allergenen").value

    // Get gezinsleden
    const gezinsleden = []
    document.querySelectorAll(".gezinslid-item").forEach((item) => {
      const inputs = item.querySelectorAll("input")
      const dag = inputs[0].value
      const maand = inputs[1].value
      const jaar = inputs[2].value

      if (dag && maand && jaar) {
        gezinsleden.push(`${dag}/${maand}/${jaar}`)
      }
    })

    // Get gezinnen from localStorage
    const gezinnen = JSON.parse(localStorage.getItem("gezinnen")) || []

    if (klantId) {
      // Update existing klant
      const index = gezinnen.findIndex((g) => g.id === Number.parseInt(klantId))
      if (index !== -1) {
        gezinnen[index] = {
          ...gezinnen[index],
          naam: gezinNaam,
          postcode: postcode,
          email: email,
          telefoon: telefoon,
          dieetwensen: dieetwensen,
          allergenen: allergenen,
          gezinsleden: gezinsleden,
        }
      }
    } else {
      // Add new klant
      const newId = gezinnen.length > 0 ? Math.max(...gezinnen.map((g) => g.id || 0)) + 1 : 1
      gezinnen.push({
        id: newId,
        naam: gezinNaam,
        postcode: postcode,
        email: email,
        telefoon: telefoon,
        dieetwensen: dieetwensen,
        allergenen: allergenen,
        gezinsleden: gezinsleden,
      })
    }

    // Save to localStorage
    localStorage.setItem("gezinnen", JSON.stringify(gezinnen))

    // Close modal and reload klanten
    closeKlantModal()
    loadKlanten()
  }
})
