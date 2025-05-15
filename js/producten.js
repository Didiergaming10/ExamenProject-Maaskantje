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
    fetch("api/get-products.php")
      .then(res => res.json())
      .then(data => {
        const sortBy = document.getElementById("sort-by")?.value || "naam";
        const searchTerm = document.getElementById("search-products")?.value.toLowerCase() || "";

        const filters = {
          geenVarkensvlees: document.getElementById("filter-geen-varkensvlees")?.checked,
          veganistisch: document.getElementById("filter-veganistisch")?.checked,
          vegetarisch: document.getElementById("filter-vegetarisch")?.checked
        };

        let products = data;

        if (currentCategory !== "all") {
          products = products.filter(p => p.categorie === currentCategory);
        }

        if (searchTerm) {
          products = products.filter(p =>
            p.naam.toLowerCase().includes(searchTerm) ||
            p.ean.toLowerCase().includes(searchTerm)
          );
        }

        products = products.filter(p => {
          if (filters.geenVarkensvlees && !p.dieetwensen.includes("geen-varkensvlees")) return false;
          if (filters.veganistisch && !p.dieetwensen.includes("veganistisch")) return false;
          if (filters.vegetarisch && !p.dieetwensen.includes("vegetarisch")) return false;
          return true;
        });

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
        <td class="px-6 py-4"><button class="text-blue-600 hover:underline edit-product" data-id="${p.id}">Bewerken</button></td>
      `;
      tbody.appendChild(row);
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

  // Dieetwensen filters
  ["filter-geen-varkensvlees", "filter-veganistisch", "filter-vegetarisch"].forEach(id => {
    document.getElementById(id)?.addEventListener("change", loadProducts);
  });

  // Select all checkbox
  document.getElementById("select-all-products")?.addEventListener("change", e => {
    const checked = e.target.checked;
    document.querySelectorAll(".product-checkbox").forEach(cb => cb.checked = checked);
  });

  // Add product modal (simplified for demo)
  document.getElementById("add-product")?.addEventListener("click", () => {
    document.getElementById("product-modal").classList.remove("hidden");
  });

  document.getElementById("cancel-product")?.addEventListener("click", () => {
    document.getElementById("product-modal").classList.add("hidden");
  });

  document.getElementById("close-modal")?.addEventListener("click", () => {
    document.getElementById("product-modal").classList.add("hidden");
  });

  if (user.role !== "directie") {
    document.getElementById("remove-product")?.classList.add("hidden");
  }

  loadProducts();
});
