function a() {
let point = new Tmapv2.LatLng(35.15767521048202,128.10108675307046);
let point2 = new Tmapv2.LatLng(35.15734551727997,128.09719375374283);
let distance = point.distanceTo(point2);

console.log(distance);
let result ='두 지점 간의 거리 : '+distance+' '; 
let resultDiv = document.getElementById("result");
resultDiv.innerHTML = result;
}