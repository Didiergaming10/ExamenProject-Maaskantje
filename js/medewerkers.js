document.addEventListener("DOMContentLoaded", function() {
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

    // Voeg toe knop
    const addBtn = document.getElementById('add-medewerker');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            openMedewerkerModal('create');
        });
    }

    // Bewerk knoppen
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            openMedewerkerModal('edit', btn.dataset);
        });
    });

    // Verwijder knoppen
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteId = btn.dataset.id;
            deleteText.textContent = `Weet je zeker dat je ${btn.dataset.naam} wilt verwijderen?`;
            deleteModal.classList.remove('hidden');
            deleteModal.classList.add('flex');
        });
    });

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
});