<?php
session_start();
include 'php/connection.php';
include 'auth.php';
?>
<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="font-[Poppins] h-screen bg-success">
<?php include 'header.php'; ?>
<hr style="height:2px;border-width:0;color:gray;background-color:gray">

<div class="container my-5">
    <div class="row">
        <div class="col-md-6">
            <div class="card mb-4">
                <div class="card-body">
                    <h5>Maandoverzicht per productcategorie</h5>
                    <form id="cat-form" class="row g-2 mb-3">
                        <div class="col">
                            <select id="cat-month" class="form-select">
                                <option value="">Maand (alles)</option>
                                <?php for ($m=1; $m<=12; $m++): ?>
                                    <option value="<?= $m ?>"><?= date('F', mktime(0,0,0,$m,1)) ?></option>
                                <?php endfor; ?>
                            </select>
                        </div>
                        <div class="col">
                            <select id="cat-year" class="form-select">
                                <option value="">Jaar (alles)</option>
                                <?php for ($y = date('Y'); $y >= 2022; $y--): ?>
                                    <option value="<?= $y ?>"><?= $y ?></option>
                                <?php endfor; ?>
                            </select>
                        </div>
                        <div class="col">
                            <button type="submit" class="btn btn-success">Toon</button>
                        </div>
                    </form>
                    <canvas id="catChart"></canvas>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card mb-4">
                <div class="card-body">
                    <h5>Maandoverzicht per postcode</h5>
                    <form id="postcode-form" class="row g-2 mb-3">
                        <div class="col">
                            <select id="postcode-month" class="form-select">
                                <option value="">Maand (alles)</option>
                                <?php for ($m=1; $m<=12; $m++): ?>
                                    <option value="<?= $m ?>"><?= date('F', mktime(0,0,0,$m,1)) ?></option>
                                <?php endfor; ?>
                            </select>
                        </div>
                        <div class="col">
                            <select id="postcode-year" class="form-select">
                                <option value="">Jaar (alles)</option>
                                <?php for ($y = date('Y'); $y >= 2022; $y--): ?>
                                    <option value="<?= $y ?>"><?= $y ?></option>
                                <?php endfor; ?>
                            </select>
                        </div>
                        <div class="col">
                            <button type="submit" class="btn btn-success">Toon</button>
                        </div>
                    </form>
                    <canvas id="postcodeChart"></canvas>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
function fetchAndRender(endpoint, params, chartId, labelKey, dataKey) {
    const url = new URL('php/rapportage-api.php', window.location.origin);
    Object.entries(params).forEach(([k,v]) => { if (v) url.searchParams.append(k, v); });
    url.searchParams.append('type', endpoint);

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const ctx = document.getElementById(chartId).getContext('2d');
            if (window[chartId] && typeof window[chartId].destroy === "function") {
                window[chartId].destroy();
            }
            window[chartId] = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.map(row => row[labelKey]),
                    datasets: [{
                        label: 'Aantal',
                        data: data.map(row => row[dataKey]),
                        backgroundColor: 'rgba(34,158,86,0.7)',
                        borderColor: 'rgba(34,158,86,1)',
                        borderWidth: 1
                    }]
                },
                options: { scales: { y: { beginAtZero: true } } }
            });
        });
}

// Productcategorie rapportage
document.getElementById('cat-form').addEventListener('submit', function(e){
    e.preventDefault();
    fetchAndRender(
        'categorie',
        { maand: document.getElementById('cat-month').value, jaar: document.getElementById('cat-year').value },
        'catChart',
        'categorie', 'aantal'
    );
});
// Postcode rapportage
document.getElementById('postcode-form').addEventListener('submit', function(e){
    e.preventDefault();
    fetchAndRender(
        'postcode',
        { maand: document.getElementById('postcode-month').value, jaar: document.getElementById('postcode-year').value },
        'postcodeChart',
        'postcode', 'aantal'
    );
});

// Initial load
fetchAndRender('categorie', {}, 'catChart', 'categorie', 'aantal');
fetchAndRender('postcode', {}, 'postcodeChart', 'postcode', 'aantal');
</script>
</body>
</html>