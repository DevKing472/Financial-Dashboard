var revenue_status = {
    total_receive: 662180,
    total_pay: 1630270,
    equity_ratio: 75.38,
    debt_equity_ratio: 1.10
}
var data = {
    cur_ratio:75,
    dsi:10,
    dso: 7,
    dpo: 28
}
var profit_loss = [10, 20, 30, 40, 50];
var revenue_all = {
    "current": 31,
    "previous": 44
};
var pl_data = [
    { name: "Alaska", value: 712 },
    { name: "California", value: 781 },
    { name: "Connecticut", value: 802 },
    { name: "Hawali", value: 200 },
    { name: "Kansas", value: 196 },
    { name: "Maine", value: 147 },
    { name: "Maryland", value: 200 },
    { name: "Missouri", value: 93 },
    { name: "Nevada", value: 137 },
    { name: "New hampshire", value: 208 },
    { name: "New Jersey", value: 154 },
    { name: "New Mexico", value: 302 },
    { name: "New York", value: 221 },
    { name: "Ohio", value: 155 },
    { name: "South Carolina", value: 328 },
    { name: "Virginia", value: 149 },
  ];
  var ac_data = [
    { name: "Alaska", value: 700 },
    { name: "California", value: 123 },
    { name: "Connecticut", value: 502 },
    { name: "Hawali", value: 250 },
    { name: "Kansas", value: 126 },
    { name: "Maine", value: 146 },
    { name: "Maryland", value: 100 },
    { name: "Missouri", value: 43 },
    { name: "Nevada", value: 135 },
    { name: "New hampshire", value: 108 },
    { name: "New Jersey", value: 144 },
    { name: "New Mexico", value: 352 },
    { name: "New York", value: 261 },
    { name: "Ohio", value: 175 },
    { name: "South Carolina", value: 358 },
    { name: "Virginia", value: 199 },
  ];
document.getElementById("h3-total-receive").innerHTML = `$${revenue_status.total_receive.toLocaleString()}`;
document.getElementById("h3-total-pay").innerHTML = `$${revenue_status.total_pay.toLocaleString()}`;
document.getElementById("h2-equity-ratio").innerHTML = `${revenue_status.equity_ratio.toLocaleString()}%`;
document.getElementById("h2-debt-ratio").innerHTML = `${revenue_status.debt_equity_ratio.toLocaleString()}%`;