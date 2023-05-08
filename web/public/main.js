function getCamerasFromAPI() {
  return fetch("http://localhost:3001/cameras")
    .then(function (response) {
      // The API call was successful!
      return response.json();
    })
    .then(function (data) {
      return data;
    })
    .catch(function (err) {
      // There was an error
      alert(
        "Unable to retreive security cameras from Utrecht, please try again or contact support."
      );
      return [];
    });
}

function isDivisible(number, divider) {
  return number % divider === 0;
}

function populateCameraTable(tableId, cameras) {
  const tableBodyElement = document
    .getElementById(tableId)
    .getElementsByTagName("tbody")[0];

  cameras.forEach(function (camera) {
    const tableRow = document.createElement("tr");

    // Create new cell elements for each column in the row
    const number = document.createElement("td");
    const name = document.createElement("td");
    const latitude = document.createElement("td");
    const longitude = document.createElement("td");

    // Set the content of each cell or add child elements
    number.textContent = camera.number;
    name.textContent = camera.location;
    latitude.textContent = camera.latitude;
    longitude.textContent = camera.longitude;

    // Append the cells to the new row element
    tableRow.appendChild(number);
    tableRow.appendChild(name);
    tableRow.appendChild(latitude);
    tableRow.appendChild(longitude);

    // Append the new row to the table body
    tableBodyElement.appendChild(tableRow);
  });
}

function initMap() {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiaGFycmllcGlldGVycyIsImEiOiJjanc5MGxpbTQwNm9lNGFzY3Z6NWJlMHUyIn0.Sc-Yc3QTBa-JIsQnuB1Axg";

  const map = new mapboxgl.Map({
    container: "jsMapID",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [5.1115, 52.0914], // Utrecht
    zoom: 12,
  });

  return map;
}

function initTabs(mapRef) {
  // element definitions
  const tableViewButton = document.getElementById("jsTableViewButton");
  const mapViewButton = document.getElementById("jsMapViewButton");
  const tableContainer = document.getElementById("jsTableContainer");
  const mapContainer = document.getElementById("jsMapContainer");

  function toggleTab() {
    // if table view is active, hide table and show map
    if (tableViewButton.className.includes("active")) {
      tableViewButton.className = "";
      tableContainer.style.display = "none";
      mapContainer.style.display = "block";
      mapViewButton.className = "active";

      // resize map as the size is incorret when element is hidden.
      mapRef.resize();
      return;
    }

    tableContainer.style.display = "block";
    tableViewButton.className = "active";
    mapContainer.style.display = "none";
    mapViewButton.className = "";
  }

  // click event listeners
  tableViewButton.addEventListener("click", toggleTab);
  mapViewButton.addEventListener("click", toggleTab);

  return toggleTab;
}

function makeMapMarkerHTML(camera) {
  return (
    "<div class='popup'><h2>" +
    camera.number +
    "</h2><p>" +
    camera.location +
    "</p></div>"
  );
}

function transformCamerasToTableDataFormat(cameras) {
  return cameras.reduce(
    function (acc, camera) {
      const cameraNumber = parseInt(camera.number);
      const isDivisibleBy3 = isDivisible(cameraNumber, 3);
      const isDivisibleBy5 = isDivisible(cameraNumber, 5);

      if (isDivisibleBy3 && isDivisibleBy5) {
        return {
          ...acc,
          three: [...acc.three, camera],
          five: [...acc.five, camera],
          threeFive: [...acc.threeFive, camera],
        };
      }

      if (isDivisibleBy3) {
        return {
          ...acc,
          three: [...acc.three, camera],
        };
      }

      if (isDivisibleBy5) {
        return {
          ...acc,
          five: [...acc.five, camera],
        };
      }

      return {
        ...acc,
        other: [...acc.other, camera],
      };
    },
    { three: [], five: [], threeFive: [], other: [] }
  );
}

function main() {
  // initiate map
  const mapRef = initMap();
  // initiate tabs
  const toggleTab = initTabs(mapRef);

  // if hash is map-view, show map
  if (window.location.hash === "#map-view") {
    toggleTab();
  }

  getCamerasFromAPI()
    .then(function (cameras) {
      // add all markers to map
      cameras.forEach(function (camera) {
        new mapboxgl.Marker()
          .setLngLat([camera.longitude, camera.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(makeMapMarkerHTML(camera)))
          .addTo(mapRef);
      });

      // add cameras to table
      const camerasByDivisibility = transformCamerasToTableDataFormat(cameras);
      populateCameraTable("column3", camerasByDivisibility.three);
      populateCameraTable("column5", camerasByDivisibility.five);
      populateCameraTable("column35", camerasByDivisibility.threeFive);
      populateCameraTable("columnOther", camerasByDivisibility.other);
    })
    .catch(function () {
      alert(
        "Unable to retreive security cameras from Utrecht, please try again or contact support."
      );
    });
}

document.addEventListener("DOMContentLoaded", main);
