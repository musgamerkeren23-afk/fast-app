let map;
let userMarker;
let driverMarker;
let routeLine;

let userRealLat;
let userRealLng;

// LOGIN
function login() {
  const name = document.getElementById("username").value;
  localStorage.setItem("user", name);

  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";

  initMap();
}

// GPS
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      userRealLat = pos.coords.latitude;
      userRealLng = pos.coords.longitude;

      alert("📍 Lokasi berhasil diambil!");
    });
  } else {
    alert("GPS tidak didukung");
  }
}

// ORDER
function order() {
  if (!userRealLat) {
    alert("Ambil lokasi dulu!");
    return;
  }

  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;

  const distance = Math.random() * 5 + 1;
  const price = Math.round(distance * 2000);

  const orderData = {
    user: localStorage.getItem("user"),
    from,
    to,
    lat: userRealLat,
    lng: userRealLng,
    distance,
    price,
    status: "🚕 Mencari driver..."
  };

  localStorage.setItem("order", JSON.stringify(orderData));

  alert("💰 Estimasi harga: Rp " + price);
}

// MAP
function initMap() {
  map = L.map('map').setView([-6.2, 106.8], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);
}

// UPDATE MAP + RUTE
function updateMap() {
  let order = JSON.parse(localStorage.getItem("order") || "null");
  if (!order || !map) return;

  // USER
  if (userMarker) map.removeLayer(userMarker);
  userMarker = L.marker([order.lat, order.lng]).addTo(map)
    .bindPopup("📍 Kamu");

  map.setView([order.lat, order.lng], 15);

  // DRIVER
  if (order.driverLat && order.driverLng) {
    if (driverMarker) map.removeLayer(driverMarker);

    driverMarker = L.marker([order.driverLat, order.driverLng]).addTo(map)
      .bindPopup("🚗 Driver");

    // 🛣️ GARIS RUTE
    if (routeLine) map.removeLayer(routeLine);

    routeLine = L.polyline([
      [order.driverLat, order.driverLng],
      [order.lat, order.lng]
    ]).addTo(map);
  }
}

// CHAT
function sendChat() {
  const msg = document.getElementById("chatInput").value;

  let chats = JSON.parse(localStorage.getItem("chat") || "[]");
  chats.push("🧑 User: " + msg);

  localStorage.setItem("chat", JSON.stringify(chats));

  renderChat();
}

function renderChat() {
  const box = document.getElementById("chatBox");
  let chats = JSON.parse(localStorage.getItem("chat") || "[]");

  box.innerHTML = chats.join("<br>");
}

// STATUS
function updateStatus() {
  let order = JSON.parse(localStorage.getItem("order") || "null");

  if (!order) {
    document.getElementById("status").innerText = "Belum ada order";
    return;
  }

  document.getElementById("status").innerText = order.status;

  if (order.status.includes("dibatalkan")) {
    alert("❌ Driver membatalkan order!");
  }

  if (order.status.includes("selesai")) {
    alert("🎉 Perjalanan selesai!");
  }
}

// LOOP
setInterval(() => {
  renderChat();
  updateStatus();
  updateMap();
}, 1000);
