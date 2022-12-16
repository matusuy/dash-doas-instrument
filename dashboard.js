// https://sebhastian.com/javascript-csv-to-array/
// colors HTML: https://htmlcolorcodes.com/
const removeEmptyLines = str => str.split(/\r?\n/).filter(line => line.trim() !== '').join('\n');

function parsear(){
  // console.log("parsear")
  var file_url = './SkySpec221216.txt' + '?' + new Date().getTime();
  // console.log(file_url);
  fetch(file_url)
    .then(response => response.text())
    .then(text => csvToArray(text))
}

function pintarDiv(id, alerta){

  // alerta 1: parametro fuera de rango
  // alerta 0: Todo OK
  // alerta -1: No hay dato nuevo, alerta!

  if (alerta==1){ // ERROR! -> ROJO
    console.log("Alerta en " + id)
    document.getElementById(id).style.borderColor = "#d70d0d";
	document.getElementById(id).style.backgroundColor = "#d70d0d";
    document.getElementById(id).style.color = "black";
    // alertas_obj[p_alerta] = true;
  }else if (alerta==0){ // TODO OK!! -> VERDE
    document.getElementById(id).style.borderColor = "#199c04";
	document.getElementById(id).style.backgroundColor = "#199c04";
	document.getElementById(id).style.color = "white";
  }else{ // NO HAY DATO!! -> AMARILLO
	document.getElementById(id).style.borderColor = "#e3ff33";
    document.getElementById(id).style.backgroundColor = "#e3ff33";
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
  var TempOutdoor           = parseFloat(ultima_fila["TempOutdoor"]);
  var TempSpectrometer      = parseFloat(ultima_fila["TempSpectrometer"]);
  var HumidityOnElectronics = parseFloat(ultima_fila["HumidityOnElectronics"]);
  var TempElectronics       = parseFloat(ultima_fila["TempElectronics"]);
  var TempSpectrometerNoise = parseFloat(ultima_fila["TempSpectrometerNoise"]);
  var SupplyVoltage         = parseFloat(ultima_fila["SupplyVoltage"]);
  var CurrentTotal          = parseFloat(ultima_fila["CurrentTotal"]);
  var PeltierPower          = parseFloat(ultima_fila["PeltierPower"]);

  var ultima_fila_menos_1 = arr[arr.length-2];
  var ultima_fila_menos_2 = arr[arr.length-3];
  var ElevationAngle1 = parseFloat(ultima_fila_menos_2["ElevationAngle"]);
  var ElevationAngle2 = parseFloat(ultima_fila_menos_1["ElevationAngle"]);
  var ElevationAngle3 = parseFloat(ultima_fila["ElevationAngle"]);

  // console.log(ultima_fila["Date"]);
  // console.log(ultima_fila["Time"]);
  // console.log(TempOutdoor);
  const SET_POINT_TEMP_SPEC = 20; // INPUT: SET POINT OF OPERATION OF SPECTROMETER
  const CHECK_EVERY_MINS = 15; // INPUT: CHECK EVERY XX MINUTES
  const NEW_DATA_MINUTES = CHECK_EVERY_MINS*60*1000; // the first number is minutes
  const MAX_DATA_HOURS   = 4*60*60*1000;
  var [day, month, year] = ultima_fila["Date"].split('.');
  var [hh, mm, ss] = ultima_fila["Time"].split(':');
  var last_measure = new Date(+year, +month - 1, +day, +hh, +mm, +ss);
  last_measure.setHours(last_measure.getHours() - 3);
  var today = new Date();

  document.getElementById('Last').innerHTML = last_measure.toLocaleString(); // .slice(0,10)
  document.getElementById('Now').innerHTML = today.toLocaleString(); // .slice(0,10)

  document.getElementById('TempOutdoor').innerHTML           = TempOutdoor.toString() + " ºC";
  document.getElementById('TempSpectrometer').innerHTML      = TempSpectrometer.toString() + " ºC";
  document.getElementById('HumidityOnElectronics').innerHTML = HumidityOnElectronics.toString() + " %";
  document.getElementById('TempElectronics').innerHTML       = TempElectronics.toString() + " ºC";
  document.getElementById('TempSpectrometerNoise').innerHTML = TempSpectrometerNoise.toString() + " ºC";
  document.getElementById('SupplyVoltage').innerHTML         = SupplyVoltage.toString() + " V";
  document.getElementById('CurrentTotal').innerHTML          = CurrentTotal.toString() + " A";
  document.getElementById('PeltierPower').innerHTML          = PeltierPower.toString() + " W";

  document.getElementById('ElevationAngle1').innerHTML       = ElevationAngle1.toString() + " º";
  document.getElementById('ElevationAngle2').innerHTML       = ElevationAngle2.toString() + " º";
  document.getElementById('ElevationAngle3').innerHTML       = ElevationAngle3.toString() + " º";

  // Reseteo alertas
  var TempAlert_msg           = 'For develop';
  var ElectronicsAlert_msg    = 'For develop';
  var SupplyAlert_msg         = 'For develop';
  var CurrentAlert_msg        = 'For develop';
  var ElevationAngleAlert_msg = 'For develop';
  var PeltierAlert_msg        = 'For develop';

  document.getElementById('DateTimeAlert').innerHTML       = '';
  document.getElementById('TempAlert').innerHTML           = '';
  document.getElementById('ElectronicsAlert').innerHTML    = '';
  document.getElementById('SupplyAlert').innerHTML         = '';
  document.getElementById('CurrentAlert').innerHTML        = '';
  document.getElementById('ElevationAngleAlert').innerHTML = '';
  document.getElementById('PeltierAlert').innerHTML        = '';

  // alerta 1: parametro fuera de rango
  // alerta 0: Todo OK
  // alerta -1: No hay dato nuevo, alerta!

  // ((a < b) ? 'minor' : 'major')

  //##################################### 
  //##################################### DATE
  //##################################### 

  if (today - last_measure > MAX_DATA_HOURS) {
    // console.log("Date ERROR");
    pintarDiv('DateTime', 1);
  }else if (today - last_measure > NEW_DATA_MINUTES ){
    pintarDiv('DateTime', -1);
  }else{
    // console.log("Date OK");
    pintarDiv('DateTime', 0);
  }
  // console.log(today)
  // console.log(last_measure)

  //##################################### 
  //##################################### TEMP
  //##################################### 

  // console.log(TempOutdoor)
  console.log(parseFloat(TempSpectrometer) + 10)

  if (TempOutdoor  > TempSpectrometer + 10)     {TempAlert_msg = TempAlert_msg + "\nALERT for overPower";}
  if (TempSpectrometer < SET_POINT_TEMP_SPEC-1) {TempAlert_msg = TempAlert_msg + "\nALERT for lowTemp";}
  if (TempSpectrometer > SET_POINT_TEMP_SPEC+1) {TempAlert_msg = TempAlert_msg + "\nALERT for overTemp";}
  
  if (TempAlert_msg === ''){
    pintarDiv('Temp', 0);
  }else{
    pintarDiv('Temp', 1);
    document.getElementById('TempAlert').innerHTML = TempAlert_msg;
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

  //##################################### 
  //##################################### ELECTRONICS
  //##################################### 

  // // If humidity on Electronics > 75%, then ALERT for wet day, corrosion problems
  // HumidityOnElectronics > 75 ? pintarDiv('Electronics', 1) : pintarDiv('Electronics', 0);
  // // If humidity on Electronics < 10%, then ALERT for dry day, spark problems
  // HumidityOnElectronics < 10 ? pintarDiv('Electronics', 1) : pintarDiv('Electronics', 0);
  
  // // If temperature of electronics > 55deg, then potential problems of cooling can appear
  // TempElectronics > 55 ? pintarDiv('Electronics', 1) : pintarDiv('Electronics', 0);
  
  // 2212 MO: I need to understand better what this means, so for now I am going to comment this line
  //TempSpectrometerNoise < 5 ? pintarDiv('Electronics', 1) : pintarDiv('Electronics', 0);

  if (HumidityOnElectronics > 75) {ElectronicsAlert_msg = ElectronicsAlert_msg + "\nnPotential wet day, corrosion problems";}
  if (HumidityOnElectronics < 10) {ElectronicsAlert_msg = ElectronicsAlert_msg + "\nnPotential dry day, spark problems";}
  if (TempElectronics > 55)       {ElectronicsAlert_msg = ElectronicsAlert_msg + "\nPotential problems of cooling can appear";}

  if (ElectronicsAlert_msg === ''){
    pintarDiv('Electronics', 0);
  }else{
    pintarDiv('Electronics', 1);
    document.getElementById('ElectronicsAlert').innerHTML = ElectronicsAlert_msg;
    console.log(ElectronicsAlert_msg)
  }


  //##################################### 
  //##################################### SUPPLY
  //##################################### 

  // // If supply voltage > 12.5 V, potential problem of overvoltage
  // SupplyVoltage > 12.5 ? pintarDiv('Supply', 1) : pintarDiv('Supply', 0);
  // // If supply voltage < 11.4 V, potential problem of low power
  // SupplyVoltage < 11.4 ? pintarDiv('Supply', 1) : pintarDiv('Supply', 0);
  if (SupplyVoltage > 12.5) {SupplyAlert_msg = SupplyAlert_msg + "\nPotential problem of overvoltage";}
  if (SupplyVoltage < 11.4) {SupplyAlert_msg = SupplyAlert_msg + "\nPotential problem of low power";}

  if (SupplyAlert_msg === ''){
    pintarDiv('Supply', 0);
  }else{
    pintarDiv('Supply', 1);
    document.getElementById('SupplyAlert').innerHTML = SupplyAlert_msg;
    console.log(SupplyAlert_msg)
  }

  //##################################### 
  //##################################### CURRENT
  //##################################### 

  // If current > 2 A (in regimen, needs to be checked), then potential problem of overcurrent
  // CurrentTotal > 2 ? pintarDiv('Current', 1) : pintarDiv('Current', 0);
  // If current < 0.05 A (in regimen, needs to be checked), then potential problem of electronics
  // CurrentTotal < 0.05 ? pintarDiv('Current', 1) : pintarDiv('Current', 0);
  if (CurrentTotal > 2)    {CurrentAlert_msg = CurrentAlert_msg + "\nPotential problem of overcurrent";}
  if (CurrentTotal < 0.05) {CurrentAlert_msg = CurrentAlert_msg + "\nPotential problem of electronics";}

  if (CurrentAlert_msg === ''){
    pintarDiv('Current', 0);
  }else{
    pintarDiv('Current', 1);
    document.getElementById('CurrentAlert').innerHTML = CurrentAlert_msg;
    console.log(CurrentAlert_msg)
  }

  //##################################### 
  //##################################### CURRENT
  //##################################### 


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
  
 
  //pintarDiv('DateTime', 0)
  pintarDiv('Temp', 0)
  //pintarDiv('Electronics', 0)
  //pintarDiv('Supply', 0)
  //pintarDiv('Current', 0)

  // mandar al css
  // document.getElementById('TempOutdoor').style.borderWidth = "thick";
  // document.getElementById('TempOutdoor').style.borderStyle = "solid";

  parsear();
});
