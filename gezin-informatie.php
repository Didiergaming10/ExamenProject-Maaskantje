<?php
include 'php/connection.php';
include 'auth.php';
require_role([1]);
include 'header.php';
?>

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gezin Informatie - Voedselbank Maaskantje</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 class="text-2xl font-bold text-center mb-6">Voedselbank Maaskantje</h1>
            <h2 class="text-xl font-semibold mb-4">Gezin informatie</h2>
            <form id="gezin-form" class="space-y-6">
                <div>
                    <label for="gezin-naam" class="block text-sm font-medium text-gray-700">Naam gezin</label>
                    <input type="text" id="gezin-naam" name="gezin-naam" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                </div>
                <div>
                    <label for="postcode" class="block text-sm font-medium text-gray-700">Postcode</label>
                    <input type="text" id="postcode" name="postcode" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                </div>
                <div>
                    <label for="telefoon" class="block text-sm font-medium text-gray-700">Telefoon nummer</label>
                    <input type="tel" id="telefoon" name="telefoon" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Dieetwensen:</label>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex items-center">
                            <input type="checkbox" id="geen-varkensvlees" name="dieetwensen" value="geen-varkensvlees" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded">
                            <label for="geen-varkensvlees" class="ml-2 block text-sm text-gray-700">geen varkensvlees</label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="veganistisch" name="dieetwensen" value="veganistisch" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded">
                            <label for="veganistisch" class="ml-2 block text-sm text-gray-700">veganistisch</label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="vegetarisch" name="dieetwensen" value="vegetarisch" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded">
                            <label for="vegetarisch" class="ml-2 block text-sm text-gray-700">vegetarisch</label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="allergisch" name="dieetwensen" value="allergisch" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded">
                            <label for="allergisch" class="ml-2 block text-sm text-gray-700">allergisch</label>
                        </div>
                    </div>
                    <div class="mt-2">
                        <input type="text" id="allergenen" name="allergenen" placeholder="Lactose, Gluten, Pinda's" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    </div>
                </div>
                
                <div id="gezinsleden-container">
                    <h3 class="text-lg font-medium mb-2">Gezinsleden</h3>
                    <div class="gezinslid-item border p-4 rounded-md mb-4">
                        <div class="grid grid-cols-3 gap-4 mb-2">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Geboortedatum</label>
                                <div class="grid grid-cols-3 gap-2">
                                    <input type="text" placeholder="DD" maxlength="2" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                                    <input type="text" placeholder="MM" maxlength="2" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                                    <input type="text" placeholder="JJJJ" maxlength="4" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <button type="button" id="add-gezinslid" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Voeg gezinslid toe
                    </button>
                </div>
                
                <div>
                    <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Maak account
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script src="js/gezin.js"></script>
</body>
</html>
