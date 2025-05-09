const heightUnit = document.getElementById("height-unit");
const weightUnit = document.getElementById("weight-unit");
const weightUnitLabel = document.getElementById("weight-unit-label");
const cmInput = document.getElementById("cm-input");
const feetInput = document.getElementById("feet-input");
const calculateBtn = document.getElementById("calculate");
const bmiIndicator = document.getElementById("bmi-indicator");

heightUnit.addEventListener("change", function () {
  if (heightUnit.value === "cm") {
    cmInput.classList.remove("hidden");
    feetInput.classList.add("hidden");
  } else {
    cmInput.classList.add("hidden");
    feetInput.classList.remove("hidden");
  }
});

weightUnit.addEventListener("change", function () {
  weightUnitLabel.textContent = weightUnit.value;
});

calculateBtn.addEventListener("click", function () {
  let heightInCm, weightInKg;

  if (heightUnit.value === "cm") {
    const heightValue = parseFloat(document.getElementById("height").value);
    if (!heightValue || heightValue <= 0) {
      showAlert("Please enter a valid height");
      return;
    }
    heightInCm = heightValue;
  } else {
    const feet = parseFloat(document.getElementById("feet").value);
    const inches = parseFloat(document.getElementById("inches").value) || 0;

    if (!feet || feet <= 0) {
      showAlert("Please enter a valid height in feet");
      return;
    }

    heightInCm = feet * 30.48 + inches * 2.54;
  }

  const weightValue = parseFloat(document.getElementById("weight").value);
  if (!weightValue || weightValue <= 0) {
    showAlert("Please enter a valid weight");
    return;
  }

  if (weightUnit.value === "kg") {
    weightInKg = weightValue;
  } else {
    weightInKg = weightValue * 0.453592;
  }

  const heightInMeters = heightInCm / 100;
  const bmi = weightInKg / (heightInMeters * heightInMeters);
  const roundedBMI = bmi.toFixed(2);

  document.getElementById("result").textContent = roundedBMI;

  updateBMIIndicator(bmi);

  let category = "";
  let categoryClass = "";

  if (bmi < 18.5) {
    category = "You Are Underweight";
    categoryClass = "text-blue-500";
  } else if (bmi >= 18.5 && bmi < 25) {
    category = "You Are Healthy";
    categoryClass = "text-green-500";
  } else if (bmi >= 25 && bmi < 30) {
    category = "You Are Overweight";
    categoryClass = "text-yellow-500";
  } else {
    category = "You Are Obese";
    categoryClass = "text-red-500";
  }

  const commentElement = document.querySelector(".comment");
  commentElement.innerHTML = category;
  commentElement.className = "comment text-2xl font-bold mt-4 " + categoryClass;

  const resultElement = document.getElementById("result");
  resultElement.classList.add("opacity-0");
  resultElement.style.transition = "transform 0.5s, opacity 0.5s";

  setTimeout(() => {
    resultElement.classList.remove("opacity-0");
    resultElement.style.transform = "scale(1.1)";

    setTimeout(() => {
      resultElement.style.transform = "scale(1)";
    }, 500);
  }, 50);

  setTimeout(() => {
    resultElement.style.transition = "";
  }, 1000);
});

function updateBMIIndicator(bmi) {
  bmiIndicator.classList.remove("hidden");

  let position;
  if (bmi < 18.5) {
    position = (bmi / 18.5) * 25;
  } else if (bmi >= 18.5 && bmi < 25) {
    position = 25 + ((bmi - 18.5) / 6.5) * 25;
  } else if (bmi >= 25 && bmi < 30) {
    position = 50 + ((bmi - 25) / 5) * 25;
  } else {
    let obesePosition = 75 + ((bmi - 30) / 10) * 25;
    position = Math.min(obesePosition, 100);
  }
  position = Math.max(0, Math.min(100, position));

  bmiIndicator.style.left = `${position}%`;
}

function showAlert(message) {
  const alertElement = document.createElement("div");
  alertElement.className =
    "fixed inset-0 flex items-center justify-center z-50";

  alertElement.innerHTML = `
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div class="bg-white rounded-xl p-6 max-w-sm mx-4 z-10 relative shadow-2xl">
            <div class="text-center">
                <div class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mx-auto">
                    <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mt-4">${message}</h3>
                <div class="mt-5">
                    <button type="button" class="close-alert w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm">
                        OK
                    </button>
                </div>
            </div>
        </div>
    `;

  document.body.appendChild(alertElement);

  alertElement
    .querySelector(".close-alert")
    .addEventListener("click", function () {
      document.body.removeChild(alertElement);
    });
}
