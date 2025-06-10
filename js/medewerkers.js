document.addEventListener("DOMContentLoaded", function() {
    let medewerkers = [];
    let currentSort = { key: null, asc: true };

    const tableBody = document.getElementById("medewerkers-table-body");
    const filterInput = document.getElementById("medewerkers-filter");
    const showBlockedCheckbox = document.getElementById("show-blocked");

    function loadMedewerkers() {
        fetch("php/medewerkers-api.php")
            .then(res => res.json())
            .then(data => {
                medewerkers = data;
                renderTable();
            });
    }

    function renderTable() {
        let filtered = medewerkers;
        const filter = (filterInput?.value || "").toLowerCase();
        const showBlocked = showBlockedCheckbox?.checked;

        // Filter op zoekterm
        if (filter) {
            filtered = filtered.filter(m =>
                (m.naam || "").toLowerCase().includes(filter) ||
                (m.email || "").toLowerCase().includes(filter) ||
                (m.telefoon || "").toLowerCase().includes(filter) ||
                (m.rol || "").toLowerCase().includes(filter) ||
                (m.status || "").toLowerCase().includes(filter)
            );
        }

        // Filter op status (actief/geblokkeerd)
        if (!showBlocked) {
            filtered = filtered.filter(m => (m.status || '').toLowerCase() !== 'geblokkeerd');
        }

        if (currentSort.key) {
            filtered.sort((a, b) => {
                let valA = a[currentSort.key] || "";
                let valB = b[currentSort.key] || "";
                valA = typeof valA === "string" ? valA.toLowerCase() : valA;
                valB = typeof valB === "string" ? valB.toLowerCase() : valB;
                if (valA < valB) return currentSort.asc ? -1 : 1;
                if (valA > valB) return currentSort.asc ? 1 : -1;
                return 0;
            });
        }

        tableBody.innerHTML = "";
        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500">Geen medewerkers gevonden.</td></tr>`;
            return;
        }
        filtered.forEach(row => {
            const isBlocked = (row.status || '').toLowerCase() === 'geblokkeerd';
            tableBody.innerHTML += `
                <tr${isBlocked ? ' class="bg-red-100"' : ''}>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                        ${row.naam}
                        ${isBlocked ? '<span class="ml-2 px-2 py-1 text-xs rounded bg-red-400 text-white">Geblokkeerd</span>' : ''}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">${row.email}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${row.telefoon}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${row.rol}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${row.status}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <button class="text-blue-600 hover:underline mr-4 edit-btn"
                            data-id="${row.id}"
                            data-voornaam="${row.voornaam || ''}"
                            data-achternaam="${row.achternaam || ''}"
                            data-email="${row.email || ''}"
                            data-telefoon="${row.telefoon || ''}"
                            data-rol="${row.rol || ''}"
                            data-status="${row.status || ''}">Bewerk</button>
                        <button class="text-red-600 hover:underline delete-btn"
                            data-id="${row.id}"
                            data-naam="${row.naam}">Verwijder</button>
                    </td>
                </tr>
            `;
        });

        // Herkoppel events voor bewerk/verwijder
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                openMedewerkerModal('edit', btn.dataset);
            });
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteId = btn.dataset.id;
                deleteText.textContent = `Weet je zeker dat je ${btn.dataset.naam} wilt verwijderen?`;
                deleteModal.classList.remove('hidden');
                deleteModal.classList.add('flex');
            });
        });
    }

    // Filter
    if (filterInput) {
        filterInput.addEventListener('input', renderTable);
    }
    if (showBlockedCheckbox) {
        showBlockedCheckbox.addEventListener('change', renderTable);
    }

    // Sorteren
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', function() {
            const key = th.getAttribute('data-sort');
            if (currentSort.key === key) {
                currentSort.asc = !currentSort.asc;
            } else {
                currentSort.key = key;
                currentSort.asc = true;
            }
            renderTable();
        });
    });

    // Voeg toe knop
    const addBtn = document.getElementById('add-medewerker');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            openMedewerkerModal('create');
        });
    }

    // Modal elementen
    const medewerkerModal = document.getElementById('medewerker-modal');
    const medewerkerForm = document.getElementById('medewerker-form');
    const modalTitle = document.getElementById('modal-title');
    const modalAction = document.getElementById('modal-action');
    const medewerkerId = document.getElementById('medewerker-id');
    const passwordFields = document.getElementById('password-fields');
    const modalError = document.getElementById('modal-error');
    const cancelBtn = document.getElementById('cancel-btn');
    const closeModalBtn = document.getElementById('close-modal');

    const deleteModal = document.getElementById('delete-modal');
    const deleteText = document.getElementById('delete-text');
    let deleteId = null;
    const deleteCancel = document.getElementById('delete-cancel');
    const deleteConfirm = document.getElementById('delete-confirm');

    // Modal sluiten
    function closeMedewerkerModal() {
        medewerkerModal.classList.add('hidden');
        medewerkerModal.classList.remove('flex');
        modalError.classList.add('hidden');
        medewerkerForm.reset();
        passwordFields.style.display = '';
    }
    if (closeModalBtn) closeModalBtn.onclick = closeMedewerkerModal;
    if (cancelBtn) cancelBtn.onclick = closeMedewerkerModal;

    // Delete modal sluiten
    if (deleteCancel) {
        deleteCancel.onclick = function() {
            deleteModal.classList.add('hidden');
            deleteModal.classList.remove('flex');
            deleteId = null;
        };
    }

    // Medewerker modal openen (voor create of edit)
    function openMedewerkerModal(type, data = {}) {
        medewerkerForm.reset();
        modalError.classList.add('hidden');
        if (type === 'create') {
            modalTitle.textContent = 'Medewerker toevoegen';
            modalAction.value = 'create';
            medewerkerId.value = '';
            passwordFields.style.display = '';
        } else {
            modalTitle.textContent = 'Medewerker bewerken';
            modalAction.value = 'edit';
            medewerkerId.value = data.id || '';
            document.getElementById('voornaam').value = data.voornaam || '';
            document.getElementById('achternaam').value = data.achternaam || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('telefoon').value = data.telefoon || '';
            document.getElementById('rol').value = data.rol || 'vrijwilliger';
            document.getElementById('status').value = data.status || 'actief';
            passwordFields.style.display = 'none';
        }
        medewerkerModal.classList.remove('hidden');
        medewerkerModal.classList.add('flex');
    }

    // Formulier submit (create/edit)
    if (medewerkerForm) {
        medewerkerForm.onsubmit = async function(e) {
            e.preventDefault();
            modalError.classList.add('hidden');
            const formData = new FormData(medewerkerForm);

            // Extra check wachtwoord bij create
            if (modalAction.value === 'create') {
                if (!formData.get('password') || !formData.get('confirm-password')) {
                    showModalError('Wachtwoord is verplicht.');
                    return;
                }
                if (formData.get('password') !== formData.get('confirm-password')) {
                    showModalError('Wachtwoorden komen niet overeen.');
                    return;
                }
            }

            // Stuur naar API
            const resp = await fetch('php/medewerker-api.php', { method: 'POST', body: formData });
            const text = await resp.text();
            console.log(text);
            const result = JSON.parse(text);
            if (result.success) {
                window.location.reload();
            } else {
                showModalError(result.error || 'Onbekende fout');
            }
        };
    }

    function showModalError(msg) {
        modalError.textContent = msg;
        modalError.classList.remove('hidden');
    }

    // Delete bevestigen
    if (deleteConfirm) {
        deleteConfirm.onclick = async function() {
            if (!deleteId) return;
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('id', deleteId);
            const resp = await fetch('php/medewerker-api.php', { method: 'POST', body: formData });
            const result = await resp.json();
            if (result.success) {
                window.location.reload();
            } else {
                alert(result.error || 'Onbekende fout');
            }
        };
    }

    loadMedewerkers();
});