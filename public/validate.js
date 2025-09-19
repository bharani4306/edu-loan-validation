document.getElementById("loanForm").addEventListener("submit", function(e) {
  const aadhaar = this.aadhaar.value.trim();
  const pan = this.pan.value.trim();
  const income = Number(this.income.value);
  const amount = Number(this.amount.value);

  if (!/^\d{12}$/.test(aadhaar)) { alert("Aadhaar must be 12 digits"); e.preventDefault(); }
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) { alert("Invalid PAN format"); e.preventDefault(); }
  if (income <= 0 || amount <= 0) { alert("Income and loan amount must be positive"); e.preventDefault(); }
});

