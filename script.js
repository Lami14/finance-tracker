const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");

const localStorageTransactions =
JSON.parse(localStorage.getItem("transactions"));

let transactions =
localStorageTransactions !== null ? localStorageTransactions : [];

let chart;

function addTransaction(e){

e.preventDefault();

const transaction = {
id: Date.now(),
text: text.value,
amount: +amount.value,
category: category.value
};

transactions.push(transaction);

updateLocalStorage();
init();

text.value="";
amount.value="";
}

function addTransactionDOM(transaction){

const sign = transaction.amount < 0 ? "-" : "+";

const li = document.createElement("li");

li.innerHTML = `
${transaction.text} (${transaction.category})
<span>${sign}$${Math.abs(transaction.amount)}</span>
<button onclick="removeTransaction(${transaction.id})">x</button>
`;

list.appendChild(li);
}

function updateValues(){

const amounts = transactions.map(t => t.amount);

const total = amounts
.reduce((acc,item)=> acc+item,0)
.toFixed(2);

const income = amounts
.filter(item=> item>0)
.reduce((acc,item)=> acc+item,0)
.toFixed(2);

const expense = (
amounts
.filter(item=> item<0)
.reduce((acc,item)=> acc+item,0) * -1
).toFixed(2);

balance.innerText = `$${total}`;
money_plus.innerText = `$${income}`;
money_minus.innerText = `$${expense}`;

}

function removeTransaction(id){

transactions = transactions.filter(t => t.id !== id);

updateLocalStorage();
init();

}

function updateLocalStorage(){

localStorage.setItem(
"transactions",
JSON.stringify(transactions)
);

}

function createChart(){

const ctx = document.getElementById("chart");

const expenses = transactions.filter(t => t.amount < 0);

const labels = expenses.map(e => e.category);
const data = expenses.map(e => Math.abs(e.amount));

if(chart){
chart.destroy();
}

chart = new Chart(ctx,{
type:"pie",
data:{
labels:labels,
datasets:[{
data:data
}]
}
});

}

function init(){

list.innerHTML="";

transactions.forEach(addTransactionDOM);

updateValues();

createChart();

}

init();

form.addEventListener("submit", addTransaction);
