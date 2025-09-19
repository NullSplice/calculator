const display = document.getElementById("user-input");

// state
let first = null;      // first number
let op = null;         // "+", "-", "*", "/"
let overwrite = true;  // next digit replaces display (after op/equals)

// helpers
function setDisplay(text) {
  display.innerText = text;
}
function getDisplayNumber() {
  return Number(display.innerText);
}
function inputDigit(d) {
  if (overwrite || display.innerText === "0") {
    setDisplay(d === "." ? "0." : d);
  } else {
    if (d === "." && display.innerText.includes(".")) return;
    setDisplay(display.innerText + d);
  }
  overwrite = false;
}
function clearAll() {
  first = null; op = null; overwrite = true;
  setDisplay("0");
}
function delOne() {
  if (overwrite) return;
  const s = display.innerText;
  setDisplay(s.length > 1 ? s.slice(0, -1) : "0");
}
function compute() {
  if (op === null || first === null) return;
  const a = first;
  const b = getDisplayNumber();
  let r;
  switch (op) {
    case "+": r = a + b; break;
    case "-": r = a - b; break;
    case "*": r = a * b; break;
    case "/": r = b === 0 ? NaN : a / b; break;
  }
  // normalize floats a bit
  const out = Number.isFinite(r) ? String(+parseFloat(r.toFixed(12))) : "NaN";
  setDisplay(out);
  first = null; op = null; overwrite = true;
}
function setOperator(nextOp) {
  if (op && !overwrite) {
    // if user types: 2 + 3 +  -> do the pending compute first
    compute();
    // after compute(), result is on display; store as first
    first = getDisplayNumber();
  } else {
    first = getDisplayNumber();
  }
  op = nextOp;
  overwrite = true; // next digits start a new number
}

// numbers & dot
document.querySelectorAll(".numbers").forEach(btn => {
  btn.addEventListener("click", e => {
    inputDigit(e.target.textContent.trim());
  });
});

// operations (AC, DEL, =, + - * /)
document.querySelectorAll(".operations").forEach(btn => {
  btn.addEventListener("click", e => {
    const key = e.target.textContent.trim();

    if (key === "AC") return clearAll();
    if (key === "DEL") return delOne();
    if (key === "=")   return compute();

    // operators
    if (/[+\-*/]/.test(key)) return setOperator(key);
  });
});

// boot
setDisplay("0");
