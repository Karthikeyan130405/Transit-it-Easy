// 📌 Event Listener: Click Search Button
document.getElementById("searchBtn").addEventListener("click", function () {
    performSearch();
});

// 🔑 Event Listener: Press "Enter" in Start or Destination Inputs
document.getElementById("start").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        performSearch();
    }
});
document.getElementById("destination").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        performSearch();
    }
});

// ✨ Search Bus Function
function performSearch() {
    let start = document.getElementById("start").value.trim().toLowerCase();
    let destination = document.getElementById("destination").value.trim().toLowerCase();
    let resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = ""; // Clear previous results

    if (!start || !destination) {
        alert("Please enter both start and destination locations.");
        return;
    }

    // 📡 Fetch Bus Data from JSON
    fetch("/static/bus_data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 🔍 Filter Bus Data Based on User Input
            let filteredBuses = data.filter(bus =>
                bus.start.toLowerCase() === start && bus.destination.toLowerCase() === destination
            );

            if (filteredBuses.length > 0) {
                // ✅ Display Bus Details & "Navigate" Button
                filteredBuses.forEach(bus => {
                    resultsDiv.innerHTML += `
                        <div class="bus-card">
                            <h3>${bus.bus_name}</h3>
                            <p><strong>Time:</strong> ${bus.time}</p>
                            <p><strong>Route:</strong> ${bus.start} → ${bus.destination}</p>
                            <button class="navigate-btn" onclick="navigateTo('${bus.start}', '${bus.destination}')">
                                Navigate
                            </button>
                        </div>
                    `;
                });
            } else {
                // ❌ No Buses Found Message
                resultsDiv.innerHTML = `<p class="error-message">No buses found for this route.</p>`;
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            resultsDiv.innerHTML = `<p class="error-message">An error occurred while fetching data. ${error.message}</p>`;
        });
}

// 🌍 Google Maps Navigation Function
function navigateTo(start, destination) {
    if (!start || !destination) {
        alert("Invalid locations for navigation.");
        return;
    }

    // 📍 Construct Google Maps URL
    let mapsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(start)}/${encodeURIComponent(destination)}`;

    // 🚀 Open Google Maps in a New Tab
    window.open(mapsUrl, "_blank");
}
