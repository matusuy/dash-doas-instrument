// https://sebhastian.com/javascript-csv-to-array/

function parsear(){
  console.log("parsear")
  var file_url = './SkySpec210711.txt';
  console.log(file_url);
  fetch(file_url)
    .then(response => response.text())
    .then(text => csvToArray(text))
}

function pintarDiv(id, alerta){

  // alerta 1: parametro fuera de rango
  // alerta 0: Todo OK
  // alerta -1: No hay dato nuevo, alerta!

  if (alerta==1){ // ERROR!
    document.getElementById(id).style.borderColor = "red";
    document.getElementById(id).style.backgroundColor = "red";
    document.getElementById(id).style.color = "white";
  }else if (alerta==0){ // TODO OK!!
    document.getElementById(id).style.borderColor = "green";
    document.getElementById(id).style.backgroundColor = "gray";
    document.getElementById(id).style.color = "black";
  }else{ // NO HAY DATO!!
    document.getElementById(id).style.borderColor = "yellow";
    document.getElementById(id).style.backgroundColor = "yellow";
    document.getElementById(id).style.color = "black";
  }

}

function csvToArray(str, delimiter = " ") {
  console.log("csvToArray")
  console.log(str)
  var headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  var rows = str.slice(str.indexOf("\n") + 1).split("\n");

  var arr = rows.map(function (row) {
    var values = row.split(delimiter);
    var el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  console.log(arr)

  var ultima_fila = arr[arr.length-1];
  var TempOutdoor = ultima_fila["TempOutdoor"];
  console.log(ultima_fila["Date"]);
  console.log(ultima_fila["Time"]);
  console.log(TempOutdoor);

// 12.13.2022 15:30:09 1014 27.16 24.97 5.43 20.003 -1 -1 7.28 0.007 341 -16204 -32 89.91 0.18 9 33.49 11.951 0 0.47 0.009 -1 -1 0.012 0 0.007 0 90 0 90 0 89.95 0

  // var today = new Date();
  // var dd = String(today.getDate()).padStart(2, '0');
  // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  // var yyyy = today.getFullYear();
  // today = mm + '/' + dd + '/' + yyyy;

  // chequear fecha actula VS fecha ultima medida, si es mayor que 10 min alerta amarillo
  // if fecha
  //     pintarDiv('TempOutdoor', -1);

  var TEN_MINUTES = 10*60*1000;
  var [month, day, year] = ultima_fila["Date"].split('.');
  var [hh, mm, ss] = ultima_fila["Time"].split(':');
  var last_measure = new Date(+year, +month - 1, +day, +hh, +mm, +ss);
  if (Date.now() - last_measure > TEN_MINUTES) {
    console.log("Date ERROR");
  }else{
    console.log("Date OK");
  }
  console.log(Date.now())
  console.log(last_measure)

  document.getElementById('TempOutdoor').innerHTML = TempOutdoor.toString(2) + " ºC";

  if (TempOutdoor < 5){
    console.log("if error");
    pintarDiv('TempOutdoor', 1);
  }else{
    pintarDiv('TempOutdoor', 0);
  }

  // return the array
  return arr;
}

// timer callback

// cargar última fila
// chequeak límites de los datos
// cargar datos en la web
// según límites dibujar alerta

setInterval(function(){
  console.log("timer!")
  parsear();
}, 15000) /* time in milliseconds (ie 10 minutes) 2000=2s 300000=5min 600000=10min*/

document.addEventListener("DOMContentLoaded", function(event) { 

  // mandar al css
  document.getElementById('TempOutdoor').style.borderWidth = "thick";
  document.getElementById('TempOutdoor').style.borderStyle = "solid";

  parsear();
});
