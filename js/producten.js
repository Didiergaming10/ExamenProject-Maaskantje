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
    fetch("php/products-api.php")
      .then(res => res.json())
      .then(data => {
        const sortBy = document.getElementById("sort-by")?.value || "naam";
        const searchTerm = document.getElementById("search-products")?.value.toLowerCase() || "";


        let products = data;

        // Category filter
        if (currentCategory !== "all") {
          products = products.filter(p => 
            (p.categorie || "").toLowerCase() === currentCategory.toLowerCase()
          );
        }

        // Search filter
        if (searchTerm) {
          products = products.filter(p =>
            p.naam.toLowerCase().includes(searchTerm) ||
            p.ean.toLowerCase().includes(searchTerm)
          );
        }

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

  function loadCategories(selected = "all") {
    fetch("php/products-api.php?categories")
      .then(res => res.json())
      .then(categories => {
        const list = document.getElementById("categories-list");
        list.innerHTML = "";
        // Altijd "Alle producten"
        const allLi = document.createElement("li");
        allLi.innerHTML = `<a href="#" class="block p-2 hover:bg-gray-100 rounded${selected === "all" ? " bg-green-100 text-green-800" : ""}" data-category="all">Alle producten</a>`;
        list.appendChild(allLi);

        categories.forEach(cat => {
          const li = document.createElement("li");
          li.innerHTML = `<a href="#" class="block p-2 hover:bg-gray-100 rounded${selected === cat ? " bg-green-100 text-green-800" : ""}" data-category="${cat}">${cat}</a>`;
          list.appendChild(li);
        });

        // Herkoppel event listeners
        document.querySelectorAll("#categories-list a").forEach(link => {
          link.addEventListener("click", e => {
            e.preventDefault();
            document.querySelectorAll("#categories-list a").forEach(l => l.classList.remove("bg-green-100", "text-green-800"));
            link.classList.add("bg-green-100", "text-green-800");
            currentCategory = link.dataset.category;
            loadProducts();
          });
        });
      });
  }

  // Laad categorieën bij opstarten
  loadCategories();

  // Na toevoegen van een categorie, herlaad de lijst:
  document.getElementById("category-form")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const naam = document.getElementById("category-naam").value.trim();
    if (!naam) return;

    fetch("php/products-api.php?addCategory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ naam })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          document.getElementById("category-modal").classList.add("hidden");
          loadCategories(naam); // selecteer nieuwe categorie
          // Optioneel: selecteer direct de nieuwe categorie
          currentCategory = naam;
          loadProducts();
          updateCategorySelect();
        } else {
          alert("Fout bij toevoegen: " + (data.error || "Onbekende fout"));
        }
      });
  });

  // Vul de categorieën in het product-formulier
  function updateCategorySelect() {
    fetch("php/products-api.php?categories")
      .then(res => res.json())
      .then(categories => {
        const select = document.getElementById("product-categorie");
        if (!select) return;
        select.innerHTML = `<option value="">Selecteer categorie</option>`;
        categories.forEach(cat => {
          select.innerHTML += `<option value="${cat}">${cat}</option>`;
        });
      });
  }

  // Roep deze functie aan bij opstarten en na toevoegen categorie
  updateCategorySelect();

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

    fetch("php/products-api.php", {
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

    fetch("php/products-api.php?action=delete", {
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

  // Nieuwe categorie modal logic
  document.getElementById("add-category-btn")?.addEventListener("click", () => {
    document.getElementById("category-form").reset();
    document.getElementById("category-modal").classList.remove("hidden");
  });
  document.getElementById("close-category-modal")?.addEventListener("click", () => {
    document.getElementById("category-modal").classList.add("hidden");
  });
  document.getElementById("cancel-category")?.addEventListener("click", () => {
    document.getElementById("category-modal").classList.add("hidden");
  });

  loadProducts();
});
