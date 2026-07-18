export function money(amountMxn, currency = 'MXN', fx = 1) {
  if (currency === 'USD') {
    return 'US$' + Math.round(amountMxn / fx).toLocaleString('en-US');
  }
  return '$' + Math.round(amountMxn).toLocaleString('en-US');
}
export function pct(x) { return (x * 100).toFixed(1) + '%'; }
