(function (root) {
  "use strict";

  function compound(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw new Error("請提供本金、年利率與年數。");
    }

    const { principal, ratePercent, years } = input;
    if (typeof principal !== "number" || !Number.isFinite(principal)) {
      throw new Error("本金必須是有限數值。");
    }
    if (principal < 0 || principal > 100000000) {
      throw new Error("本金請輸入 0 到 100,000,000 之間的數值。");
    }
    if (typeof ratePercent !== "number" || !Number.isFinite(ratePercent)) {
      throw new Error("年利率必須是有限數值。");
    }
    if (ratePercent < -50 || ratePercent > 50) {
      throw new Error("年利率請輸入 -50% 到 50% 之間的數值。");
    }
    if (typeof years !== "number" || !Number.isFinite(years)) {
      throw new Error("年數必須是有限數值。");
    }
    if (!Number.isInteger(years) || years < 0 || years > 50) {
      throw new Error("年數請輸入 0 到 50 的整數。");
    }

    const futureValue = principal === 0
      ? 0
      : principal * Math.pow(1 + ratePercent / 100, years);
    const interest = futureValue - principal;
    if (!Number.isFinite(futureValue) || !Number.isFinite(interest)) {
      throw new Error("計算結果超出可處理範圍，請調整輸入。");
    }
    return { futureValue, interest: interest === 0 ? 0 : interest };
  }

  const api = Object.freeze({ compound });
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.FinanceMath = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
