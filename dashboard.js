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
    console.log("Alerta en " + id)
    document.getElementById(id).style.borderColor = "red";
    document.getElementById(id).style.backgroundColor = "red";
    document.getElementById(id).style.color = "white";
    // alertas_obj[p_alerta] = true;
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
  var TempOutdoor           = ultima_fila["TempOutdoor"];
  var TempSpectrometer      = ultima_fila["TempSpectrometer"];
  var HumidityOnElectronics = ultima_fila["HumidityOnElectronics"];
  var TempElectronics       = ultima_fila["TempElectronics"];
  var TempSpectrometerNoise = ultima_fila["TempSpectrometerNoise"];
  var SupplyVoltage         = ultima_fila["SupplyVoltage"];
  var CurrentTotal          = ultima_fila["CurrentTotal"];
  var PeltierPower          = ultima_fila["PeltierPower"];

  var ultima_fila_menos_1 = arr[arr.length-2];
  var ultima_fila_menos_2 = arr[arr.length-3];
  var ElevationAngle1 = ultima_fila_menos_2["ElevationAngle"];
  var ElevationAngle2 = ultima_fila_menos_1["ElevationAngle"];
  var ElevationAngle3 = ultima_fila["ElevationAngle"];


  // console.log(ultima_fila["Date"]);
  // console.log(ultima_fila["Time"]);
  // console.log(TempOutdoor);

  var NEW_DATA_MINUTES = 15*60*1000; // the first number is minutes
  var [month, day, year] = ultima_fila["Date"].split('.');
  var [hh, mm, ss] = ultima_fila["Time"].split(':');
  var last_measure = new Date(+year, +month - 1, +day, +hh, +mm, +ss);
  var today = new Date();

  document.getElementById('Last').innerHTML = last_measure.toLocaleString(); // .slice(0,10)
  document.getElementById('Now').innerHTML = today.toLocaleString(); // .slice(0,10)

  if (today - last_measure > NEW_DATA_MINUTES) {
    // console.log("Date ERROR");
    pintarDiv('DateTime', -1);
  }else{
    // console.log("Date OK");
    pintarDiv('DateTime', 0);
  }
  // console.log(today)
  // console.log(last_measure)

  document.getElementById('TempOutdoor').innerHTML           = TempOutdoor.toString(2) + " ºC";
  document.getElementById('TempSpectrometer').innerHTML      = TempSpectrometer.toString(2) + " ºC";
  document.getElementById('HumidityOnElectronics').innerHTML = HumidityOnElectronics.toString(2) + " %";
  document.getElementById('TempElectronics').innerHTML       = TempElectronics.toString(2) + " ºC";
  document.getElementById('TempSpectrometerNoise').innerHTML = TempSpectrometerNoise.toString(2) + " ºC";
  document.getElementById('SupplyVoltage').innerHTML         = SupplyVoltage.toString(2) + " V";
  document.getElementById('CurrentTotal').innerHTML          = CurrentTotal.toString(2) + " A";
  document.getElementById('PeltierPower').innerHTML          = PeltierPower.toString(2) + " W";

  document.getElementById('ElevationAngle1').innerHTML       = ElevationAngle1.toString(2) + " º";
  document.getElementById('ElevationAngle2').innerHTML       = ElevationAngle2.toString(2) + " º";
  document.getElementById('ElevationAngle3').innerHTML       = ElevationAngle3.toString(2) + " º";

  // Reseteo alertas
  var TempAlert_msg           = '';
  var ElectronicsAlert_msg    = '';
  var SupplyAlert_msg         = '';
  var CurrentAlert_msg        = '';
  var ElevationAngleAlert_msg = '';
  var PeltierAlert_msg        = '';

  // alerta 1: parametro fuera de rango
  // alerta 0: Todo OK
  // alerta -1: No hay dato nuevo, alerta!

  // ((a < b) ? 'minor' : 'major')

  // TEMP

  if (TempOutdoor > TempSpectrometer + 10) {TempAlert_msg = TempAlert_msg + "\nALERT for overPower";}
  if (TempSpectrometer > 25)               {TempAlert_msg = TempAlert_msg + "\nALERT for overTemp";}

  if (TempAlert_msg === ''){
    pintarDiv('Temp', 0);
  }else{
    pintarDiv('Temp', 1);
    console.log(TempAlert_msg)
  }

  // }else if (TempSpectrometer > 25) {
  //   pintarDiv('Temp', 1)
  //   TempAlert_msg = TempAlert_msg + "\nALERT for overTemp";
  // }else{
  //   pintarDiv('Temp', 0)
  // }

  // If outdoor temperature > internal temperature + 10 degC, then ALERT for overpower ----> CHECK THIS CONDITION PLEASE!!!!
  // TempOutdoor > TempSpectrometer + 10 ? pintarDiv('Temp', 1) : pintarDiv('Temp', 0);
  
  // If temperature of spectrometer > 25 degC, then ALERT
  // TempSpectrometer > 25 ? pintarDiv('Temp', 1) : pintarDiv('Temp', 0);

  // ELECTRONICS

  // If humidity on Electronics > 75%, then ALERT for wet day, corrosion problems
  HumidityOnElectronics > 75 ? pintarDiv('Electronics', 1) : pintarDiv('Electronics', 0);
  // If humidity on Electronics < 10%, then ALERT for dry day, spark problems
  HumidityOnElectronics < 10 ? pintarDiv('Electronics', 1) : pintarDiv('Electronics', 0);
  
  // If temperature of electronics > 55deg, then potential problems of cooling can appear
  TempElectronics > 55 ? pintarDiv('Electronics', 1) : pintarDiv('Electronics', 0);
  
  // 2212 MO: I need to understand better what this means, so for now I am going to comment this line
  //TempSpectrometerNoise < 5 ? pintarDiv('Electronics', 1) : pintarDiv('Electronics', 0);
  
  // If supply voltage > 12.5 V, potential problem of overvoltage
  SupplyVoltage > 12.5 ? pintarDiv('Supply', 1) : pintarDiv('Supply', 0);
  // If supply voltage < 11.4 V, potential problem of low power
  SupplyVoltage < 11.4 ? pintarDiv('Supply', 1) : pintarDiv('Supply', 0);

  // If current > 2 A (in regimen, needs to be checked), then potential problem of overcurrent
  CurrentTotal > 2 ? pintarDiv('Current', 1) : pintarDiv('Current', 0);
  // If current < 0.05 A (in regimen, needs to be checked), then potential problem of electronics
  CurrentTotal < 0.05 ? pintarDiv('Current', 1) : pintarDiv('Current', 0);

  // 2212 MO: I am not going to put an alert on this for now
  //PeltierPower < 5 ? pintarDiv('Peltier', 1) : pintarDiv('Peltier', 0);
  pintarDiv('Peltier', 0)

  // 2212 MO: No need of put an alert here, just to have real time information
  //ElevationAngle1 < 5 ? pintarDiv('ElevationAngle', 1) : pintarDiv('ElevationAngle', 0);
  //ElevationAngle2 < 5 ? pintarDiv('ElevationAngle', 1) : pintarDiv('ElevationAngle', 0);
  //ElevationAngle3 < 5 ? pintarDiv('ElevationAngle', 1) : pintarDiv('ElevationAngle', 0);
  // pintarDiv('ElevationAngle', 0)

  // if (TempOutdoor < 5){
  //   pintarDiv('Temp', 1);
  // }else{
  //   pintarDiv('Temp', 0);
  // }

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

  pintarDiv('Peltier', 0)
  pintarDiv('ElevationAngle', 0)

  // mandar al css
  // document.getElementById('TempOutdoor').style.borderWidth = "thick";
  // document.getElementById('TempOutdoor').style.borderStyle = "solid";

  parsear();
});
