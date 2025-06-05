document.addEventListener("DOMContentLoaded", () => {
  // Load gezinnen (families) from DB
  const gezinSelect = document.getElementById("gezin-select");
  if (gezinSelect) {
    fetch("php/voedselpakketten-api.php?action=gezinnen")
      .then(res => res.json())
      .then(gezinnen => {
        gezinSelect.innerHTML = '<option value="">Selecteer een gezin</option>';
        gezinnen.forEach(gezin => {
          const option = document.createElement("option");
          option.value = gezin.id;
          option.textContent = gezin.naam;
          gezinSelect.appendChild(option);
        });
      });

    gezinSelect.addEventListener("change", () => {
      document.getElementById("gezin-info")?.classList.add("hidden");
    });
  }

  // Product search from DB
  const productSearch = document.getElementById("product-search");
  if (productSearch) {
    productSearch.addEventListener("input", () => {
      const searchTerm = productSearch.value.trim();
      if (searchTerm.length >= 2) {
        fetch("php/voedselpakketten-api.php?action=producten&q=" + encodeURIComponent(searchTerm))
          .then(res => res.json())
          .then(products => showProductSearchResults(products));
      } else {
        document.getElementById("product-search-results").classList.add("hidden");
      }
    });
  }

  function showProductSearchResults(products) {
    const resultsContainer = document.getElementById("product-search-results");
    resultsContainer.innerHTML = "";
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "bg-white rounded shadow p-4 flex flex-col items-center";
      card.innerHTML = `
        <div class="w-24 h-24 bg-gray-200 rounded mb-2"></div>
        <div class="text-center">
          <div class="font-medium">${product.naam}</div>
          <div class="text-xs text-gray-500">${product.categorie || ""}</div>
          <div class="text-xs text-gray-500">EAN: ${product.ean}</div>
          <div class="text-xs text-gray-500">Voorraad: ${product.voorraad}</div>
        </div>
        <button class="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm voeg-toe-btn">Voeg toe</button>
      `;
      card.querySelector(".voeg-toe-btn").addEventListener("click", () => {
        addProductToPakket(product);
      });
      resultsContainer.appendChild(card);
    });
  }

  // Add product to pakket table
  function addProductToPakket(product) {
    const pakketItems = document.getElementById("pakket-items");
    const existingItem = pakketItems.querySelector(`[data-product-id="${product.id}"]`);
    if (existingItem) {
      const aantalInput = existingItem.querySelector("input");
      aantalInput.value = Number.parseInt(aantalInput.value) + 1;
    } else {
      const row = document.createElement("tr");
      row.setAttribute("data-product-id", product.id);
      row.innerHTML = `
        <td class="py-2">
          <input type="checkbox" checked disabled class="mr-2">
          ${product.naam}
        </td>
        <td class="py-2">${product.categorie || ""}</td>
        <td class="py-2">
          <button type="button" class="decrement-aantal px-2 py-1 border border-gray-300 rounded-l-md">-</button>
          <input type="number" value="1" min="1" class="w-12 text-center border-t border-b border-gray-300 mx-1">
          <button type="button" class="increment-aantal px-2 py-1 border border-gray-300 rounded-r-md">+</button>
        </td>
        <td class="py-2">
          <button type="button" class="remove-item text-red-600 hover:text-red-900"><i class="fas fa-trash"></i></button>
        </td>
      `;
      const decrementBtn = row.querySelector(".decrement-aantal");
      const incrementBtn = row.querySelector(".increment-aantal");
      const removeBtn = row.querySelector(".remove-item");
      const aantalInput = row.querySelector("input[type='number']");
      decrementBtn.addEventListener("click", () => {
        if (aantalInput.value > 1) aantalInput.value--;
      });
      incrementBtn.addEventListener("click", () => {
        aantalInput.value++;
      });
      removeBtn.addEventListener("click", () => row.remove());
      pakketItems.appendChild(row);
    }
  }

  // Save pakket to DB
  document.getElementById("pakket-form")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const gezinId = Number.parseInt(document.getElementById("gezin-select").value);
    const datum = new Date().toISOString().split("T")[0];
    const items = [];
    document.querySelectorAll("#pakket-items tr").forEach(row => {
      const productId = Number.parseInt(row.getAttribute("data-product-id"));
      const aantal = Number.parseInt(row.querySelector("input").value);
      items.push({ product_id: productId, aantal: aantal });
    });
    if (!gezinId) return alert("Selecteer een gezin.");
    if (!items.length) return alert("Voeg minimaal één product toe aan het pakket.");
    fetch("php/voedselpakketten-api.php?action=add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ klanten_id: gezinId, datum, items })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          closePakketModal();
          loadVoedselpakketten();
        } else {
          alert("Fout bij opslaan: " + (data.error || "Onbekende fout"));
        }
      });
  });

  let pakkettenData = [];

  function loadVoedselpakketten() {
    fetch("php/voedselpakketten-api.php?action=list")
      .then(res => res.json())
      .then(pakketten => {
        // For each pakket, fetch its items
        const pakketPromises = pakketten.map(pakket =>
          fetch(`php/voedselpakketten-api.php?action=items&pakket_id=${pakket.id}`)
            .then(res => res.json())
            .then(items => {
              pakket.items = items;
              return pakket;
            })
        );
        Promise.all(pakketPromises).then(allPakketten => {
          pakkettenData = allPakketten;
          renderPakkettenWithSort();
        });
      });
  }

  function renderPakkettenWithSort() {
    const sortValue = document.getElementById("sort-pakketten")?.value || "datum_desc";
    let filtered = [...pakkettenData];

    // Search filter
    const searchTerm = document.getElementById("search-pakketten")?.value.toLowerCase().trim() || "";
    if (searchTerm) {
      filtered = filtered.filter(pakket => {
        const id = (pakket.id || "").toString().toLowerCase();
        const gezin = (pakket.gezinNaam || pakket.klanten_id || "").toString().toLowerCase();
        const datum = (pakket.datum || "").toLowerCase();
        const producten = (pakket.items || []).map(i => (i.productNaam || "") + " " + (i.aantal || "")).join(" ").toLowerCase();
        return id.includes(searchTerm) || gezin.includes(searchTerm) || datum.includes(searchTerm) || producten.includes(searchTerm);
      });
    }

    // Sorting (existing code)
    if (sortValue === "datum_desc") {
      filtered.sort((a, b) => b.datum.localeCompare(a.datum));
    } else if (sortValue === "datum_asc") {
      filtered.sort((a, b) => a.datum.localeCompare(b.datum));
    } else if (sortValue === "gezin_asc") {
      filtered.sort((a, b) => (a.gezinNaam || "").localeCompare(b.gezinNaam || ""));
    } else if (sortValue === "gezin_desc") {
      filtered.sort((a, b) => (b.gezinNaam || "").localeCompare(a.gezinNaam || ""));
    }
    renderPakketten(filtered);
  }

  // Listen for sort changes
  document.getElementById("sort-pakketten")?.addEventListener("change", renderPakkettenWithSort);
  document.getElementById("search-pakketten")?.addEventListener("input", renderPakkettenWithSort);

  function renderPakketten(pakketten) {
    const container = document.getElementById("pakketten-container");
    container.innerHTML = "";
    if (!pakketten.length) {
      container.innerHTML = "<p class='col-span-3 text-center'>Geen voedselpakketten gevonden.</p>";
      return;
    }
    pakketten.forEach(pakket => {
      const div = document.createElement("div");
      div.className = "bg-gray-50 p-4 rounded shadow";
      div.innerHTML = `
        <h3 class="font-bold mb-2">Pakket #${pakket.id}</h3>
        <p><b>Gezin:</b> ${pakket.gezinNaam || pakket.klanten_id}</p>
        <p><b>Gemaakt op:</b> ${pakket.datum}</p>
       <ul class="mt-2 mb-2">
          ${pakket.items.map(item => `<li>${item.productNaam} (${item.aantal})</li>`).join("")}
        </ul>
        ${
  pakket.datum_uitgifte
    ? `<p class="text-green-700"><b>Opgehaald op:</b> ${pakket.datum_uitgifte}</p>`
    : `<button class="opgehaald-btn bg-blue-600 text-white px-3 py-1 rounded" data-pakket-id="${pakket.id}">Opgehaald</button>`
}
      `;
      container.appendChild(div);
    });
  }

  // Event delegation for "Opgehaald" button
  document.getElementById("pakketten-container").addEventListener("click", function(e) {
    if (e.target.classList.contains("opgehaald-btn")) {
      const pakketId = e.target.getAttribute("data-pakket-id");
      const today = new Date().toISOString().split("T")[0];
      fetch("php/voedselpakketten-api.php?action=opgehaald", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pakket_id: pakketId, datum_uitgifte: today })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            loadVoedselpakketten();
          } else {
            alert("Fout bij bijwerken: " + (data.error || "Onbekende fout"));
          }
        });
    }
  });

  function closePakketModal() {
    const modal = document.getElementById("pakket-modal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  // Modal open/close
  document.getElementById("create-pakket")?.addEventListener("click", () => {
    document.getElementById("pakket-form").reset();
    document.getElementById("pakket-items").innerHTML = "";
    document.getElementById("pakket-modal").classList.remove("hidden");
    document.getElementById("pakket-modal").classList.add("flex");
  });
  document.getElementById("close-modal")?.addEventListener("click", closePakketModal);
  document.getElementById("cancel-pakket")?.addEventListener("click", closePakketModal);

  // Initial load
  loadVoedselpakketten();
});