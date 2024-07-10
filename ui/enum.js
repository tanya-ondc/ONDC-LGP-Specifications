var parsedData;
var originalData;

function loadDropdown0() {
  var dropdown0 = document.getElementById('enum-l1-dropdown');
  dropdown0.innerHTML = '';

  // Populate dropdown0
  Object.keys(originalData).forEach(function (key) {
    var option = document.createElement('option');
    option.text = key;
    dropdown0.add(option);
  });

  // Add event listener to update dropdown1 when dropdown0 changes
  dropdown0.addEventListener('change', function() {
    updateEnumSet();
    loadDropdown1();
  });

  // Trigger initial load for dropdown1
  updateEnumSet();
  loadDropdown1();
}

function updateEnumSet() {
  var dropdown0 = document.getElementById('enum-l1-dropdown');
  var selectedValue0 = dropdown0.value;

  // Reset parsedData based on the selected value in dropdown0
  parsedData = originalData[selectedValue0]?.enum_set || {};
  console.log(parsedData);
}

function loadDropdown1() {
  var dropdown1 = document.getElementById('dropdown1');
  dropdown1.innerHTML = '';

  // Populate dropdown1
  Object.keys(parsedData).forEach(function (key) {
    var option = document.createElement('option');
    option.text = key;
    dropdown1.add(option);
  });

  // Clear subsequent dropdowns
  document.getElementById('dropdown2').innerHTML = '';
  document.getElementById('dropdown4').innerHTML = '';
  document.getElementById('result-table').innerHTML = '';

  // Add event listener to update dropdown2 when dropdown1 changes
  dropdown1.addEventListener('change', function() {
    loadDropdown2();
  });

  // Trigger initial load for dropdown2 if there is a selection in dropdown1
  if (dropdown1.options.length > 0) {
    dropdown1.selectedIndex = 0;
    loadDropdown2();
  }
}

function loadDropdown2() {
  var dropdown2 = document.getElementById('dropdown2');
  dropdown2.innerHTML = '';

  var dropdown1 = document.getElementById('dropdown1');
  var selectedValue1 = dropdown1.value;

  if (selectedValue1 && parsedData[selectedValue1]) {
    let data = flattenObject(parsedData[selectedValue1]);
    Object.keys(data).forEach(function (key) {
      var option = document.createElement('option');
      option.text = key;
      dropdown2.add(option);
    });

    // Clear subsequent dropdown
    document.getElementById('dropdown4').innerHTML = '';
    document.getElementById('result-table').innerHTML = '';

    // Add event listener to update dropdown4 when dropdown2 changes
    dropdown2.addEventListener('change', function() {
      loadDropdown4();
    });

    // Trigger initial load for dropdown4 if there is a selection in dropdown2
    if (dropdown2.options.length > 0) {
      dropdown2.selectedIndex = 0;
      loadDropdown4();
    }
  }
}

function loadDropdown4() {
  var dropdown4 = document.getElementById('dropdown4');
  dropdown4.innerHTML = '';

  var dropdown1 = document.getElementById('dropdown1');
  var dropdown2 = document.getElementById('dropdown2');
  var selectedValue1 = dropdown1.value;
  var selectedValue2 = dropdown2.value;

  if (selectedValue1 && selectedValue2) {
    let data = getAttribute(parsedData[selectedValue1], selectedValue2.split("."));
    if (data && Array.isArray(data)) {
      data.forEach(function (item) {
        var option = document.createElement('option');
        option.text = item["code"];
        dropdown4.add(option);
      });
      displayTable();
    }
  }
}

function getAttribute(data, keyArr) {
  let key = isNaN(keyArr[0]) ? keyArr[0] : parseInt(keyArr[0]);
  if (data[key] !== undefined) {
    if (keyArr.length == 1) {
      return data[key];
    }
    return getAttribute(data[key], keyArr.slice(1));
  }
  return undefined;
}

function flattenObject(obj, prefix = '', result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (Array.isArray(obj[key])) {
        result[newKey] = obj[key];
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }

  return result;
}

function displayTable() {
  var dropdown1 = document.getElementById('dropdown1');
  var dropdown2 = document.getElementById('dropdown2');
  var dropdown4 = document.getElementById('dropdown4');

  var selectedValue1 = dropdown1.value;
  var selectedValue2 = dropdown2.value;
  var selectedValue3 = dropdown4.value;

  let data = getAttribute(parsedData[selectedValue1], selectedValue2.split("."));
  if (data) {
    var tableData = data.find(obj => obj["code"] == selectedValue3);

    if (tableData) {
      var tableBody = document.getElementById('result-table');
      if (tableBody && tableBody != {}) tableBody.innerHTML = '';
      insertRow(tableBody, "ENUM", tableData.code);
      insertRow(tableBody, "Description", tableData.description);
    }
  }
}

function insertRow(tableBody, key, value) {
  var row = tableBody.insertRow();
  var cell = row.insertCell();
  cell.innerHTML = key;
  cell = row.insertCell();
  cell.innerHTML = value;
}

function fetchData(url) {
  return fetch(url)
    .then(response => response.text())
    .then(yamlData => jsyaml.load(yamlData));
}

function populateEnums(url) {
  fetchData(url).then(data => {
    initSchema(data["x-enum"]);
    initTag(data["x-tags"]);
  }).catch(error => {
    console.error('Error fetching or parsing YAML:', error);
  });
}

function initSchema(data) {
  originalData = data;
  parsedData = data;
  loadDropdown0();
}

function initTag(data) {
  // Placeholder function for additional initialization if needed
}
