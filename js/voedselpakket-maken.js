document.addEventListener("DOMContentLoaded", () => {
  const gezinSelect = document.getElementById("gezin-select");
  const gezinNaamLabel = document.getElementById("gezin-naam");
  const hiddenInput = document.getElementById("gezin-id-hidden");
  const gezinIdParam = getQueryParam("gezin_id");
  const gezinNaamParam = getQueryParam("gezin_naam");

  function getQueryParam(key) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
  }



  if (gezinIdParam) {
    gezinSelect.style.display = "none";
    gezinNaamLabel.textContent = decodeURIComponent(gezinNaamParam || "");
    hiddenInput.value = gezinIdParam;

    // Fetch dieetwensen
    fetch("php/voedselpakketten-api.php?action=dieetwensen&gezin_id=" + gezinIdParam)
      .then(res => res.json())
      .then(data => {
        const dieetLabel = document.getElementById("gezin-dieetwensen");
        if (data.dieetwensen && data.dieetwensen.length > 0) {
          dieetLabel.textContent = data.dieetwensen.join(", ");
        } else {
          dieetLabel.textContent = "Geen dieetwensen";
        }
      });
  } else {
    // Load dropdown
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
      const id = gezinSelect.value;
      hiddenInput.value = id;

      if (!id) {
        gezinNaamLabel.textContent = "";
        document.getElementById("gezin-dieetwensen").textContent = "";
        return;
      }

      gezinNaamLabel.textContent = gezinSelect.options[gezinSelect.selectedIndex].text;

      fetch("php/get-dieetwensen.php?gezin_id=" + id)
        .then(res => res.json())
        .then(data => {
          const dieetLabel = document.getElementById("gezin-dieetwensen");
          if (data.dieetwensen && data.dieetwensen.length > 0) {
            dieetLabel.textContent = data.dieetwensen.join(", ");
          } else {
            dieetLabel.textContent = "Geen dieetwensen";
          }
        });
    });
  }

  // --- FILTERS: Dynamisch vullen en toepassen ---
  const filterCategorie = document.getElementById("filter-categorie");
  const filterVoorraad = document.getElementById("filter-voorraad");
  const productSearch = document.getElementById("product-search");

  // Vul categorieën dynamisch
  function loadCategories() {
    fetch("php/products-api.php?categories")
      .then(res => res.json())
      .then(categories => {
        filterCategorie.innerHTML = `<option value="">Alle categorieën</option>`;
        categories.forEach(cat => {
          filterCategorie.innerHTML += `<option value="${cat}">${cat}</option>`;
        });
        // Laad producten pas als de categorieën geladen zijn!
        loadProducts();
      });
  }
  loadCategories();

  // Producten laden met filters
  function loadProducts() {
    const q = productSearch.value.trim();
    const categorie = filterCategorie.value;
    const voorraad = filterVoorraad.value;

    const params = new URLSearchParams({
      action: "producten",
      q,
      categorie,
      voorraad
    });

    fetch("php/voedselpakketten-api.php?" + params.toString())
      .then(res => res.json())
      .then(products => showProductSearchResults(products));
  }

  // Event listeners voor filters
  productSearch.addEventListener("input", loadProducts);
  filterCategorie.addEventListener("change", loadProducts);
  filterVoorraad.addEventListener("change", loadProducts);

  function showProductSearchResults(products) {
    const resultsContainer = document.getElementById("product-search-results");
    resultsContainer.innerHTML = "";
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "bg-white rounded shadow p-4 flex flex-col items-center";
      card.innerHTML = `
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

  function addProductToPakket(product) {
    const pakketItems = document.getElementById("pakket-items");
    const existingItem = pakketItems.querySelector(`[data-product-id="${product.id}"]`);
    if (existingItem) {
      const aantalInput = existingItem.querySelector("input[type='number']");
      if (Number(aantalInput.value) < product.voorraad) {
        aantalInput.value = Number(aantalInput.value) + 1;
      } else {
        aantalInput.value = product.voorraad;
        alert("Niet meer voorraad beschikbaar!");
      }
    } else {
      const row = document.createElement("tr");
      row.setAttribute("data-product-id", product.id);
      row.innerHTML = `
        <td class="py-2">
          <input type="checkbox" checked disabled class="mr-2">
          ${product.naam}
        </td>
        <td class="py-2">
          <button type="button" class="decrement-aantal px-2 py-1 border border-gray-300 rounded-l-md">-</button>
          <input type="number" value="1" min="1" max="${product.voorraad}" class="w-12 text-center border-t border-b border-gray-300 mx-1">
          <button type="button" class="increment-aantal px-2 py-1 border border-gray-300 rounded-r-md">+</button>
          <span class="ml-2 text-xs text-gray-500">Voorraad: ${product.voorraad}</span>
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
        if (Number(aantalInput.value) < product.voorraad) {
          aantalInput.value = Number(aantalInput.value) + 1;
        } else {
          aantalInput.value = product.voorraad;
          alert("Niet meer voorraad beschikbaar!");
        }
      });
      aantalInput.addEventListener("input", () => {
        if (aantalInput.value > product.voorraad) {
          aantalInput.value = product.voorraad;
          alert("Niet meer voorraad beschikbaar!");
        }
        if (aantalInput.value < 1) {
          aantalInput.value = 1;
        }
      });
      removeBtn.addEventListener("click", () => row.remove());
      pakketItems.appendChild(row);
    }
  }

  document.getElementById("pakket-form").addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Validate
    const gezinId = Number.parseInt(hiddenInput.value);
    if (!gezinId) {
      return showError("Selecteer een gezin");
    }
    
    const items = [];
    document.querySelectorAll("#pakket-items tr").forEach(row => {
      const productId = Number.parseInt(row.getAttribute("data-product-id"));
      const aantal = Number.parseInt(row.querySelector("input[type='number']").value);
      if (aantal > 0) {
        items.push({ product_id: productId, aantal: aantal });
      }
    });
  
    if (!items.length) {
      return showError("Voeg minimaal één product toe aan het pakket");
    }
  
  }); 

  // Save pakket to DB
  document.getElementById("pakket-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const gezinId = Number.parseInt(hiddenInput.value);
    const datum = new Date().toISOString().split("T")[0];
    const items = [];

    document.querySelectorAll("#pakket-items tr").forEach(row => {
      const productId = Number.parseInt(row.getAttribute("data-product-id"));
      const aantal = Number.parseInt(row.querySelector("input[type='number']").value);
      items.push({ product_id: productId, aantal: aantal });
    });

    if (!gezinId) return alert("Selecteer een gezin.");
    if (!items.length) return alert("Voeg minimaal één product toe aan het pakket.");

    fetch("php/voedselpakketten-api.php?action=add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ klanten_id: gezinId, datum, items })    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Voedselpakket succesvol aangemaakt!");
          window.location.href = "voedselpakketten.php";
        } else {
          alert("Fout bij opslaan: " + (data.error || "Onbekende fout"));
        }
      });
  });
});
