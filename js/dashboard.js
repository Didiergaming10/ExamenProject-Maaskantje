// Dashboard functionality

document.addEventListener("DOMContentLoaded", () => {
  // Mock functions for demonstration purposes
  function requireAuth() {
    // In a real application, this would check for authentication tokens
    console.log("Authentication check.")
  }

  function getCurrentUser() {
    // In a real application, this would retrieve user data from local storage or an API
    return {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      role: "directie", // Can be 'directie', 'magazijn', or 'vrijwilliger'
    }
  }

  function updateUser(userId, updates) {
    // In a real application, this would send updates to an API
    console.log(`Updating user ${userId} with:`, updates)
  }

  // Require authentication
  requireAuth()

  const user = getCurrentUser()
  const dashboardContent = document.getElementById("dashboard-content")

  if (dashboardContent) {
    // Load dashboard content based on user role
    switch (user.role) {
      case "directie":
        loadDirectieDashboard()
        break
      case "magazijn":
        loadMagazijnDashboard()
        break
      case "vrijwilliger":
        loadVrijwilligerDashboard()
        break
      default:
        dashboardContent.innerHTML = "<p>Welkom bij Voedselbank Maaskantje</p>"
    }
  }

  // Function to load directie dashboard
  function loadDirectieDashboard() {
    dashboardContent.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4">Gebruikersprofiel</h2>
                    <div class="space-y-4">
                        <div>
                            <p class="text-sm text-gray-500">Naam</p>
                            <p>${user.firstName} ${user.lastName}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Email</p>
                            <p>${user.email}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Telefoon</p>
                            <p>${user.phone || "Niet ingesteld"}</p>
                        </div>
                        <button id="wijzig-wachtwoord" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                            Wijzig wachtwoord
                        </button>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4">Maandoverzicht per productcategorie</h2>
                    <div class="space-y-2">
                        <a href="#" class="block p-2 hover:bg-gray-100 rounded">Aardappelen, groente en fruit</a>
                        <a href="#" class="block p-2 hover:bg-gray-100 rounded">Kaas en vleeswaren</a>
                        <a href="#" class="block p-2 hover:bg-gray-100 rounded">Zuivel, plantaardig en eieren</a>
                        <a href="#" class="block p-2 hover:bg-gray-100 rounded">Bakkerij en banket</a>
                        <a href="#" class="block p-2 hover:bg-gray-100 rounded">Meer categorieën...</a>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4">Maandoverzicht per postcode</h2>
                    <div class="space-y-2">
                        <a href="#" class="block p-2 hover:bg-gray-100 rounded">5211 - Centrum</a>
                        <a href="#" class="block p-2 hover:bg-gray-100 rounded">5212 - Noord</a>
                        <a href="#" class="block p-2 hover:bg-gray-100 rounded">5213 - Oost</a>
                        <a href="#" class="block p-2 hover:bg-gray-100 rounded">5214 - Zuid</a>
                        <a href="#" class="block p-2 hover:bg-gray-100 rounded">Meer postcodes...</a>
                    </div>
                </div>
            </div>
            
            <div class="mt-8 grid grid-cols-1 gap-6">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4">Recente activiteiten</h2>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Datum
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Gebruiker
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Activiteit
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${new Date().toLocaleDateString()}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${user.firstName} ${user.lastName}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Ingelogd
                                    </td>
                                </tr>
                                <!-- More activity rows would be dynamically added here -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `

    // Add event listener for password change
    const wijzigWachtwoordBtn = document.getElementById("wijzig-wachtwoord")
    if (wijzigWachtwoordBtn) {
      wijzigWachtwoordBtn.addEventListener("click", () => {
        const newPassword = prompt("Voer nieuw wachtwoord in:")
        if (newPassword) {
          updateUser(user.id, { password: newPassword })
          alert("Wachtwoord succesvol gewijzigd.")
        }
      })
    }
  }

  // Function to load magazijn dashboard
  function loadMagazijnDashboard() {
    dashboardContent.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4">Gebruikersprofiel</h2>
                    <div class="space-y-4">
                        <div>
                            <p class="text-sm text-gray-500">Naam</p>
                            <p>${user.firstName} ${user.lastName}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Email</p>
                            <p>${user.email}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Telefoon</p>
                            <p>${user.phone || "Niet ingesteld"}</p>
                        </div>
                        <button id="wijzig-wachtwoord" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                            Wijzig wachtwoord
                        </button>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4">Snelle links</h2>
                    <div class="space-y-4">
                        <a href="producten.html" class="block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center">
                            Producten beheren
                        </a>
                        <a href="leveranciers.html" class="block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center">
                            Leveranciers bekijken
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="mt-8 grid grid-cols-1 gap-6">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4">Producten met lage voorraad</h2>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Categorie
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Voorraad
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actie
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <!-- This would be populated dynamically with products that have low stock -->
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Melk (halfvol)
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Zuivel, plantaardig en eieren
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                                        5 stuks
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <a href="producten.html" class="text-green-600 hover:text-green-900">Bijwerken</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Brood (volkoren)
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Bakkerij en banket
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                                        3 stuks
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <a href="producten.html" class="text-green-600 hover:text-green-900">Bijwerken</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `

    // Add event listener for password change
    const wijzigWachtwoordBtn = document.getElementById("wijzig-wachtwoord")
    if (wijzigWachtwoordBtn) {
      wijzigWachtwoordBtn.addEventListener("click", () => {
        const newPassword = prompt("Voer nieuw wachtwoord in:")
        if (newPassword) {
          updateUser(user.id, { password: newPassword })
          alert("Wachtwoord succesvol gewijzigd.")
        }
      })
    }
  }

  // Function to load vrijwilliger dashboard
  function loadVrijwilligerDashboard() {
    dashboardContent.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4">Gebruikersprofiel</h2>
                    <div class="space-y-4">
                        <div>
                            <p class="text-sm text-gray-500">Naam</p>
                            <p>${user.firstName} ${user.lastName}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Email</p>
                            <p>${user.email}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Telefoon</p>
                            <p>${user.phone || "Niet ingesteld"}</p>
                        </div>
                        <button id="wijzig-wachtwoord" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                            Wijzig wachtwoord
                        </button>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4">Snelle links</h2>
                    <div class="space-y-4">
                        <a href="producten.html" class="block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center">
                            Producten bekijken
                        </a>
                        <a href="voedselpakketten.html" class="block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-center">
                            Voedselpakketten samenstellen
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="mt-8 grid grid-cols-1 gap-6">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-semibold mb-4">Recente voedselpakketten</h2>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Datum
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Gezin
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aantal producten
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actie
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <!-- This would be populated dynamically with recent food packages -->
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${new Date().toLocaleDateString()}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Familie Jansen
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        12
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Afgeleverd
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <a href="voedselpakketten.html" class="text-green-600 hover:text-green-900">Bekijken</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${new Date(Date.now() - 86400000).toLocaleDateString()}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Familie Pietersen
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        15
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                            In verwerking
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <a href="voedselpakketten.html" class="text-green-600 hover:text-green-900">Bekijken</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `

    // Add event listener for password change
    const wijzigWachtwoordBtn = document.getElementById("wijzig-wachtwoord")
    if (wijzigWachtwoordBtn) {
      wijzigWachtwoordBtn.addEventListener("click", () => {
        const newPassword = prompt("Voer nieuw wachtwoord in:")
        if (newPassword) {
          updateUser(user.id, { password: newPassword })
          alert("Wachtwoord succesvol gewijzigd.")
        }
      })
    }
  }
})
