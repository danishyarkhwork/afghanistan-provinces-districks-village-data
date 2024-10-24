$(document).ready(function () {
  $("#province-info").hide();

  $("#province-search").on("input", function () {
    const query = $(this).val().toLowerCase();
    let found = false;
    $(".province-list-item").each(function () {
      const provinceName = $(this).text().toLowerCase();
      if (provinceName.includes(query)) {
        $(this).show();
        found = true;
      } else {
        $(this).hide();
      }
    });
    if (!found) {
      $(".no-results").show();
    } else {
      $(".no-results").hide();
    }
  });

  $("#darkModeToggle").click(function () {
    $("body").toggleClass("dark");
    if ($("body").hasClass("dark")) {
      $(this).removeClass("fa-moon").addClass("fa-sun");
    } else {
      $(this).removeClass("fa-sun").addClass("fa-moon");
    }
  });

  $("#fullscreenBtn").click(function () {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  let currentChart = null;

  fetch("provinces.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch provinces.json");
      }
      return response.json();
    })
    .then((provinces) => {
      console.log(provinces);
      const provinceList = document.getElementById("province-list");
      provinceList.innerHTML = "";

      provinces.forEach((province) => {
        const listItem = document.createElement("li");
        listItem.className =
          "province-list-item hover:bg-teal-100 transition p-2 rounded-lg";
        listItem.textContent = province.name;
        listItem.addEventListener("click", () => {
          displayProvinceData(province);
          $("#intro-map").hide(); // Hide main image when province is clicked
        });
        provinceList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error loading provinces:", error);
      alert("Failed to load provinces. Please check the console.");
    });

  function displayProvinceData(province) {
    $("#province-info").fadeIn();
    document.getElementById("province-name").textContent = province.name;
    document.getElementById("province-pashto-name").textContent =
      province.pashto_name;
    document.getElementById("province-image").src = province.map_image;

    document.getElementById("province-population").textContent =
      province.population.toLocaleString();
    document.getElementById(
      "province-area"
    ).textContent = `${province.area.toLocaleString()} km²`;
    document.getElementById("province-climate").textContent = province.climate;
    document.getElementById("province-languages").textContent =
      province.languages.join(", ");
    document.getElementById("province-resources").textContent =
      province.natural_resources.join(", ");
    document.getElementById("province-economy").textContent = `Agriculture: ${
      province.economy.agriculture
    }, Industries: ${province.economy.industries.join(", ")}`;
    document.getElementById("province-transport").textContent = `Major Roads: ${
      province.transportation?.major_roads?.join(", ") || "N/A"
    }, Airports: ${province.transportation?.airports?.join(", ") || "N/A"}`;
    document.getElementById(
      "province-culture"
    ).textContent = `Cultural Sites: ${
      province.cultural_sites?.join(", ") || "N/A"
    }, Annual Events: ${province.annual_events?.join(", ") || "N/A"}`;

    if (currentChart) {
      currentChart.destroy();
    }

    const ethnicGroups = province.ethnic_groups;
    const ethnicLabels = Object.keys(ethnicGroups);
    const ethnicValues = Object.values(ethnicGroups).map((value) =>
      parseFloat(value)
    );

    const ctx = document.getElementById("ethnicChart").getContext("2d");
    currentChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ethnicLabels,
        datasets: [
          {
            data: ethnicValues,
            backgroundColor: [
              "#4dc9f6",
              "#f67019",
              "#f53794",
              "#537bc4",
              "#acc236",
              "#166a8f",
            ],
          },
        ],
      },
    });

    // Dynamically generate district cards
    const districtData = province.districts_data
      .map(
        (district) => `
          <li class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 class="text-xl font-semibold text-teal-600 mb-2">${
              district.name
            } - ${district.pashto_name}</h3>
            <p class="text-lg text-gray-700">Population: <span class="font-bold">${district.population.toLocaleString()}</span></p>
            <p class="text-lg text-gray-700">Ethnicity: <span class="font-bold">${
              district.ethnicity
            }</span></p>
          </li>
        `
      )
      .join("");
    document.getElementById("province-districts-data").innerHTML = districtData;
  }
});
