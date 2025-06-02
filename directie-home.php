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
</head>

<body class="font-[Poppins] h-screen">
<?php include 'header.php'; ?>

    <hr style="height:2px;border-width:0;color:gray;background-color:gray">
    
    <script>
  function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById('searchInput').value.toLowerCase().trim();

    // Define valid pages and their corresponding files
    const pages = {
      'medewerkers': 'medewerkers.php',
      'producten': 'producten.php',
      'klanten': 'klanten.php',
      'leveranciers': 'leveranciers.php',
      'voedselpakketten': 'voedselpakketten.php',
      'account': 'create-account.php',
      'dashboard': 'dashboard.php'
    };

    if (pages[query]) {
      window.location.href = pages[query];
    } else {
      alert('Pagina niet gevonden.');
    }
  }
</script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

  <body class="bg-success">
    <div class="col-8 offset-2 my-5">
        <div class="card">
            <div class="card-body">
                <h5>producten overzicht</h5>
                <hr>
                <canvas id="myChart"></canvas>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <script src="js/producten-charts.js"></script>

  </body>


</body>

</html>