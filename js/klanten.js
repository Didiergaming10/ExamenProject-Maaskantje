// Klanten management functionality

document.addEventListener("DOMContentLoaded", () => {

  // Load klanten
  loadKlanten()

  // Add event listeners
  const addKlantBtn = document.getElementById("add-klant")
  if (addKlantBtn) {
    addKlantBtn.addEventListener("click", () => {
      openKlantModal()
    })
  }

  const multiSelectBtn = document.getElementById("multi-select")
  if (multiSelectBtn) {
    multiSelectBtn.addEventListener("click", () => {
      toggleMultiSelect()
    })
  }

  const selectAllKlantenCheckbox = document.getElementById("select-all-klanten")
  if (selectAllKlantenCheckbox) {
    selectAllKlantenCheckbox.addEventListener("change", () => {
      const checkboxes = document.querySelectorAll(".klant-checkbox")
      checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAllKlantenCheckbox.checked
      })
    })
  }

  const searchInput = document.getElementById("search-klanten")
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      loadKlanten()
    })
  }

  // Klant modal form
  const klantForm = document.getElementById("klant-form")
  if (klantForm) {
    klantForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveKlant()
    })
  }

  const cancelKlantBtn = document.getElementById("cancel-klant")
  if (cancelKlantBtn) {
    cancelKlantBtn.addEventListener("click", () => {
      closeKlantModal()
    })
  }

  const closeModalBtn = document.getElementById("close-modal")
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      closeKlantModal()
    })
  }

  const addGezinslidBtn = document.getElementById("add-gezinslid")
  if (addGezinslidBtn) {
    addGezinslidBtn.addEventListener("click", () => {
      addGezinslid()
    })
  }

  // Functions
  let currentSort = { key: null, asc: true };
  let allGezinnen = [];

  function loadKlanten() {
    const tableBody = document.getElementById("klanten-table-body");
    const searchTerm = document.getElementById("klanten-filter")?.value.toLowerCase() || "";
    const showInactive = document.getElementById("show-inactive")?.checked;

    fetch("php/klanten-api.php" + (showInactive ? "?all=1" : ""))
        .then((res) => res.json())
        .then((gezinnen) => {
            allGezinnen = gezinnen;

            // Filter gezinnen by search term
            let filteredGezinnen = gezinnen;
            if (searchTerm) {
                filteredGezinnen = gezinnen.filter(
                    (gezin) =>
                        gezin.naam.toLowerCase().includes(searchTerm) ||
                        gezin.postcode.toLowerCase().includes(searchTerm) ||
                        gezin.email.toLowerCase().includes(searchTerm)
                );
            }

            // Sorteren
            if (currentSort.key) {
                filteredGezinnen.sort((a, b) => {
                    let valA = a[currentSort.key];
                    let valB = b[currentSort.key];
                    if (currentSort.key === "aantal") {
                        valA = (a.gezinsleden && a.gezinsleden.length) ? a.gezinsleden.length : 0;
                        valB = (b.gezinsleden && b.gezinsleden.length) ? b.gezinsleden.length : 0;
                    }
                    if (typeof valA === "string") valA = valA.toLowerCase();
                    if (typeof valB === "string") valB = valB.toLowerCase();
                    if (valA < valB) return currentSort.asc ? -1 : 1;
                    if (valA > valB) return currentSort.asc ? 1 : -1;
                    return 0;
                });
            }

            // Clear table
            tableBody.innerHTML = "";

            // Add gezinnen to table
            filteredGezinnen.forEach((gezin) => {
                const isInactive = gezin.actief === 0 || gezin.actief === "0";

                const row = document.createElement("tr");
                row.className = isInactive ? "bg-red-100" : "";

                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap hidden multi-select-col">
                        <input type="checkbox" class="klant-checkbox focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" data-id="${gezin.id}">
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                        ${gezin.naam}
                        ${isInactive ? '<span class="ml-2 px-2 py-1 text-xs rounded bg-red-400 text-white">Gedeactiveerd</span>' : ''}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${gezin.postcode}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${gezin.email}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${gezin.telefoonnummer}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(gezin.gezinsleden && gezin.gezinsleden.length) ? gezin.gezinsleden.length : 0}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                        <button class="edit-klant text-green-600 hover:text-green-900" data-id="${gezin.id}">Wijzig</button>
                        ${isInactive
                            ? `<button class="activate-klant text-blue-600 hover:text-blue-900" data-id="${gezin.id}">Activeer</button>`
                            : `<button class="delete-klant text-red-600 hover:text-red-900" data-id="${gezin.id}">Verwijder</button>`
                        }
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Add event listeners to edit buttons
            const editButtons = document.querySelectorAll(".edit-klant");
            editButtons.forEach((button) => {
              button.addEventListener("click", () => {
                const klantId = Number.parseInt(button.getAttribute("data-id"));
                openKlantModal(klantId);
              });
            });

            const deleteButtons = document.querySelectorAll(".delete-klant");
            deleteButtons.forEach((button) => {
              button.addEventListener("click", () => {
                const klantId = Number.parseInt(button.getAttribute("data-id"));
                if (confirm("Weet je zeker dat je dit gezin wilt verwijderen?")) {
                  fetch("php/klanten-api.php?action=delete", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: klantId }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.success) {
                        if (data.inactive) {
                          alert("Deze klant heeft voedselpakketten en is nu inactief gemaakt.");
                        }
                        loadKlanten();
                      } else {
                        alert(data.error || JSON.stringify(data) || "Verwijderen mislukt");
                      }
                    })
                    .catch(() => alert("Verwijderen mislukt"));
                }
              });
            });

            const activateButtons = document.querySelectorAll(".activate-klant");
            activateButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    const klantId = Number.parseInt(button.getAttribute("data-id"));
                    if (confirm("Weet je zeker dat je deze klant weer actief wilt maken?")) {
                        fetch("php/klanten-api.php?action=activate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: klantId }),
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                if (data.success) {
                                    loadKlanten();
                                } else {
                                    alert(data.error || JSON.stringify(data) || "Activeren mislukt");
                                }
                            })
                            .catch(() => alert("Activeren mislukt"));
                    }
                });
            });
        });
  }



  function openKlantModal(klantId = null) {
    const modal = document.getElementById("klant-modal")
    const modalTitle = document.getElementById("modal-title")
    const klantForm = document.getElementById("klant-form")
    const klantIdInput = document.getElementById("klant-id")
    const gezinsledenContainer = document.getElementById("gezinsleden-container")

    // Clear form
    klantForm.reset()

    // Clear gezinsleden
    gezinsledenContainer.innerHTML = '<h3 class="text-lg font-medium mb-2">Gezinsleden</h3>'

    if (klantId) {
      // Edit existing klant
      modalTitle.textContent = "Klant wijzigen";
      klantIdInput.value = klantId;

      fetch("php/klanten-api.php")
        .then(res => res.json())
        .then(gezinnen => {
          const gezin = gezinnen.find(g => g.id == klantId);
          if (gezin) {
            document.getElementById("gezin-naam").value = gezin.naam;
            document.getElementById("postcode").value = gezin.postcode;
            document.getElementById("email").value = gezin.email;
            document.getElementById("telefoon").value = gezin.telefoonnummer;

            // Set diet checkboxes
            if (gezin.dieetwensen) {
              // Bekende dieetwensen
              const standaardWensen = ["geen-varkensvlees", "veganistisch", "vegetarisch", "allergisch"];
              document.getElementById("geen-varkensvlees").checked = gezin.dieetwensen.includes("geen-varkensvlees");
              document.getElementById("veganistisch").checked = gezin.dieetwensen.includes("veganistisch");
              document.getElementById("vegetarisch").checked = gezin.dieetwensen.includes("vegetarisch");
              document.getElementById("allergisch").checked = gezin.dieetwensen.includes("allergisch");

              // Filter allergenen (die niet in de standaardlijst staan)
              const allergenen = gezin.dieetwensen
                .filter(wens => !standaardWensen.includes(wens))
                .join(", ");
              document.getElementById("allergenen").value = allergenen;
            }

            // Add gezinsleden
            gezinsledenContainer.innerHTML = '<h3 class="text-lg font-medium mb-2">Gezinsleden</h3>';
            if (gezin.gezinsleden && gezin.gezinsleden.length > 0) {
              gezin.gezinsleden.forEach(lid => addGezinslid(lid));
            }
          }
        });
    } else {
      // Add new klant
      modalTitle.textContent = "Klant toevoegen"
      klantIdInput.value = ""
    }

    // Show modal
    modal.classList.remove("hidden")
    modal.classList.add("flex")
  }

  function closeKlantModal() {
    const modal = document.getElementById("klant-modal")
    modal.classList.add("hidden")
    modal.classList.remove("flex")
  }

  function addGezinslid(geboortedatum = "") {
    const gezinsledenContainer = document.getElementById("gezinsleden-container")
    const gezinslidItem = document.createElement("div")
    gezinslidItem.className = "gezinslid-item border p-4 rounded-md mb-4"

    // Parse geboortedatum if provided
    let dag = "",
      maand = "",
      jaar = ""
    if (geboortedatum) {
      const parts = geboortedatum.split("/")
      if (parts.length === 3) {
        dag = parts[0]
        maand = parts[1]
        jaar = parts[2]
      }
    }

    gezinslidItem.innerHTML = `
            <div class="grid grid-cols-3 gap-4 mb-2">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Geboortedatum</label>
                    <div class="grid grid-cols-3 gap-2">
                        <input type="text" placeholder="DD" maxlength="2" value="${dag}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        <input type="text" placeholder="MM" maxlength="2" value="${maand}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        <input type="text" placeholder="JJJJ" maxlength="4" value="${jaar}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
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

  function saveKlant() {
    const klantId = document.getElementById("klant-id").value; 
    const gezinNaam = document.getElementById("gezin-naam").value;
    const postcode = document.getElementById("postcode").value;
    const email = document.getElementById("email").value;
    const telefoon = document.getElementById("telefoon").value;

    // Phone number length check
    if (telefoon.length > 10) {
        alert("Telefoonnummer mag maximaal 10 cijfers bevatten.");
        return;
    }

    // Get dieetwensen
    const dieetwensen = [];
    if (document.getElementById("geen-varkensvlees").checked) dieetwensen.push("geen-varkensvlees");
    if (document.getElementById("veganistisch").checked) dieetwensen.push("veganistisch");
    if (document.getElementById("vegetarisch").checked) dieetwensen.push("vegetarisch");
    if (document.getElementById("allergisch").checked) dieetwensen.push("allergisch");

    // Get allergenen
    const allergenen = document.getElementById("allergenen").value;

    // Get gezinsleden
    const gezinsleden = [];
    document.querySelectorAll(".gezinslid-item").forEach((item) => {
      const inputs = item.querySelectorAll("input");
      const dag = inputs[0].value;
      const maand = inputs[1].value;
      const jaar = inputs[2].value;
      if (dag && maand && jaar) {
        // Format as YYYY-MM-DD for MySQL
        gezinsleden.push(`${jaar}-${maand.padStart(2, '0')}-${dag.padStart(2, '0')}`);
      }
    });

    fetch("php/klanten-api.php?action=save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: klantId, 
        naam: gezinNaam,
        postcode: postcode,
        email: email,
        telefoon: telefoon,
        dieetwensen: dieetwensen,
        allergenen: allergenen,
        gezinsleden: gezinsleden,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          closeKlantModal();
          loadKlanten();
        } else {
          alert(data.error || JSON.stringify(data) || "Opslaan mislukt");
        }
      })
      .catch(() => alert("Opslaan mislukt"));
  }

  const filterInput = document.getElementById('klanten-filter');
  const tableBody = document.getElementById('klanten-table-body');

  if (filterInput) {
      filterInput.addEventListener('input', function () {
          const filter = filterInput.value.toLowerCase();
          Array.from(tableBody.children).forEach(row => {
              const text = row.textContent.toLowerCase();
              row.style.display = text.includes(filter) ? '' : 'none';
          });
      });
  }

  // Sorting event listeners
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', function () {
        const key = th.getAttribute('data-sort');
        if (currentSort.key === key) {
            currentSort.asc = !currentSort.asc;
        } else {
            currentSort.key = key;
            currentSort.asc = true;
        }
        loadKlanten();
    });
});

  // Filter en inactief toggle event listeners
  document.getElementById('klanten-filter').addEventListener('input', loadKlanten);
  document.getElementById('show-inactive').addEventListener('change', loadKlanten);
})
