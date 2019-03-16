var temps = 3000;
var idOld = "";

guardarTempsModal = document.getElementById('guardarModalRefresc');
guardarTempsModal.addEventListener('click', setTime);

// #############################################################################
// ----------------------------Control interval refresc-------------------------
// #############################################################################

// Funcions que s'executen despres de que el document estigui carregat, printen
// el interval i es fa la trucada a la funcio per la peticio JSON
$(document).ready(function() {
  var html = $('#freqActu').html((temps / 1000));
});

//$( document ).ready(agafaBicis());
var jsonAction = setInterval(agafaBicis, temps);

function restartAction() {
  jsonAction = setInterval(agafaBicis, temps);

  // Modifiquem el HTML amb el nou temps
  $('#freqActu').html((temps / 1000));
}

// Esto no va muy fino
function stopAction() {
  clearInterval(jsonAction);

  // Modifiquem el HTML amb el nou temps
  $('#freqActu').html(0);
}

function setTime() {
  tempsRefresc = document.getElementById('modalRefrescTemps').value;
  temps = tempsRefresc * 1000;

  // Modifiquem el HTML amb el nou temps
  $('#freqActu').html((temps / 1000));

  // Actualitzem amb el nou temps
  clearInterval(jsonAction);
  jsonAction = setInterval(agafaBicis, temps);
}



// #############################################################################
// ---------------------------------Carrega mapa--------------------------------
// #############################################################################

var mymap = L.map('map').setView([41.3979064, 2.1531522], 12.4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoieGVybWkxNSIsImEiOiJjanRhZjVvcnowYTlqNDNvMzZtczc4eHVwIn0.qMvwEdGoItzyJEB7bQ-Ghg', {
  maxZoom: 18,
  attribution: 'el xermi15 y el aaroon9',
  id: 'mapbox.streets'
}).addTo(mymap);



// #############################################################################
// --------------------------------Actualitzar bicis----------------------------
// #############################################################################

//Funcion que s'encarrega de accedir al document JSON i crear els marcadors que sortiran al mapa
function agafaBicis() {
  var json = $.getJSON("https://cors.io/?http://wservice.viabicing.cat/v2/stations", function(data) {
      console.log(data);
      idNew = data.updateTime;
      // console.log(data.stations.ID);
      if (idNew != idOld || idOld == "") {
        var slotsN = 0;
        var slotsE = 0;
        var bicisN = 0;
        var bicisE = 0;
        var stationsN = 0;
        var stationsE = 0;
        for (var i = 0; i < data.stations.length; i++) {
          if (data.stations[i].type == 'BIKE') {
            slotsN += parseInt(data.stations[i].slots);
            bicisN += parseInt(data.stations[i].bikes);
            stationsN++;
          } else {
            slotsE += parseInt(data.stations[i].slots);
            bicisE += parseInt(data.stations[i].bikes);
            stationsE++;
          }
          var marker = L.marker([data.stations[i].latitude, data.stations[i].longitude]).addTo(mymap);
        }

        drawChart(stationsN, stationsE);

        $('#all').append("<h3>Nova actualitzacio " + data.updateTime + "</h3>" +
          "<p>Estacio tipus: <strong>BIKE</strong>.   Hi ha " + stationsN + " estacions amb " + bicisN + " bicis disponibles i " + (slotsN - bicisN) + " slots lliures </p>" +
          "<p>Estacio tipus: <strong>E-BIKE</strong>. Hi ha " + stationsE + " estacions amb " + bicisE + " bicis disponibles i " + (slotsE - bicisE) + " slots lliures </p><br>");
        idOld = idNew;
      }
    })
    .done(function() {
      console.log('done');
    })
    .fail(function() {
      alert("Error");
    })
    .always(function() {
      console.log('Always');
    });
}



// #############################################################################
// --------------------------------Actualitzar bicis----------------------------
// #############################################################################

google.charts.load("current", {
  packages: ["corechart"]
});
google.charts.setOnLoadCallback(drawChart);

function drawChart(bikeStation, eBikeStations) {
  var data = google.visualization.arrayToDataTable([
    ['Station', 'Number'],
    ['BIKE', bikeStation],
    ['E-BIKE', eBikeStations],
  ]);

  var options = {
    title: "Tipus d'estacions",
    pieHole: 0.3,
  };

  var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
  chart.draw(data, options);
}
