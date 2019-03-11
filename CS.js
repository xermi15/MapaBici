$( document ).ready(agafaBicis());
setInterval(agafaBicis, 10000);
// window.onload(agafaBicis());

var mymap = L.map('map').setView([51.505, -0.09], 5);


function agafaBicis() {
  var json = $.getJSON("https://cors.io/?http://wservice.viabicing.cat/v2/stations", function(data){
    console.log(data);
    // console.log(data.stations.ID);

    var slotsN = 0; var slotsE = 0;
    var bicisN = 0; var bicisE = 0;
    var stationsN = 0; var stationsE = 0;
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
      var marker = L.marker([data.stations[i].latitude,data.stations[i].longitude]).addTo(mymap);
    }

    $('#all').append( "<h3>Nova actualitzacio " + data.updateTime + "</h3>" +
            "<p>Estacio tipus: <strong>BIKE</strong>.   Hi ha " + stationsN + " estacions amb " + bicisN + " bicis disponibles i " + (slotsN - bicisN) + " slots lliures </p>" +
            "<p>Estacio tipus: <strong>E-BIKE</strong>. Hi ha " + stationsE + " estacions amb " + bicisE + " bicis disponibles i " + (slotsE - bicisE) + " slots lliures </p><br>" );

  })


  .done(function() { console.log('done'); })
  .fail(function() { alert( "Error");  })
  .always(function() { console.log('Always'); });
}

// $('#mayus').on('click', function(){
//   peticioAjax("E3.php");
// });
