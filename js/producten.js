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

  function loadProducts() {
    fetch("php/get-products.php")
      .then(res => res.json())
      .then(data => {
        const sortBy = document.getElementById("sort-by")?.value || "naam";
        const searchTerm = document.getElementById("search-products")?.value.toLowerCase() || "";

        // const filters = {
        //   geenVarkensvlees: document.getElementById("filter-geen-varkensvlees")?.checked,
        //   veganistisch: document.getElementById("filter-veganistisch")?.checked,
        //   vegetarisch: document.getElementById("filter-vegetarisch")?.checked
        // };

        let products = data;

        // Category filter
        if (currentCategory !== "all") {
          products = products.filter(p => p.categorie === currentCategory);
        }

        // Search filter
        if (searchTerm) {
          products = products.filter(p =>
            p.naam.toLowerCase().includes(searchTerm) ||
            p.ean.toLowerCase().includes(searchTerm)
          );
        }

        // Dieetwensen filters (commented out)
        // products = products.filter(p => {
        //   if (filters.geenVarkensvlees && !p.dieetwensen.includes("geen-varkensvlees")) return false;
        //   if (filters.veganistisch && !p.dieetwensen.includes("veganistisch")) return false;
        //   if (filters.vegetarisch && !p.dieetwensen.includes("vegetarisch")) return false;
        //   return true;
        // });

        // Sorting
        products.sort((a, b) => {
          switch (sortBy) {
            case "naam": return a.naam.localeCompare(b.naam);
            case "categorie": return a.categorie.localeCompare(b.categorie);
            case "ean": return a.ean.localeCompare(b.ean);
            case "voorraad": return a.voorraad - b.voorraad;
            default: return 0;
          }
        });

        renderProducts(products);
      })
      .catch(err => console.error("Product ophalen mislukt:", err));
  }

  function renderProducts(products) {
    const tbody = document.getElementById("products-table-body");
    tbody.innerHTML = "";

    if (!products.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Geen producten gevonden.</td></tr>`;
      return;
    }

    products.forEach(p => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td class="px-6 py-4"><input type="checkbox" class="product-checkbox" data-id="${p.id}"></td>
        <td class="px-6 py-4">${p.naam}</td>
        <td class="px-6 py-4">${p.categorie}</td>
        <td class="px-6 py-4">${p.ean}</td>
        <td class="px-6 py-4">${p.voorraad}</td>
        <td class="px-6 py-4">
          ${user.role === "directie"
            ? `<button class="text-blue-600 hover:underline edit-product" data-id="${p.id}">Bewerken</button>`
            : `<span class="text-gray-400 italic">Geen toegang</span>`
          }
        </td>
      `;

      tbody.appendChild(row);
    });

    addEditListeners(products);
  }

  function addEditListeners(products) {
    document.querySelectorAll(".edit-product").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const product = products.find(p => p.id == id);
        if (!product) return;

        document.getElementById("product-id").value = product.id;
        document.getElementById("product-naam").value = product.naam;
        document.getElementById("product-categorie").value = product.categorie;
        document.getElementById("product-ean").value = product.ean;
        document.getElementById("product-voorraad").value = product.voorraad;

        document.getElementById("modal-title").textContent = "Product bewerken";
        document.getElementById("product-modal").classList.remove("hidden");
      });
    });
  }

  // Category filter
  document.querySelectorAll("#categories-list a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll("#categories-list a").forEach(l => l.classList.remove("bg-green-100", "text-green-800"));
      link.classList.add("bg-green-100", "text-green-800");
      currentCategory = link.dataset.category;
      loadProducts();
    });
  });

  // Sorting
  document.getElementById("sort-by")?.addEventListener("change", loadProducts);

  // Search
  document.getElementById("search-products")?.addEventListener("input", loadProducts);

  // Dieetwensen filters (commented out)
  // ["filter-geen-varkensvlees", "filter-veganistisch", "filter-vegetarisch"].forEach(id => {
  //   document.getElementById(id)?.addEventListener("change", loadProducts);
  // });

  // Open modal for adding product
  document.getElementById("add-product")?.addEventListener("click", () => {
    document.getElementById("product-form").reset();
    document.getElementById("product-id").value = "";
    document.getElementById("modal-title").textContent = "Product toevoegen";
    document.getElementById("product-modal").classList.remove("hidden");
  });

  // Close modal
  document.getElementById("close-modal")?.addEventListener("click", () => {
    document.getElementById("product-modal").classList.add("hidden");
  });
  document.getElementById("cancel-product")?.addEventListener("click", () => {
    document.getElementById("product-modal").classList.add("hidden");
  });

  // Submit add/edit form
  document.getElementById("product-form")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const id = document.getElementById("product-id").value;
    const naam = document.getElementById("product-naam").value;
    const categorie = document.getElementById("product-categorie").value;
    const ean = document.getElementById("product-ean").value;
    const voorraad = document.getElementById("product-voorraad").value;

    fetch("php/add-product.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, naam, categorie, ean, voorraad })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          document.getElementById("product-modal").classList.add("hidden");
          loadProducts();
        } else {
          alert("Fout bij opslaan: " + (data.error || "Onbekende fout"));
        }
      });
  });

  // Delete selected products
  document.getElementById("remove-product")?.addEventListener("click", () => {
    const checked = Array.from(document.querySelectorAll(".product-checkbox:checked"));
    if (!checked.length) {
      alert("Selecteer eerst producten om te verwijderen.");
      return;
    }
    if (!confirm("Weet je zeker dat je de geselecteerde producten wilt verwijderen?")) return;

    const ids = checked.map(cb => cb.dataset.id);

    fetch("php/delete-products.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          loadProducts();
        } else {
          alert("Fout bij verwijderen: " + (data.error || "Onbekende fout"));
        }
      });
  });

  loadProducts();
});
