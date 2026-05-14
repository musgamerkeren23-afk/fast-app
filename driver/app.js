let map, userMarker, driverMarker, routeLine;
let userLat, userLng;

function login(){
  localStorage.setItem("user", username.value);
  app.style.display="block";
  initMap();
}

function initMap(){
  map = L.map('map').setView([-6.2,106.8],13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}

function getLocation(){
  navigator.geolocation.getCurrentPosition(pos=>{
    userLat = pos.coords.latitude;
    userLng = pos.coords.longitude;

    map.setView([userLat,userLng],15);
    userMarker = L.marker([userLat,userLng]).addTo(map);
  });
}

function order(){
  db.ref("orders").set({
    user: localStorage.getItem("user"),
    from: from.value,
    to: to.value,
    lat:userLat,
    lng:userLng,
    price: Math.round(Math.random()*10000),
    status:"mencari"
  });
}

// LISTEN
db.ref("orders").on("value",snap=>{
  const o = snap.val();
  if(!o) return status.innerText="Order selesai";

  status.innerText = o.status;

  if(o.driverLat){
    if(driverMarker) map.removeLayer(driverMarker);

    driverMarker = L.marker([o.driverLat,o.driverLng]).addTo(map);

    if(routeLine) map.removeLayer(routeLine);

    routeLine = L.polyline([
      [o.driverLat,o.driverLng],
      [o.lat,o.lng]
    ]).addTo(map);
  }
});

// CHAT
function sendChat(){
  db.ref("chat").push({
    user: localStorage.getItem("user"),
    msg: chatInput.value
  });
}

db.ref("chat").on("child_added",snap=>{
  const d = snap.val();
  chatBox.innerHTML += `<p>${d.user}: ${d.msg}</p>`;
});
