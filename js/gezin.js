document.addEventListener("DOMContentLoaded", () => {
  function requireAuth() {
    console.log("Authentication check (mock)");
  }

  function getCurrentUser() {
    return { role: "directie" };
  }

  requireAuth();
  const user = getCurrentUser();

  let currentCategory = "all";

  function loadGezinnen() {
    fetch("php/gezin-info.php")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          return res.text().then(text => {
            throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
          });
        }
        return res.json();
      })
      .then(response => {
        if (!response.success) {
          throw new Error(response.error || "Onbekende fout");
        }
        renderProducts(response.data); 
      })
      .catch(err => {
        console.error("Gezinnen info ophalen mislukt:", err);
        const tbody = document.getElementById("gezin-table-body");
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-500">Fout bij ophalen gegevens: ${err.message}</td></tr>`;
      });
  }

  function renderProducts(products) {
    const tbody = document.getElementById("gezin-table-body");
    tbody.innerHTML = "";

    if (!products.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Geen gezinnen gevonden.</td></tr>`;
        return;
    }

    // Fetch all pakketten once
    fetch("php/voedselpakketten-api.php?action=list")
      .then(res => res.json())
      .then(pakketten => {
        products.forEach(p => {
            // Find pakketten for this gezin
            const gezinPakketten = pakketten.filter(pk => pk.klanten_id == p.id);
            // Check if there is any pakket without datum_uitgifte
            const openPakket = gezinPakketten.some(pk => !pk.datum_uitgifte);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="px-6 py-4">${p.naam}</td>
                <td class="px-6 py-4">${p.postcode || ""}</td>
                <td class="px-6 py-4">${p.aantal_leden || 0} leden</td>
                <td class="px-6 py-4">
                    ${
                        !openPakket
                        ? `<button onclick="window.location.href='voedselpakket-maken.php?gezin_id=${p.id}&gezin_naam=${encodeURIComponent(p.naam)}'" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Maak pakket</button>`
                        : `<span class="text-gray-500">Pakket al aangemaakt</span>`
                    }
                </td>
            `;
            tbody.appendChild(row);
        });
      });
}

  // Filters
  document.getElementById("sort-by")?.addEventListener("change", loadGezinnen);
  document.getElementById("search-gezinnen")?.addEventListener("input", loadGezinnen);

  // Initial load
  loadGezinnen();

  
});
