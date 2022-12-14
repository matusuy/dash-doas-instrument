// https://sebhastian.com/javascript-csv-to-array/

const removeEmptyLines = str => str.split(/\r?\n/).filter(line => line.trim() !== '').join('\n');

function parsear(){
  // console.log("parsear")
  var file_url = './SkySpec210711.txt' + '?' + new Date().getTime();
  // console.log(file_url);
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
    document.getElementById(id).style.backgroundColor = "LightGray";
    document.getElementById(id).style.color = "black";
  }else{ // NO HAY DATO!!
    document.getElementById(id).style.borderColor = "yellow";
    document.getElementById(id).style.backgroundColor = "yellow";
    document.getElementById(id).style.color = "black";
  }

}

function csvToArray(str, delimiter = " ") {
  // console.log("csvToArray")
  // console.log(str)

  str = removeEmptyLines(str)

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

  // console.log(arr)

  var ultima_fila = arr[arr.length-1];
  var TempOutdoor = ultima_fila["TempOutdoor"];
  // console.log(ultima_fila["Date"]);
  // console.log(ultima_fila["Time"]);
  // console.log(TempOutdoor);

  var TEN_MINUTES = 10*60*1000;
  var [month, day, year] = ultima_fila["Date"].split('.');
  var [hh, mm, ss] = ultima_fila["Time"].split(':');
  var last_measure = new Date(+year, +month - 1, +day, +hh, +mm, +ss);
  var today = new Date();

  document.getElementById('Last').innerHTML = last_measure.toLocaleString(); // .slice(0,10)
  document.getElementById('Now').innerHTML = today.toLocaleString(); // .slice(0,10)

  if (today - last_measure > TEN_MINUTES) {
    // console.log("Date ERROR");
    pintarDiv('DateTime', 1);
  }else{
    // console.log("Date OK");
    pintarDiv('DateTime', 0);
  }
  // console.log(today)
  // console.log(last_measure)

  document.getElementById('TempOutdoor').innerHTML = TempOutdoor.toString(2) + " ºC";

  if (TempOutdoor < 5){
    // console.log("if error");
    pintarDiv('Temp', 1);
  }else{
    pintarDiv('Temp', 0);
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
  // console.log("timer!")
  parsear();
}, 15000) /* time in milliseconds (ie 10 minutes) 2000=2s 300000=5min 600000=10min*/

document.addEventListener("DOMContentLoaded", function(event) { 

  // mandar al css
  document.getElementById('TempOutdoor').style.borderWidth = "thick";
  document.getElementById('TempOutdoor').style.borderStyle = "solid";

  parsear();
});
