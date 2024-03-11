// Define constants for DOM elements
const balanceElement = document.getElementById("balance");
const moneyPlusElement = document.getElementById("money-plus");
const moneyMinusElement = document.getElementById("money-minus");
const listElement = document.getElementById("list");
const formElement = document.getElementById("form");
const textElement = document.getElementById("text");
const amountElement = document.getElementById("amount");

// Define transactions array
let transactions = [];

// Retrieve transactions from local storage
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
if (localStorageTransactions !== null) {
  transactions = localStorageTransactions;
}

// Add transaction to the transactions array
function addTransaction(event) {
  event.preventDefault();
  if (textElement.value.trim() === '' || amountElement.value.trim() === '') {
    alert('Please enter both text and amount.');
  } else {
    const transaction = {
      id: generateID(),
      text: textElement.value,
      amount: +amountElement.value
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    textElement.value = '';
    amountElement.value = '';
  }
}

// Generate a random ID for transactions
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Add transaction to the DOM list
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const listItem = document.createElement("li");
  listItem.classList.add(transaction.amount < 0 ? "minus" : "plus");
  listItem.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
  listElement.appendChild(listItem);
}

// Update balance, income, and expense values
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  balanceElement.innerText = `$${total}`;
  moneyPlusElement.innerText = `$${income}`;
  moneyMinusElement.innerText = `$${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Update local storage with transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize the app
function init() {
  listElement.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Event listener for form submission
formElement.addEventListener('submit', addTransaction);

// Initialize the app on page load
init();

