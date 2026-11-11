// 本檔僅包含文章純文字資料；新增文章時依 AGENTS.md 編輯。
window.FINANCE_LESSONS = [
  {
    "id": "time-value",
    "order": 1,
    "category": "時間與價值",
    "title": "貨幣時間價值",
    "subtitle": "讓時間，成為金額的一部分。",
    "summary": "從一筆存款理解複利、現值與終值，分清楚利息是如何累積的。",
    "question": "如果今天有 NT$10,000，為什麼過了兩年，金額可能不只 NT$10,000？",
    "intro": [
      "金錢放在不同時間點，價值不一定相同。因為今天持有的錢，可以從現在開始產生利息；把同樣金額放到未來才取得，便少了這段時間的機會。",
      "單筆複利是讓每年的利息留下來，與原本金一起成為下次計息的基礎。未來的金額稱為終值（FV），折算回今天的金額稱為現值（PV）。這裡使用固定利率的教學假設，並不代表投資保證獲利。"
    ],
    "takeaway": "複利是「本金加上已累積利息一起計息」；比較不同時間的金額，必須先對齊時間點。",
    "formula": {
      "expression": "FV = PV × (1 + r)^n；反過來 PV = FV ÷ (1 + r)^n",
      "symbols": [
        {
          "symbol": "PV",
          "meaning": "今天的本金或現值。"
        },
        {
          "symbol": "FV",
          "meaning": "經過 n 期後的未來金額（終值）。"
        },
        {
          "symbol": "r",
          "meaning": "每期利率，以小數代入；例如 5% 寫成 0.05。"
        },
        {
          "symbol": "n",
          "meaning": "計息期數；年利率搭配年度計息時，n 是年數。"
        }
      ],
      "assumptions": [
        "每年複利一次，利息全數留存，期間沒有其他投入或提領。",
        "假設利率每年固定，不考慮稅費、通膨與違約風險。"
      ]
    },
    "example": {
      "intro": "自編教學情境：現在存入 NT$10,000，年利率固定 5%，每年複利一次，存兩年。",
      "headers": [
        "時間",
        "計算",
        "期末金額"
      ],
      "rows": [
        [
          "第 0 年",
          "初始本金",
          "NT$10,000"
        ],
        [
          "第 1 年",
          "10,000 × 1.05",
          "NT$10,500"
        ],
        [
          "第 2 年",
          "10,500 × 1.05",
          "NT$11,025"
        ]
      ],
      "conclusion": "兩年後終值為 NT$11,025，累積利息 NT$1,025。第二年的利息是 NT$525，不只對原本本金計息，也對第一年的利息計息。",
      "note": "利率、年數與本金皆為自編教學假設，非實際商品報價。"
    },
    "mistakes": [
      {
        "myth": "每年利息都只用原始本金 NT$10,000 計算。",
        "fact": "那是單利的想法；複利的第二年要把第一年的利息一起算入本金。"
      },
      {
        "myth": "有複利就一定賺錢。",
        "fact": "公式也允許負利率作為情境試算；投資還存在波動、費用與其他風險。"
      }
    ],
    "quiz": {
      "question": "本金 NT$10,000、年利率 5%、每年複利。第 2 年利息是多少？",
      "options": [
        {
          "text": "NT$500",
          "explanation": "這是第一年的利息，沒有把已累積的利息納入。"
        },
        {
          "text": "NT$525",
          "explanation": "正確。第 1 年後有 NT$10,500；第二年利息 10,500 × 5% = NT$525。"
        },
        {
          "text": "NT$1,000",
          "explanation": "這是兩年用單利計算的利息總和，不是第二年的利息。"
        },
        {
          "text": "NT$1,025",
          "explanation": "這是兩年累積利息，不是第二年單獨的利息。"
        }
      ],
      "answer": 1
    },
    "sources": [
      {
        "publisher": "SEC Investor.gov",
        "title": "Introduction to Investing — Compound Growth",
        "url": "https://www.investor.gov/introduction-investing",
        "supports": "複利成長來自本金與已累積報酬繼續產生報酬；並提醒投資風險。"
      }
    ],
    "interactive": "compound"
  },
  {
    "id": "risk-return",
    "order": 2,
    "category": "風險與配置",
    "title": "風險與報酬",
    "subtitle": "平均有機會賺，不代表每次都賺。",
    "summary": "用兩種可能情境算出期望報酬，理解平均報酬為正，仍可能虧損。",
    "question": "某項投資「期望報酬率是正的」，是否代表這筆投資一定賺錢？",
    "intro": [
      "報酬是投資結果的變化，風險則提醒我們：結果可能偏離原本預期，甚至損失本金。只看到「平均可以賺多少」，容易忽略各種不同的結果。",
      "期望報酬率會把可能結果依發生機率加權平均。它是一個機率模型的平均值，不是下一次投資結果的保證，也不能只靠它衡量完整的投資風險。"
    ],
    "takeaway": "期望報酬是加權平均，不是保證；評估投資時，必須同時看可能的負面結果。",
    "formula": {
      "expression": "E(R) = p₁ × R₁ + p₂ × R₂ + ⋯ + pₙ × Rₙ",
      "symbols": [
        {
          "symbol": "E(R)",
          "meaning": "投資的期望報酬率。"
        },
        {
          "symbol": "pᵢ",
          "meaning": "第 i 種情境發生的機率；所有機率相加等於 1。"
        },
        {
          "symbol": "Rᵢ",
          "meaning": "第 i 種情境下的報酬率，可以是負數。"
        },
        {
          "symbol": "n",
          "meaning": "所有互斥且涵蓋完整的情境數量。"
        }
      ],
      "assumptions": [
        "自編兩種互斥且窮盡的情境，機率合計 100%。",
        "不包含交易成本與稅費，情境不是歷史數據或投資預測。"
      ]
    },
    "example": {
      "intro": "自編教學情境：一項資產未來可能出現兩種情境，並假設其機率如下。",
      "headers": [
        "情境",
        "假設機率",
        "假設報酬率",
        "加權貢獻"
      ],
      "rows": [
        [
          "景氣良好",
          "60%",
          "+20%",
          "+12%"
        ],
        [
          "景氣不佳",
          "40%",
          "−10%",
          "−4%"
        ],
        [
          "合計",
          "100%",
          "—",
          "+8%"
        ]
      ],
      "conclusion": "期望報酬率 = 60% × 20% + 40% × (−10%) = 8%。雖然平均是 +8%，仍有 40% 的假設機率發生 −10% 的結果。",
      "note": "上表機率與報酬率均為自編，僅協助練習期望值計算。"
    },
    "mistakes": [
      {
        "myth": "期望報酬率 8%，就代表我下次一定賺 8%。",
        "fact": "期望值是多種結果按機率加權的平均；實際結果可能是 +20% 或 −10%。"
      },
      {
        "myth": "只要期望報酬越高，這項投資就一定比較好。",
        "fact": "還需要衡量可能損失的程度、分布與自己的承受能力；只比較平均值不足以決策。"
      }
    ],
    "quiz": {
      "question": "某投資有 50% 機率報酬 +20%，50% 機率報酬 −10%。期望報酬率是多少？",
      "options": [
        {
          "text": "+15%",
          "explanation": "這是沒有按兩種機率取平均的錯誤結果。"
        },
        {
          "text": "+10%",
          "explanation": "只看到正向情境，忽略負向情境的權重。"
        },
        {
          "text": "+5%",
          "explanation": "正確。0.5 × 20% + 0.5 × (−10%) = +5%。"
        },
        {
          "text": "−5%",
          "explanation": "加權平均的正向部分大於負向部分，不會得到負 5%。"
        }
      ],
      "answer": 2
    },
    "sources": [
      {
        "publisher": "OpenStax",
        "title": "Principles of Finance 2e — 13.5 Probability Distributions",
        "url": "https://openstax.org/books/principles-finance-2e/pages/13-5-probability-distributions",
        "supports": "期望值以各情境機率乘以報酬率再加總計算。"
      },
      {
        "publisher": "SEC Investor.gov",
        "title": "Investment Products — Risk and Return",
        "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products",
        "supports": "投資存在風險，可能損失全部或部分本金。"
      }
    ],
    "interactive": "none"
  },
  {
    "id": "bond-rates",
    "order": 3,
    "category": "債券入門",
    "title": "債券價格與市場利率",
    "subtitle": "票息固定，不代表價格固定。",
    "summary": "區分票息和市場要求報酬率，用一張一年後到期的債券理解價格反向變動。",
    "question": "市場利率升高，為什麼手上原本的固定利率債券，價格反而可能下跌？",
    "intro": [
      "固定利率債券約定的票息不會因市場利率上升就自動增加。如果同風險、同期限的新投資可以提供更高報酬，舊債券的固定現金流就比較不吸引人，價格必須下降，才能讓新買家取得較高的報酬率。",
      "在其他條件不變下，固定利率債券價格與市場要求報酬率方向相反。計算時要把未來的票息和本金都折算成現值；這裡的市場要求報酬率是評價相同風險與期限債券的報酬要求，不能直接把央行政策利率代入。"
    ],
    "takeaway": "票息固定，不代表市價固定；其他條件不變時，市場要求報酬率上升，債券價格下降。",
    "formula": {
      "expression": "P = Σ[t = 1 至 n] C ÷ (1 + y)^t + F ÷ (1 + y)^n；只剩一年時，P = (C + F) ÷ (1 + y)",
      "symbols": [
        {
          "symbol": "P",
          "meaning": "債券目前的價格。"
        },
        {
          "symbol": "C",
          "meaning": "每年固定票息金額，等於面額乘以票面利率。"
        },
        {
          "symbol": "F",
          "meaning": "到期償還的面額。"
        },
        {
          "symbol": "y",
          "meaning": "同風險、同期限債券的市場要求年報酬率，計算時以小數代入。"
        },
        {
          "symbol": "n",
          "meaning": "剩餘年數；本篇數值例子設定為一年。"
        },
        {
          "symbol": "t 與 Σ",
          "meaning": "t 表示第幾年；Σ 表示把各年票息的現值加總。"
        }
      ],
      "assumptions": [
        "固定利率、每年付息一次，約定現金流不變，忽略稅費。",
        "假設無違約、無提前贖回；比較價格時維持其他條件不變。",
        "自編例子距離最後一次票息與本金支付均為一年。"
      ]
    },
    "example": {
      "intro": "自編教學情境：債券面額 NT$1,000，票面利率 5%，一年後到期。到期共收到票息 NT$50 加本金 NT$1,000，合計 NT$1,050。",
      "headers": [
        "市場要求報酬率",
        "價格計算",
        "債券價格"
      ],
      "rows": [
        [
          "5%",
          "1,050 ÷ 1.05",
          "NT$1,000"
        ],
        [
          "10%",
          "1,050 ÷ 1.10",
          "約 NT$954.55"
        ]
      ],
      "conclusion": "市場要求報酬率從 5% 提高為 10% 後，債券價格由 NT$1,000 降為約 NT$954.55。票息仍是 NT$50，到期收取的合計金額仍為 NT$1,050；調整的是新買家現在願意支付的價格。",
      "note": "面額、利率與期限均為自編假設；金額保留精度計算後才四捨五入至小數點後兩位。"
    },
    "mistakes": [
      {
        "myth": "市場利率提高，原本的債券票息也會提高。",
        "fact": "固定票息由契約決定，不會跟著市場利率自動調整。市場利率的變動主要透過價格反映。"
      },
      {
        "myth": "固定收益代表市價固定。",
        "fact": "約定現金流固定，並不代表到期前的交易價格不會變動。若在到期前出售，價格可能高於或低於買入價格。"
      }
    ],
    "quiz": {
      "question": "一張固定利率債券每年付 NT$50 票息。在其他條件不變下，市場要求報酬率下降，哪項正確？",
      "options": [
        {
          "text": "債券價格上升，票息仍是 NT$50。",
          "explanation": "正確。折現率下降時，固定現金流的現值上升；票息沒有改變。"
        },
        {
          "text": "債券價格上升，票息也自動增加。",
          "explanation": "價格可能上升，但固定票息不會因市場利率調整。"
        },
        {
          "text": "債券價格下降，票息仍是 NT$50。",
          "explanation": "折現率下降時，價格一般是上升，不是下降。"
        },
        {
          "text": "債券價格與票息都不變。",
          "explanation": "票息不變，但市場報酬要求變動會影響價格。"
        }
      ],
      "answer": 0
    },
    "sources": [
      {
        "publisher": "SEC Investor.gov",
        "title": "Investor Bulletin — Fixed Income Investments",
        "url": "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-86",
        "supports": "固定利率債券的價格與市場利率反向，存在利率風險。"
      },
      {
        "publisher": "OpenStax",
        "title": "Principles of Finance — 10.2 Bond Valuation",
        "url": "https://openstax.org/books/principles-finance/pages/10-2-bond-valuation",
        "supports": "債券價格是票息與面額的折現現值之和。"
      }
    ],
    "interactive": "none"
  },
  {
    "id": "diversification",
    "order": 4,
    "category": "風險與配置",
    "title": "分散投資",
    "subtitle": "不把所有結果押在同一件事上。",
    "summary": "用兩項資產各半的情境，理解分散如何減少集中風險，以及為什麼仍可能虧損。",
    "question": "明明投資標的變多了，為什麼有時風險能下降，有時卻沒有？",
    "intro": [
      "只持有一項資產時，整筆資金都跟著同一個結果波動。把資金分到不同資產，若兩者在某些情境下表現不同，就可能相互抵銷部分損益。這就是分散投資的基本直覺。",
      "分散是否有效，不能只數「買了幾項」。如果所有資產都受到同一種衝擊且一起下跌，組合仍可能虧損。分散可以降低部分個別資產的集中風險，卻不保證消除整體市場風險。"
    ],
    "takeaway": "分散要看資產如何一起變動，不只是持有幾項；分散可能降低波動，但不保證獲利。",
    "formula": {
      "expression": "Rₚ = wₐ × Rₐ + wᵦ × Rᵦ；若各半配置，Rₚ = 0.5 × Rₐ + 0.5 × Rᵦ",
      "symbols": [
        {
          "symbol": "Rₚ",
          "meaning": "投資組合在某情境下的報酬率。"
        },
        {
          "symbol": "wₐ、wᵦ",
          "meaning": "資產 A、B 在期初占總資金的比例，合計為 1。"
        },
        {
          "symbol": "Rₐ、Rᵦ",
          "meaning": "資產 A、B 在同一情境下各自的報酬率。"
        }
      ],
      "assumptions": [
        "期初各配置 50%，同一持有期間，忽略交易成本與再平衡。",
        "數字為自編情境，並非特定金融商品的表現。"
      ]
    },
    "example": {
      "intro": "自編教學情境：把資金各半分成資產 A 和 B，觀察以下兩種可能的情境。",
      "headers": [
        "情境",
        "資產 A 報酬",
        "資產 B 報酬",
        "各半組合報酬"
      ],
      "rows": [
        [
          "情境一",
          "+20%",
          "−5%",
          "+7.5%"
        ],
        [
          "情境二",
          "−10%",
          "+15%",
          "+2.5%"
        ]
      ],
      "conclusion": "情境一：0.5 × 20% + 0.5 × (−5%) = +7.5%；情境二：0.5 × (−10%) + 0.5 × 15% = +2.5%。在這兩個自編情境裡，兩項資產部分抵銷，但換成同時下跌的情境，組合仍可能虧損。",
      "note": "僅用兩項簡化資產說明分散機制；實際波動與相關性要依資料判斷。"
    },
    "mistakes": [
      {
        "myth": "投資商品越多，就必然越分散。",
        "fact": "若持有的商品成分相似、一起上漲下跌，未必得到足夠的分散效果。"
      },
      {
        "myth": "分散投資一定不會虧錢。",
        "fact": "遇到影響整個市場的風險，多項資產仍可能同時下跌。"
      }
    ],
    "quiz": {
      "question": "資產 A 與 B 各占 50%，同時分別下跌 8% 與 4%。這個組合的報酬率是多少？",
      "options": [
        {
          "text": "+6%",
          "explanation": "兩項報酬都是負的，加權組合不會是正值。"
        },
        {
          "text": "−12%",
          "explanation": "直接相加沒有考慮各半權重。"
        },
        {
          "text": "−4%",
          "explanation": "只看其中一個資產的跌幅，沒有做加權。"
        },
        {
          "text": "−6%",
          "explanation": "正確。0.5 × (−8%) + 0.5 × (−4%) = −6%；分散仍可能虧損。"
        }
      ],
      "answer": 3
    },
    "sources": [
      {
        "publisher": "SEC Investor.gov",
        "title": "Asset Allocation and Diversification",
        "url": "https://www.investor.gov/introduction-investing/getting-started/asset-allocation",
        "supports": "分散是把資金分配到不同資產以降低部分風險，也要考量是否同向波動。"
      }
    ],
    "interactive": "none"
  }
];
