export function grossAnnualRent(rental) {
  if (rental.mode === 'airbnb') return rental.adr * 365 * rental.occupancy;
  return rental.monthlyRent * 12;
}

export function netAnnualRent(gross, { maintenanceMonthly = 0, adminPct = 0, propertyTaxAnnual = 0 } = {}) {
  return gross - gross * adminPct - maintenanceMonthly * 12 - propertyTaxAnnual;
}

export function netYield(netAnnual, price) {
  return netAnnual / price;
}

export function projectedValue(price, appreciationPct, years) {
  return price * (1 + appreciationPct) ** years;
}

export function totalRoi({ price, netAnnual, appreciationPct, years }) {
  const capitalGain = projectedValue(price, appreciationPct, years) - price;
  return (netAnnual * years + capitalGain) / price;
}

export function paybackYears(price, netAnnual) {
  if (netAnnual <= 0) return null;
  return price / netAnnual;
}
