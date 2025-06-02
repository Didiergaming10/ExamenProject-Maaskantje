const ctx = document.getElementById('myChart');

fetch("chartsjs-backend.php")
.then((response) =>{
    return response.json();
})
.then((data) =>{
    createChart(data,'bar')
});

/*fetch("chartsjs-backend.php")
.then((response) => {
    console.log(response.json());
    return response.json();
})
.then((data) =>{
    console.log(data);
    createChart(data,'bar')
});*/

/*async function getData() {
    try {
        const response = await fetch("chartsjs-backend .php");
        if (!response.ok) {
            throw new Error();
        }

        console.log(response);

        const json = await response.json();
        console.log(json);
        return json;
    } catch(error) {
        console.error(error.message);
    }
}*/

function createChart(chartData, type){

  new Chart(ctx, {
    type: type,
    data: {
      labels: chartData.map(row => row.naam),
      datasets: [{
        label: '# Aantal',
        backgroundColor:['rgb(34, 158, 86)'],
        borderColor:['rgb(0, 0, 0)'],
        data: chartData.map(row => row.op_voorraad),
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  }); 
}