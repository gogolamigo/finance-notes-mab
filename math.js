// 單筆複利計算與輸入驗證：同一實作供網站與 Node 測試使用。
(function (global) {
  'use strict';
  const LIMITS = Object.freeze({ principal: [0, 100000000], rate: [-50, 50], years: [0, 50] });

  function parseNumber(value) {
    if (typeof value === 'string' && value.trim() === '') return null;
    if (typeof value !== 'string' && typeof value !== 'number') return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  function calculateCompound(principalInput, rateInput, yearsInput) {
    const principal = parseNumber(principalInput);
    const ratePercent = parseNumber(rateInput);
    const years = parseNumber(yearsInput);
    if (principal === null || principal < LIMITS.principal[0] || principal > LIMITS.principal[1]) {
      return { ok: false, error: '本金需為 0 至 100,000,000 之間的數字。' };
    }
    if (ratePercent === null || ratePercent < LIMITS.rate[0] || ratePercent > LIMITS.rate[1]) {
      return { ok: false, error: '年利率需為 −50% 至 50% 之間的數字。' };
    }
    if (years === null || !Number.isInteger(years) || years < LIMITS.years[0] || years > LIMITS.years[1]) {
      return { ok: false, error: '年數需為 0 至 50 的整數。' };
    }
    const finalValue = principal * Math.pow(1 + ratePercent / 100, years);
    if (!Number.isFinite(finalValue)) return { ok: false, error: '數值超出可計算範圍。' };
    return { ok: true, principal, ratePercent, years, finalValue, difference: finalValue - principal };
  }
  const api = { parseNumber, calculateCompound, LIMITS };
  global.FINANCE_MATH = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
