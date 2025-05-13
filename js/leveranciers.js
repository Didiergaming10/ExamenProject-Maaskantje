// Leveranciers management functionality

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
      username: "testuser",
    }
  }

  // Require authentication
  requireAuth()

  // Get current user
  const user = getCurrentUser()

  // Initialize leveranciers data in localStorage if not exists
  if (!localStorage.getItem("leveranciers")) {
    const initialLeveranciers = [
      {
        id: 1,
        naam: "Groente & Co",
        adres: "St. pieterstraat 123, Maaskantje",
        contact: {
          voornaam: "Jan",
          achternaam: "Jansen",
          email: "jan@groentenco.nl",
          telefoon: "0612345678",
        },
        volgendeLevering: {
          datum: "2023-06-15",
          tijd: "10:00",
        },
        producten: ["Appels", "Peren", "Aardappelen"],
      },
      {
        id: 2,
        naam: "Bakkerij Brood",
        adres: "Dorpsstraat 45, Maaskantje",
        contact: {
          voornaam: "Piet",
          achternaam: "Bakker",
          email: "piet@bakkerijbrood.nl",
          telefoon: "0687654321",
        },
        volgendeLevering: {
          datum: "2023-06-16",
          tijd: "09:30",
        },
        producten: ["Brood", "Broodjes", "Koek"],
      },
    ]
    localStorage.setItem("leveranciers", JSON.stringify(initialLeveranciers))
  }

  // Load leveranciers
  loadLeveranciers()

  // Add event listeners
  const addLeverancierBtn = document.getElementById("add-leverancier")
  if (addLeverancierBtn) {
    addLeverancierBtn.addEventListener("click", () => {
      openLeverancierModal()
    })
  }

  const searchInput = document.getElementById("search-leveranciers")
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      loadLeveranciers()
    })
  }

  // Leverancier modal form
  const leverancierForm = document.getElementById("leverancier-form")
  if (leverancierForm) {
    leverancierForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveLeverancier()
    })
  }

  const cancelLeverancierBtn = document.getElementById("cancel-leverancier")
  if (cancelLeverancierBtn) {
    cancelLeverancierBtn.addEventListener("click", () => {
      closeLeverancierModal()
    })
  }

  const closeModalBtn = document.getElementById("close-modal")
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      closeLeverancierModal()
    })
  }

  // Functions
  function loadLeveranciers() {
    const leveranciers = JSON.parse(localStorage.getItem("leveranciers")) || []
    const container = document.getElementById("leveranciers-container")
    const searchTerm = document.getElementById("search-leveranciers")?.value.toLowerCase() || ""

    // Filter leveranciers by search term
    let filteredLeveranciers = leveranciers
    if (searchTerm) {
      filteredLeveranciers = leveranciers.filter(
        (leverancier) =>
          leverancier.naam.toLowerCase().includes(searchTerm) ||
          leverancier.adres.toLowerCase().includes(searchTerm) ||
          leverancier.contact.voornaam.toLowerCase().includes(searchTerm) ||
          leverancier.contact.achternaam.toLowerCase().includes(searchTerm),
      )
    }

    // Clear container
    container.innerHTML = ""

    // Add leveranciers to container
    filteredLeveranciers.forEach((leverancier) => {
      const card = document.createElement("div")
      card.className = "bg-white p-4 rounded-lg shadow"

      card.innerHTML = `
                <h3 class="text-lg font-semibold mb-2">${leverancier.naam}</h3>
                <div class="mb-4">
                    <p class="text-sm text-gray-500">Adres</p>
                    <p>${leverancier.adres}</p>
                </div>
                <div class="mb-4">
                    <p class="text-sm text-gray-500">Contact</p>
                    <p>${leverancier.contact.voornaam} ${leverancier.contact.achternaam}</p>
                    <p>${leverancier.contact.email}</p>
                    <p>${leverancier.contact.telefoon}</p>
                </div>
                <div class="mb-4">
                    <p class="text-sm text-gray-500">Volgende levering</p>
                    <p>${formatDate(leverancier.volgendeLevering.datum)} ${leverancier.volgendeLevering.tijd}</p>
                </div>
                <div class="mb-4">
                    <p class="text-sm text-gray-500">Producten</p>
                    <ul class="list-disc pl-5">
                        ${leverancier.producten.map((product) => `<li>${product}</li>`).join("")}
                    </ul>
                </div>
                <div class="flex justify-end">
                    <button class="edit-leverancier px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500" data-id="${leverancier.id}">
                        Wijzig
                    </button>
                </div>
            `

      container.appendChild(card)
    })

    // Add event listeners to edit buttons
    const editButtons = document.querySelectorAll(".edit-leverancier")
    editButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const leverancierId = Number.parseInt(button.getAttribute("data-id"))
        openLeverancierModal(leverancierId)
      })
    })
  }

  function openLeverancierModal(leverancierId = null) {
    const modal = document.getElementById("leverancier-modal")
    const modalTitle = document.getElementById("modal-title")
    const leverancierForm = document.getElementById("leverancier-form")
    const leverancierIdInput = document.getElementById("leverancier-id")

    // Clear form
    leverancierForm.reset()

    if (leverancierId) {
      // Edit existing leverancier
      modalTitle.textContent = "Leverancier wijzigen"

      // Get leverancier data
      const leveranciers = JSON.parse(localStorage.getItem("leveranciers")) || []
      const leverancier = leveranciers.find((l) => l.id === leverancierId)

      if (leverancier) {
        // Fill form with leverancier data
        leverancierIdInput.value = leverancier.id
        document.getElementById("leverancier-naam").value = leverancier.naam
        document.getElementById("leverancier-adres").value = leverancier.adres
        document.getElementById("contact-voornaam").value = leverancier.contact.voornaam
        document.getElementById("contact-achternaam").value = leverancier.contact.achternaam
        document.getElementById("contact-email").value = leverancier.contact.email
        document.getElementById("contact-telefoon").value = leverancier.contact.telefoon
        document.getElementById("levering-datum").value = leverancier.volgendeLevering.datum
        document.getElementById("levering-tijd").value = leverancier.volgendeLevering.tijd
      }
    } else {
      // Add new leverancier
      modalTitle.textContent = "Leverancier toevoegen"
      leverancierIdInput.value = ""
    }

    // Show modal
    modal.classList.remove("hidden")
    modal.classList.add("flex")
  }

  function closeLeverancierModal() {
    const modal = document.getElementById("leverancier-modal")
    modal.classList.add("hidden")
    modal.classList.remove("flex")
  }

  function saveLeverancier() {
    const leverancierId = document.getElementById("leverancier-id").value
    const leverancierNaam = document.getElementById("leverancier-naam").value
    const leverancierAdres = document.getElementById("leverancier-adres").value
    const contactVoornaam = document.getElementById("contact-voornaam").value
    const contactAchternaam = document.getElementById("contact-achternaam").value
    const contactEmail = document.getElementById("contact-email").value
    const contactTelefoon = document.getElementById("contact-telefoon").value
    const leveringDatum = document.getElementById("levering-datum").value
    const leveringTijd = document.getElementById("levering-tijd").value

    // Get leveranciers from localStorage
    const leveranciers = JSON.parse(localStorage.getItem("leveranciers")) || []

    if (leverancierId) {
      // Update existing leverancier
      const index = leveranciers.findIndex((l) => l.id === Number.parseInt(leverancierId))
      if (index !== -1) {
        leveranciers[index] = {
          ...leveranciers[index],
          naam: leverancierNaam,
          adres: leverancierAdres,
          contact: {
            voornaam: contactVoornaam,
            achternaam: contactAchternaam,
            email: contactEmail,
            telefoon: contactTelefoon,
          },
          volgendeLevering: {
            datum: leveringDatum,
            tijd: leveringTijd,
          },
        }
      }
    } else {
      // Add new leverancier
      const newId = leveranciers.length > 0 ? Math.max(...leveranciers.map((l) => l.id)) + 1 : 1
      leveranciers.push({
        id: newId,
        naam: leverancierNaam,
        adres: leverancierAdres,
        contact: {
          voornaam: contactVoornaam,
          achternaam: contactAchternaam,
          email: contactEmail,
          telefoon: contactTelefoon,
        },
        volgendeLevering: {
          datum: leveringDatum,
          tijd: leveringTijd,
        },
        producten: [], // Empty products array for new leverancier
      })
    }

    // Save to localStorage
    localStorage.setItem("leveranciers", JSON.stringify(leveranciers))

    // Close modal and reload leveranciers
    closeLeverancierModal()
    loadLeveranciers()
  }

  // Helper function to format date
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("nl-NL", options)
  }
})
