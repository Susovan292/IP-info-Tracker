const userInput = document.getElementById("user-input");
const btnSearch = document.getElementById("btn-search");
const btnClear = document.getElementById("btn-clear");
const resultContainer = document.querySelector(".result-container");

resultContainer.style.display = 'none';
function isValidIPv4(ip) {
  const ipv4Pattern =
    /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])$/;

  return ipv4Pattern.test(ip);
}

function getClientIP() {
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      console.log("Your Public IP Address:", data.ip);
      userInput.value = data.ip;
    })
    .catch((error) => {
      resultContainer.innerHTML = `Error Occurred: ${error}`;
    });
}

getClientIP();

async function getInfo(ip) {
  try {
    const response = await fetch(`https://ipinfo.io/${ip}/geo`);
    const jsonInfo = await response.json();
    return jsonInfo;
  } catch (error) {
    resultContainer.innerHTML = `Error Occurred: ${error}`;
  }
}

btnClear.addEventListener("click", () => {
  resultContainer.style.display = 'block';
  userInput.value = "";
  resultContainer.innerHTML = `
          <p>Note: refresh the page to get your public IP</p>
        `;
  btnClear.style.display = 'none';
});

btnSearch.addEventListener("click", async () => {
  const ip = userInput.value;
  if (isValidIPv4(ip)) {
    const info = await getInfo(ip);
    if (info) {
      resultContainer.innerHTML = `
              <p>IP: ${info.ip}</p>
              <p>City: ${info.city}</p>
              <p>Region: ${info.region}</p>
              <p>Country: ${info.country}</p>
              <p>Location: ${info.loc}</p>
            `;
    } else {
      resultContainer.innerHTML = `<p>No information found for IP: ${ip}</p>`;
    }
  } else {
    resultContainer.innerHTML = `<p>${ip} IP not valid !!!</p>
          <p>Note: refresh the page to get your public IP</p>`;
  }
  resultContainer.style.display = 'block';
  btnClear.style.display = 'block';
});