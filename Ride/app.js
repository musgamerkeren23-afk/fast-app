let map, marker;

function initMap(){
  map = L.map('map').setView([-6.2,106.8],13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}
initMap();

// FSO
db.ref("orders").on("value",snap=>{
  const o = snap.val();
  if(!o){
    orderBox.innerText="Tidak ada order";
    return;
  }

  orderBox.innerText =
    `${o.user}\n${o.from} → ${o.to}\nRp ${o.price}`;

  map.setView([o.lat,o.lng],15);

  if(marker) map.removeLayer(marker);
  marker = L.marker([o.lat,o.lng]).addTo(map);
});

// TERIMA
function accept(){
  navigator.geolocation.getCurrentPosition(pos=>{
    db.ref("orders").update({
      status:"diambil",
      driverLat: pos.coords.latitude,
      driverLng: pos.coords.longitude
    });
  });
}

// CANCEL
function cancel(){
  db.ref("orders").update({
    status:"dibatalkan"
  });
}

// SELESAI
function finish(){
  db.ref("orders").remove();
}

// CHAT
function sendChat(){
  db.ref("chat").push({
    user:"driver",
    msg: chatInput.value
  });
}

db.ref("chat").on("child_added",snap=>{
  const d = snap.val();
  chatBox.innerHTML += `<p>${d.user}: ${d.msg}</p>`;
});
