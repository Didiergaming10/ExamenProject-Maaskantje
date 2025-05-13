// Gezin information form functionality

document.addEventListener("DOMContentLoaded", () => {
  // Check if gezin form exists
  const gezinForm = document.getElementById("gezin-form")
  if (gezinForm) {
    // Initialize gezinsleden container
    const gezinsledenContainer = document.getElementById("gezinsleden-container")
    const addGezinslidBtn = document.getElementById("add-gezinslid")

    // Add event listener for adding gezinslid
    if (addGezinslidBtn) {
      addGezinslidBtn.addEventListener("click", () => {
        addGezinslid()
      })
    }

    // Function to add a new gezinslid
    function addGezinslid() {
      const gezinslidItem = document.createElement("div")
      gezinslidItem.className = "gezinslid-item border p-4 rounded-md mb-4"
      gezinslidItem.innerHTML = `
                <div class="grid grid-cols-3 gap-4 mb-2">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Geboortedatum</label>
                        <div class="grid grid-cols-3 gap-2">
                            <input type="text" placeholder="DD" maxlength="2" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                            <input type="text" placeholder="MM" maxlength="2" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                            <input type="text" placeholder="JJJJ" maxlength="4" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
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

    // Add event listener for form submission
    gezinForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const gezinNaam = document.getElementById("gezin-naam").value
      const postcode = document.getElementById("postcode").value
      const email = document.getElementById("email").value
      const telefoon = document.getElementById("telefoon").value

      // Get dieetwensen
      const dieetwensen = []
      document.querySelectorAll('input[name="dieetwensen"]:checked').forEach((checkbox) => {
        dieetwensen.push(checkbox.value)
      })

      // Get allergenen if allergisch is checked
      let allergenen = ""
      if (document.getElementById("allergisch").checked) {
        allergenen = document.getElementById("allergenen").value
      }

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

      // Create gezin object
      const gezin = {
        naam: gezinNaam,
        postcode: postcode,
        email: email,
        telefoon: telefoon,
        dieetwensen: dieetwensen,
        allergenen: allergenen,
        gezinsleden: gezinsleden,
      }

      // Save to localStorage
      const gezinnen = JSON.parse(localStorage.getItem("gezinnen")) || []
      gezinnen.push(gezin)
      localStorage.setItem("gezinnen", JSON.stringify(gezinnen))

      // Redirect to login page
      alert("Gezin informatie succesvol opgeslagen. U kunt nu inloggen.")
      window.location.href = "index.html"
    })
  }
})
