// Dashboard functionality

// Mock getCurrentUser function for demonstration purposes
function getCurrentUser() {
  // Replace this with your actual user authentication logic
  // For example, retrieve user data from local storage or a cookie
  return {
    role: "directie", // Example role, change as needed for testing
  }
}

// Load dashboard content based on user role
function loadDashboardContent() {
  const user = getCurrentUser()
  if (!user) return

  const dashboardContent = document.getElementById("dashboardContent")
  if (!dashboardContent) return

  // Create dashboard content based on user role
  let content = ""

  switch (user.role) {
    case "directie":
      content = createDirectieDashboard()
      break
    case "magazijn":
      content = createMagazijnDashboard()
      break
    case "vrijwilliger":
      content = createVrijwilligerDashboard()
      break
    case "klant":
      content = createKlantDashboard()
      break
    default:
      content = "<p>Welkom bij het voedselbankbeheer systeem</p>"
  }

  dashboardContent.innerHTML = content
}

// Create dashboard for Directie role
function createDirectieDashboard() {
  return `
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p class="text-muted">Welkom bij het beheersysteem van Voedselbank Maaskantje</p>
      </div>
    </div>

    <div class="stats-grid">
      <div class="card">
        <div class="card-content">
          <div class="stat-header">
            <h3>Totaal Producten</h3>
          </div>
          <div class="stat-value">245</div>
          <p class="text-xs text-muted">+12% vergeleken met vorige maand</p>
        </div>
      </div>
      
      <div class="card">
        <div class="card-content">
          <div class="stat-header">
            <h3>Actieve Klanten</h3>
          </div>
          <div class="stat-value">38</div>
          <p class="text-xs text-muted">+2 nieuwe klanten deze week</p>
        </div>
      </div>
      
      <div class="card">
        <div class="card-content">
          <div class="stat-header">
            <h3>Voedselpakketten</h3>
          </div>
          <div class="stat-value">24</div>
          <p class="text-xs text-muted">Uitgegeven deze week</p>
        </div>
      </div>
      
      <div class="card">
        <div class="card-content">
          <div class="stat-header">
            <h3>Leveranciers</h3>
          </div>
          <div class="stat-value">12</div>
          <p class="text-xs text-muted">3 leveringen verwacht deze week</p>
        </div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="card">
        <div class="card-header">
          <h3>Maandoverzicht per productcategorie</h3>
          <p class="text-muted">Verdeling van producten per categorie in de afgelopen maand</p>
        </div>
        <div class="card-content chart-placeholder">
          <p class="text-muted">Grafiek wordt hier weergegeven</p>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3>Maandoverzicht per postcode</h3>
          <p class="text-muted">Verdeling van klanten per postcodegebied</p>
        </div>
        <div class="card-content chart-placeholder">
          <p class="text-muted">Grafiek wordt hier weergegeven</p>
        </div>
      </div>
    </div>

    <div class="action-cards-grid">
      <div class="card">
        <div class="card-header">
          <h3>Gebruikersbeheer</h3>
          <p class="text-muted">Beheer medewerkers en klantaccounts</p>
        </div>
        <div class="card-content">
          <div class="button-group">
            <a href="medewerkers.html" class="btn btn-outline btn-block text-left">
              Medewerkers beheren
            </a>
            <a href="klanten.html" class="btn btn-outline btn-block text-left">
              Klanten beheren
            </a>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3>Voorraad</h3>
          <p class="text-muted">Beheer producten en leveranciers</p>
        </div>
        <div class="card-content">
          <div class="button-group">
            <a href="producten.html" class="btn btn-outline btn-block text-left">
              Producten beheren
            </a>
            <a href="leveranciers.html" class="btn btn-outline btn-block text-left">
              Leveranciers beheren
            </a>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3>Voedselpakketten</h3>
          <p class="text-muted">Overzicht en beheer van voedselpakketten</p>
        </div>
        <div class="card-content">
          <a href="voedselpakketten.html" class="btn btn-outline btn-block text-left">
            Voedselpakketten beheren
          </a>
        </div>
      </div>
    </div>
  `
}

// Create dashboard for Magazijn role
function createMagazijnDashboard() {
  return `
    <div class="page-header">
      <div>
        <h1>Magazijn Dashboard</h1>
        <p class="text-muted">Beheer producten en leveranciers</p>
      </div>
    </div>

    <div class="stats-grid">
      <div class="card">
        <div class="card-content">
          <div class="stat-header">
            <h3>Totaal Producten</h3>
          </div>
          <div class="stat-value">245</div>
          <p class="text-xs text-muted">12 producten bijna verlopen</p>
        </div>
      </div>
      
      <div class="card">
        <div class="card-content">
          <div class="stat-header">
            <h3>Leveranciers</h3>
          </div>
          <div class="stat-value">12</div>
          <p class="text-xs text-muted">3 leveringen verwacht deze week</p>
        </div>
      </div>
      
      <div class="card">
        <div class="card-content">
          <div class="stat-header">
            <h3>Lage Voorraad</h3>
          </div>
          <div class="stat-value">18</div>
          <p class="text-xs text-muted">Producten die aangevuld moeten worden</p>
        </div>
      </div>
    </div>

    <div class="deliveries-grid">
      <div class="card">
        <div class="card-header">
          <h3>Recente Leveringen</h3>
          <p class="text-muted">Overzicht van de meest recente leveringen</p>
        </div>
        <div class="card-content">
          <div class="delivery-list">
            <div class="delivery-item">
              <div>
                <p class="delivery-name">Supermarkt Hoogvliet</p>
                <p class="text-sm text-muted">Ontvangen: 12 mei 2025</p>
              </div>
              <button class="btn btn-outline btn-sm">Details</button>
            </div>
            
            <div class="delivery-item">
              <div>
                <p class="delivery-name">Bakkerij Van Doorn</p>
                <p class="text-sm text-muted">Ontvangen: 10 mei 2025</p>
              </div>
              <button class="btn btn-outline btn-sm">Details</button>
            </div>
            
            <div class="delivery-item">
              <div>
                <p class="delivery-name">Groenteboer Jansen</p>
                <p class="text-sm text-muted">Ontvangen: 8 mei 2025</p>
              </div>
              <button class="btn btn-outline btn-sm">Details</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3>Verwachte Leveringen</h3>
          <p class="text-muted">Overzicht van aankomende leveringen</p>
        </div>
        <div class="card-content">
          <div class="delivery-list">
            <div class="delivery-item">
              <div>
                <p class="delivery-name">Albert Heijn</p>
                <p class="text-sm text-muted">Verwacht: 15 mei 2025</p>
              </div>
              <button class="btn btn-outline btn-sm">Details</button>
            </div>
            
            <div class="delivery-item">
              <div>
                <p class="delivery-name">Zuivelboer De Wit</p>
                <p class="text-sm text-muted">Verwacht: 18 mei 2025</p>
              </div>
              <button class="btn btn-outline btn-sm">Details</button>
            </div>
            
            <div class="delivery-item">
              <div>
                <p class="delivery-name">Slagerij Van Vliet</p>
                <p class="text-sm text-muted">Verwacht: 20 mei 2025</p>
              </div>
              <button class="btn btn-outline btn-sm">Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>Snelle Acties</h3>
      </div>
      <div class="card-content">
        <div class="button-group">
          <a href="producten.html" class="btn btn-outline btn-block text-left">
            Producten beheren
          </a>
          <a href="leveranciers.html" class="btn btn-outline btn-block text-left">
            Leveranciers bekijken
          </a>
          <a href="producten.html?filter=expiring" class="btn btn-outline btn-block text-left">
            Bijna verlopen producten
          </a>
        </div>
      </div>
    </div>
  `
}

// Create dashboard for Vrijwilliger role
function createVrijwilligerDashboard() {
  return `
    <div class="page-header">
      <div>
        <h1>Vrijwilliger Dashboard</h1>
        <p class="text-muted">Beheer voedselpakketten en voorraad</p>
      </div>
    </div>

    <div class="stats-grid">
      <div class="card">
        <div class="card-content">
          <div class="stat-header">
            <h3>Voedselpakketten Vandaag</h3>
          </div>
          <div class="stat-value">8</div>
          <p class="text-xs text-muted">3 nog samen te stellen</p>
        </div>
      </div>
      
      <div class="card">
        <div class="card-content">
          <div class="stat-header">
            <h3>Klanten Vandaag</h3>
          </div>
          <div class="stat-value">12</div>
          <p class="text-xs text-muted">Verwacht tussen 13:00 - 17:00</p>
        </div>
      </div>
      
      <div class="card">
        <div class="card-content">
          <div class="stat-header">
            <h3>Lage Voorraad</h3>
          </div>
          <div class="stat-value">5</div>
          <p class="text-xs text-muted">Producten die bijna op zijn</p>
        </div>
      </div>
    </div>

    <div class="grid-layout">
      <div class="main-panel">
        <div class="card">
          <div class="card-header">
            <h3>Voedselpakketten Vandaag</h3>
            <p class="text-muted">Overzicht van de voedselpakketten voor vandaag</p>
          </div>
          <div class="card-content">
            <div class="package-list">
              <div class="package-item">
                <div>
                  <p class="package-name">Familie Jansen</p>
                  <p class="text-sm text-muted">Ophalen: 14:00</p>
                </div>
                <div class="button-group">
                  <button class="btn btn-outline btn-sm">Bekijken</button>
                  <button class="btn btn-primary btn-sm">Samenstellen</button>
                </div>
              </div>
              
              <div class="package-item">
                <div>
                  <p class="package-name">Familie De Vries</p>
                  <p class="text-sm text-muted">Ophalen: 14:30</p>
                </div>
                <div class="button-group">
                  <button class="btn btn-outline btn-sm">Bekijken</button>
                  <button class="btn btn-primary btn-sm">Samenstellen</button>
                </div>
              </div>
              
              <div class="package-item">
                <div>
                  <p class="package-name">Familie Bakker</p>
                  <p class="text-sm text-muted">Ophalen: 15:00</p>
                </div>
                <div class="button-group">
                  <button class="btn btn-outline btn-sm">Bekijken</button>
                  <button class="btn btn-primary btn-sm">Samenstellen</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="sidebar">
        <div class="card">
          <div class="card-header">
            <h3>Snelle Acties</h3>
          </div>
          <div class="card-content">
            <div class="button-group">
              <a href="nieuw-pakket.html" class="btn btn-primary btn-block text-left">
                Nieuw voedselpakket
              </a>
              <a href="producten.html" class="btn btn-outline btn-block text-left">
                Producten beheren
              </a>
              <a href="voedselpakketten.html" class="btn btn-outline btn-block text-left">
                Alle voedselpakketten
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// Create dashboard for Klant role
function createKlantDashboard() {
  return `
    <div class="page-header">
      <div>
        <h1>Welkom bij Voedselbank Maaskantje</h1>
        <p class="text-muted">Bekijk uw voedselpakketten en persoonlijke gegevens</p>
      </div>
    </div>

    <div class="grid-layout">
      <div class="main-panel">
        <div class="card">
          <div class="card-header">
            <h3>Uw Gegevens</h3>
            <p class="text-muted">Persoonlijke informatie en gezinssamenstelling</p>
          </div>
          <div class="card-content">
            <div class="user-info">
              <div class="info-grid">
                <div>
                  <p class="text-sm text-muted">Naam</p>
                  <p>Jan Jansen</p>
                </div>
                <div>
                  <p class="text-sm text-muted">Email</p>
                  <p>jan.jansen@email.nl</p>
                </div>
                <div>
                  <p class="text-sm text-muted">Telefoon</p>
                  <p>06-12345678</p>
                </div>
                <div>
                  <p class="text-sm text-muted">Gezinsleden</p>
                  <p>4 personen</p>
                </div>
              </div>
              <div>
                <p class="text-sm text-muted">Dieetwensen</p>
                <div class="diet-tags">
                  <span class="diet-tag">Geen varkensvlees</span>
                  <span class="diet-tag">Lactose-intolerant</span>
                </div>
              </div>
              <button class="btn btn-outline btn-sm">Gegevens wijzigen</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="sidebar">
        <div class="card">
          <div class="card-header">
            <h3>Voedselpakket</h3>
            <p class="text-muted">Uw huidige voedselpakket</p>
          </div>
          <div class="card-content">
            <div class="package-info">
              <div>
                <p class="text-sm text-muted">Status</p>
                <p class="font-medium">Klaar om op te halen</p>
              </div>
              <div>
                <p class="text-sm text-muted">Ophalen op</p>
                <p>Woensdag 14 mei, tussen 14:00 en 16:00</p>
              </div>
              <div class="button-group">
                <button class="btn btn-outline btn-sm">Bekijk inhoud</button>
                <a href="nieuw-pakket.html" class="btn btn-primary btn-sm">Nieuw pakket samenstellen</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>Geschiedenis Voedselpakketten</h3>
        <p class="text-muted">Overzicht van uw eerder ontvangen voedselpakketten</p>
      </div>
      <div class="card-content">
        <div class="package-history">
          <div class="package-item">
            <div>
              <p class="package-name">Voedselpakket #12345</p>
              <p class="text-sm text-muted">Opgehaald op: 7 mei 2025</p>
            </div>
            <button class="btn btn-outline btn-sm">Details</button>
          </div>
          
          <div class="package-item">
            <div>
              <p class="package-name">Voedselpakket #12344</p>
              <p class="text-sm text-muted">Opgehaald op: 30 april 2025</p>
            </div>
            <button class="btn btn-outline btn-sm">Details</button>
          </div>
          
          <div class="package-item">
            <div>
              <p class="package-name">Voedselpakket #12343</p>
              <p class="text-sm text-muted">Opgehaald op: 23 april 2025</p>
            </div>
            <button class="btn btn-outline btn-sm">Details</button>
          </div>
        </div>
      </div>
    </div>
  `
}

// Add additional CSS for dashboard
function addDashboardStyles() {
  const style = document.createElement("style")
  style.textContent = `
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .charts-grid, .deliveries-grid, .action-cards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0.5rem 0;
    }
    
    .chart-placeholder {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .delivery-list, .package-list, .package-history {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .delivery-item, .package-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .delivery-name, .package-name {
      font-weight: 500;
    }
    
    .user-info, .package-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }
    
    .diet-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.25rem;
    }
    
    .diet-tag {
      background-color: var(--muted);
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }
    
    .text-left {
      text-align: left;
    }
    
    @media (min-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .charts-grid, .deliveries-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .action-cards-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    @media (min-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  `
  document.head.appendChild(style)
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("dashboard.html")) {
    addDashboardStyles()
    loadDashboardContent()
  }
})
