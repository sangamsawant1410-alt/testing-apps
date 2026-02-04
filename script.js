let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function addTransaction() {
  const tx = {
    type: document.getElementById("type").value,
    grams: parseFloat(document.getElementById("grams").value),
    price: parseFloat(document.getElementById("price").value),
    date: document.getElementById("date").value
  };

  if (!tx.grams || !tx.price || !tx.date) {
    alert("Fill all fields");
    return;
  }

  transactions.push(tx);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  render();
}

function calculatePortfolio() {
  let grams = 0;
  let invested = 0;

  transactions.forEach(t => {
    if (t.type === "BUY") {
      grams += t.grams;
      invested += t.grams * t.price;
    } else {
      const avgBuy = invested / grams;
      grams -= t.grams;
      invested -= avgBuy * t.grams;
    }
  });

  return { grams, invested };
}

function render() {
  const goldPrice = parseFloat(document.getElementById("goldPrice").value) || 0;
  const { grams, invested } = calculatePortfolio();
  const currentValue = grams * goldPrice;
  const profit = currentValue - invested;

  document.getElementById("totalGrams").innerText = grams.toFixed(2) + " g";
  document.getElementById("invested").innerText = "₹" + invested.toFixed(0);
  document.getElementById("currentValue").innerText = "₹" + currentValue.toFixed(0);
  document.getElementById("profit").innerText =
    (profit >= 0 ? "+" : "") + "₹" + profit.toFixed(0);

  const history = document.getElementById("history");
  history.innerHTML = "";
  transactions.forEach(t => {
    history.innerHTML += `
      <tr>
        <td>${t.date}</td>
        <td>${t.type}</td>
        <td>${t.grams}</td>
        <td>₹${t.price}</td>
      </tr>
    `;
  });
}

render();
