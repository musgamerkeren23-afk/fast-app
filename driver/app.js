let fso = false;

let map;
let driverMarker;
let userMarker;

// INIT MAP
function initMap() {
  map = L.map('map').setView([-6.2, 106.8], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);
}

// FSO
function toggleFSO() {
  fso = !fso;

  document.getElementById("fsoBtn").innerText =
    fso ? "🚀 FSO ON" : "🚀 FSO OFF";
}

// DETECT ORDER + GERAK
function checkOrder() {
  if (!fso) return;

  let order = JSON.parse(localStorage.getItem("order") || "null");

  if (order) {
    document.getElementById("orderBox").innerText =
  "🚨 Order dari " + order.user +
  "\n📍 " + order.from + " → " + order.to +
  "\n💰 Rp " + order.price;

    if (!order.driverLat) {
      order.driverLat = order.lat + 0.01;
      order.driverLng = order.lng + 0.01;
    }

    order.driverLat += (order.lat - order.driverLat) * 0.1;
    order.driverLng += (order.lng - order.driverLng) * 0.1;

    let jarak =
      Math.abs(order.lat - order.driverLat) +
      Math.abs(order.lng - order.driverLng);

    if (jarak < 0.0005) {
      order.status = "📍 Driver sudah sampai!";
    } else {
      order.status = "🚗 Driver menuju lokasi...";
    }

    localStorage.setItem("order", JSON.stringify(order));
  } else {
    document.getElementById("orderBox").innerText = "Belum ada order";
  }
}

// UPDATE MAP
function updateMap() {
  let order = JSON.parse(localStorage.getItem("order") || "null");
  if (!order || !map) return;

  if (userMarker) map.removeLayer(userMarker);
  userMarker = L.marker([order.lat, order.lng]).addTo(map)
    .bindPopup("📍 User");

  if (order.driverLat && order.driverLng) {
    if (driverMarker) map.removeLayer(driverMarker);

    driverMarker = L.marker([order.driverLat, order.driverLng]).addTo(map)
      .bindPopup("🚗 Driver");

    map.setView([order.driverLat, order.driverLng], 15);
  }
}

// ❌ CANCEL (notif dulu → hapus)
function cancelOrder() {
  let order = JSON.parse(localStorage.getItem("order") || "null");
  if (!order) return;

  order.status = "❌ Driver membatalkan order";
  localStorage.setItem("order", JSON.stringify(order));

  alert("❌ Order dibatalkan");

  setTimeout(() => {
    localStorage.removeItem("order");
    document.getElementById("orderBox").innerText = "Belum ada order";
  }, 1500);
}

// ✅ FINISH (notif dulu → hapus)
function finishOrder() {
  let order = JSON.parse(localStorage.getItem("order") || "null");
  if (!order) return;

  order.status = "✅ Perjalanan selesai!";
  localStorage.setItem("order", JSON.stringify(order));

  alert("✅ Trip selesai 🚀");

  setTimeout(() => {
    localStorage.removeItem("order");
    document.getElementById("orderBox").innerText = "Belum ada order";
  }, 1500);
}

// CHAT
function sendChat() {
  const msg = document.getElementById("chatInput").value;

  let chats = JSON.parse(localStorage.getItem("chat") || "[]");
  chats.push("🚗 Driver: " + msg);

  localStorage.setItem("chat", JSON.stringify(chats));

  renderChat();
}

function renderChat() {
  const box = document.getElementById("chatBox");
  let chats = JSON.parse(localStorage.getItem("chat") || "[]");

  box.innerHTML = chats.join("<br>");
}

// LOOP
setInterval(() => {
  checkOrder();
  renderChat();
  updateMap();
}, 1000);

// START
window.onload = () => {
  initMap();
};
