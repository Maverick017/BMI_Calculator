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
    categoryClass = "text-indigo-500";
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
  commentElement.className =
    "comment text-lg font-bold font-medium mt-4 " + categoryClass;

  document.getElementById("result").classList.add("animate-pulse");
  setTimeout(() => {
    document.getElementById("result").classList.remove("animate-pulse");
  }, 1000);
});

function updateBMIIndicator(bmi) {
  bmiIndicator.classList.remove("hidden");

  let position;
  if (bmi < 10) position = 0;
  else if (bmi > 40) position = 100;
  else {
    position = ((bmi - 10) / 30) * 100;
  }

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
