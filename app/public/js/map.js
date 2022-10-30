    // 초기 맵을 띄워준다.
    function initTmap() {
        function onGeoOk(position){
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            document.getElementById('lat').value = lat;
            document.getElementById('lng').value = lng;
            
                    // 1. 지도 띄우기
            map = new Tmapv2.Map("map_div", {
            center : new Tmapv2.LatLng(lat,lng), //장고 템플릿언어로 갑 치환
            width : "100%", // 맵의 가로
            height : "25vh", //맵의 세로
            zoom : 18, // 맵을 얼마정도 확대할건지?
            zoomControl : false, // 맵을 사용자가 확대시킬건지
            scrollwheel : false,
        });

        document.getElementById('lat').value = lat;
        document.getElementById('lng').value = lng;

        }
        function onGeoError(){
            alert("Can't find you. No weather for you.");
        }

        const options = { enableHighAccuracy: true, maximumAge: 0, timeout: Infinity };
        navigator.geolocation.getCurrentPosition(onGeoOk,onGeoError,options);
       

    }