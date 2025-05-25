<!doctype html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FONTS -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700&display=swap"
        rel="stylesheet">
    <script src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js"></script>
</head>

<body class="font-[Poppins] h-screen">
    <header class="bg-white">
        <nav class="flex justify-between items-center w-[92%]  mx-auto">
            <div>
                <img class="w-16 cursor-pointer" src="https://upload.wikimedia.org/wikipedia/commons/c/c0/Molen_De_Pelikaan_van_achteren_gefotografeerd_-_Maaskantje_-_20468953_-_RCE.jpg" alt="...">
            </div>

                <form id="searchForm" class="flex items-center border border-gray-300 rounded-full overflow-hidden" onsubmit="return handleSearch(event)">
  <input type="text" id="searchInput" placeholder="Zoek pagina..." class="px-4 py-1 focus:outline-none" />
  <button type="submit" class="bg-[#a6c1ee] text-white px-4 py-1">Zoek</button>
</form>

            <div
                class=" duration-500 md:static absolute bg-white md:min-h-fit min-h-[60vh] left-0 top-[-100%] md:w-auto  w-full flex items-right px-5">
                <ul class="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
                    <li>
                        <a class="hover:text-gray-500" href="medewerkers.php">Medewerkers</a>
                    </li>
                    <li>
                        <a class="hover:text-gray-500" href="producten.php">Producten</a>
                    </li>
                    <li>
                        <a class="hover:text-gray-500" href="klanten.php">Klanten</a>
                    </li>
                    <li>
                        <a class="hover:text-gray-500" href="leveranciers.php">Leveranciers</a>
                    </li>
                    <li>
                        <a class="hover:text-gray-500" href="voedselpakketten.php">Voedselpakketten</a>
                    </li>
                </ul>


            </div>
            <div class="flex items-center gap-6">
              <a href="create-account.php></a>
                <button class="bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec]">account informatie</button>

                
            </div>
    </header>
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

</body>
<h1>test test test</h1>

</html>