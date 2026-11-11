window.FINANCE_LESSONS = [
  {
    id: "time-value-of-money",
    order: 1,
    category: "時間與價值",
    title: "貨幣時間價值",
    subtitle: "把不同時間的金額，換到同一個時間點比較。",
    summary: "從一筆存款理解複利、現值與終值，分清楚利息是如何累積的。",
    question: "為什麼同樣是 NT$10,000，今天拿到和兩年後拿到，不能直接當成一樣？",
    intro: [
      "錢的價值和收到時間有關。若今天拿到的錢可以產生利息，延後收到就少了一段累積時間。複利把前一期利息留在本金裡，下一期一起計息；現值則把未來金額換算成今天可比較的金額。",
      "這裡先用固定利率、每年複利的假設看清楚邏輯。計算前要確認利率與期數使用相同的時間單位：使用年利率，就搭配年數；不能直接把年利率當成月利率。"
    ],
    takeaway: "比較不同時間的金額前，先用一致的利率與期間，把它們換到同一個時間點。",
    formula: {
      expression: "FV = PV × (1 + r)^n；PV = FV ÷ (1 + r)^n",
      symbols: [
        { symbol: "PV", meaning: "現在的金額，也就是現值。" },
        { symbol: "FV", meaning: "經過 n 期後的金額，也就是終值。" },
        { symbol: "r", meaning: "每期利率，計算時以小數代入，例如 5% = 0.05。" },
        { symbol: "n", meaning: "期數，須與利率的期間一致；本篇以年為單位。" }
      ],
      assumptions: [
        "單筆本金，每期利率固定，利息全部留存並繼續計息。",
        "期間沒有額外投入或提領，例子忽略稅費。",
        "例子的固定利率是教學假設，不代表任何實際投資的保證報酬。"
      ]
    },
    example: {
      intro: "自編教學情境：本金 NT$10,000，年利率 5%，每年複利一次，放兩年。",
      headers: ["時點", "計算", "金額"],
      rows: [
        ["開始時", "投入單筆本金", "NT$10,000"],
        ["第一年底", "10,000 × 1.05", "NT$10,500"],
        ["第二年底", "10,500 × 1.05", "NT$11,025"]
      ],
      conclusion: "兩年總利息是 NT$1,025。如果只算單利，金額會是 NT$11,000；多出的 NT$25，就是第一年利息 NT$500 在第二年再賺到的利息。反過來，以相同的 5% 折現兩年，NT$11,025 的現值就是 NT$10,000。",
      note: "金額與利率均為自編假設；計算過程保留精度，顯示時才四捨五入。"
    },
    mistakes: [
      {
        myth: "5% 放兩年，就是本金增加 10%。",
        fact: "這是單利算法。複利每年對當時的全部餘額計息，本例兩年增加 10.25%。"
      },
      {
        myth: "只要時間拉長，金額一定按照固定利率公式成長。",
        fact: "固定利率是本例假設。如果報酬率每期不同，就要依各期報酬率逐期相乘，不能把假設報酬當成保證。"
      }
    ],
    quiz: {
      question: "NT$5,000 以年利率 10% 存兩年，每年複利一次且利息全部留存，兩年後共有多少？",
      options: [
        { text: "NT$5,500", explanation: "只計算了一年的利息：5,000 × 1.1 = 5,500。" },
        { text: "NT$6,000", explanation: "使用了單利算法，沒有讓第一年的利息繼續計息。" },
        { text: "NT$6,050", explanation: "正確。5,000 × 1.1 × 1.1 = 6,050，第二年連同第一年的利息一起計息。" },
        { text: "NT$6,500", explanation: "不符合逐年依餘額計息的計算；第一年底為 5,500，第二年利息為 550。" }
      ],
      answer: 2
    },
    sources: [
      {
        publisher: "OpenStax",
        title: "Principles of Finance — 7.2 Time Value of Money (TVM) Basics",
        url: "https://openstax.org/books/principles-finance/pages/7-2-time-value-of-money-tvm-basics",
        supports: "複利機制、終值公式 FV = PV × (1 + r)^n，以及利率和期數的意義；現值公式由終值公式移項得到。"
      },
      {
        publisher: "美國證券交易委員會（SEC）Investor.gov",
        title: "Compound Interest",
        url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/compound-interest",
        supports: "複利包含原始本金與累積利息一起計息。"
      }
    ],
    interactive: "compound"
  },
  {
    id: "risk-and-return",
    order: 2,
    category: "風險與配置",
    title: "風險與報酬",
    subtitle: "先看可能發生什麼，再看平均可能賺多少。",
    summary: "用兩種可能情境算出期望報酬，理解平均報酬為正，仍可能虧損。",
    question: "一項投資的預期報酬率是 5%，是不是代表一年後一定多出 5%？",
    intro: [
      "預期報酬描述各種可能結果的加權平均，風險則提醒我們，實際結果可能和平均不同，甚至虧損。只知道平均可能賺多少，還不足以知道結果會有多不穩定。",
      "投資人承擔較高風險時，通常會要求較高的預期報酬作為補償，但風險高並不保證最後賺得多。因此，比較投資時，需要一起看報酬與可能損失，也要分清楚預期結果和實際結果。"
    ],
    takeaway: "期望報酬是可能結果的加權平均，並不是每次都會實現的保證。",
    formula: {
      expression: "E(R) = p₁R₁ + p₂R₂ + … + pₙRₙ；p₁ + p₂ + … + pₙ = 1",
      symbols: [
        { symbol: "E(R)", meaning: "期望報酬率，也就是以機率為權重的平均報酬率。" },
        { symbol: "pᵢ", meaning: "第 i 種情境的機率，全部機率合計須為 1。" },
        { symbol: "Rᵢ", meaning: "第 i 種情境下的報酬率，負數代表虧損。" },
        { symbol: "n", meaning: "納入計算的情境數量。" }
      ],
      assumptions: [
        "各情境彼此互斥，合計涵蓋模型中的全部可能結果。",
        "例子與題目的機率和報酬率都是自編教學假設，不是真實市場的估計。",
        "例子只看單一年度，忽略稅費，不把期望報酬當成保證報酬。"
      ]
    },
    example: {
      intro: "自編教學情境：投入 NT$10,000，假設一年後只有以下兩種可能結果。",
      headers: ["情境", "機率", "報酬率", "期末金額"],
      rows: [
        ["表現較好", "50%", "+20%", "NT$12,000"],
        ["表現較差", "50%", "−10%", "NT$9,000"]
      ],
      conclusion: "期望報酬率 = 0.5 × 20% + 0.5 × (−10%) = 5%。但在這個兩情境假設裡，實際結果是 +20% 或 −10%，並不是固定拿到 5%；即使平均為正，仍有 50% 的機率虧損。",
      note: "表格是用來練習機率加權平均的假設模型，不代表任何真實商品或未來績效。"
    },
    mistakes: [
      {
        myth: "高風險一定帶來高報酬。",
        fact: "較高的是投資人要求或追求的報酬，實際結果仍可能更差。承擔額外風險不等於保證獲得額外收益。"
      },
      {
        myth: "期望報酬為正，就不會虧損。",
        fact: "平均為正和存在虧損情境可以同時成立。本例的期望報酬為 5%，但仍有 50% 的機率損失 10%。"
      }
    ],
    quiz: {
      question: "一項投資有 50% 機率賺 10%，另有 50% 機率虧 6%。哪一項正確？",
      options: [
        { text: "一年後一定賺 2%。", explanation: "把加權平均誤當成保證結果；題目中的兩種實際結果是 +10% 和 −6%。" },
        { text: "期望報酬率為 2%，但實際仍可能虧 6%。", explanation: "正確。0.5 × 10% + 0.5 × (−6%) = 2%，且仍有負報酬情境。" },
        { text: "最大可能虧損只有 2%。", explanation: "2% 是期望報酬率，題目中的虧損情境是 −6%。" },
        { text: "期望報酬為正，因此沒有風險。", explanation: "平均結果為正不能消除不確定性，也不能排除虧損。" }
      ],
      answer: 1
    },
    sources: [
      {
        publisher: "美國證券交易委員會（SEC）Investor.gov",
        title: "What is Risk?",
        url: "https://www.investor.gov/introduction-investing/investing-basics/what-risk",
        supports: "風險涉及不確定性及潛在損失；投資人通常要求較高報酬補償較高風險。"
      },
      {
        publisher: "OpenStax",
        title: "Principles of Finance 2e — 13.5 Probability Distributions",
        url: "https://openstax.org/books/principles-finance-2e/pages/13-5-probability-distributions",
        supports: "期望報酬是以各情境機率為權重的加權平均。"
      }
    ],
    interactive: "none"
  },
  {
    id: "bond-price-and-interest-rate",
    order: 3,
    category: "債券入門",
    title: "債券價格與市場利率",
    subtitle: "票息固定時，市場利率改變的是債券的吸引力與價格。",
    summary: "區分票息和市場要求報酬率，用一張一年後到期的債券理解價格反向變動。",
    question: "市場利率升高，為什麼手上原本的固定利率債券，價格反而可能下跌？",
    intro: [
      "固定利率債券約定的票息不會因市場利率上升就自動增加。如果同風險、同期限的新投資可以提供更高報酬，舊債券的固定現金流就比較不吸引人，價格必須下降，才能讓新買家取得較高的報酬率。",
      "在其他條件不變下，固定利率債券價格與市場要求報酬率方向相反。計算時要把未來的票息和本金都折算成現值；這裡的市場要求報酬率是評價相同風險與期限債券的報酬要求，不能直接把央行政策利率代入。"
    ],
    takeaway: "票息固定，不代表市價固定；其他條件不變時，市場要求報酬率上升，債券價格下降。",
    formula: {
      expression: "P = Σ[t = 1 至 n] C ÷ (1 + y)^t + F ÷ (1 + y)^n；只剩一年時，P = (C + F) ÷ (1 + y)",
      symbols: [
        { symbol: "P", meaning: "債券目前的價格。" },
        { symbol: "C", meaning: "每年固定票息金額，等於面額乘以票面利率。" },
        { symbol: "F", meaning: "到期償還的面額。" },
        { symbol: "y", meaning: "同風險、同期限債券的市場要求年報酬率，計算時以小數代入。" },
        { symbol: "n", meaning: "剩餘年數；本篇數值例子設定為一年。" },
        { symbol: "t 與 Σ", meaning: "t 表示第幾年；Σ 表示把各年票息的現值加總。" }
      ],
      assumptions: [
        "固定利率、每年付息一次，約定現金流不變，忽略稅費。",
        "假設無違約、無提前贖回；比較價格時維持其他條件不變。",
        "自編例子距離最後一次票息與本金支付均為一年。"
      ]
    },
    example: {
      intro: "自編教學情境：債券面額 NT$1,000，票面利率 5%，一年後到期。到期共收到票息 NT$50 加本金 NT$1,000，合計 NT$1,050。",
      headers: ["市場要求報酬率", "價格計算", "債券價格"],
      rows: [
        ["5%", "1,050 ÷ 1.05", "NT$1,000"],
        ["10%", "1,050 ÷ 1.10", "約 NT$954.55"]
      ],
      conclusion: "市場要求報酬率從 5% 提高為 10% 後，債券價格由 NT$1,000 降為約 NT$954.55。票息仍是 NT$50，到期收取的合計金額仍為 NT$1,050；調整的是新買家現在願意支付的價格。",
      note: "面額、利率與期限均為自編假設；金額保留精度計算後才四捨五入至小數點後兩位。"
    },
    mistakes: [
      {
        myth: "市場利率提高，原本的債券票息也會提高。",
        fact: "固定票息由契約決定，不會跟著市場利率自動調整。市場利率的變動主要透過價格反映。"
      },
      {
        myth: "固定收益代表市價固定。",
        fact: "約定現金流固定，並不代表到期前的交易價格不會變動。若在到期前出售，價格可能高於或低於買入價格。"
      }
    ],
    quiz: {
      question: "一張固定利率債券每年付 NT$50 票息。在其他條件不變下，市場要求報酬率下降，哪項正確？",
      options: [
        { text: "債券價格上升，票息仍是 NT$50。", explanation: "正確。折現率下降使既定現金流的現值提高，但契約約定的固定票息不變。" },
        { text: "債券價格上升，票息也自動增加。", explanation: "價格方向正確，但固定票息不會跟著市場要求報酬率調整。" },
        { text: "債券價格下降，票息仍是 NT$50。", explanation: "票息判斷正確，但價格方向相反；要求報酬率下降時，既定現金流的現值提高。" },
        { text: "債券價格與票息都不變。", explanation: "固定的是票息，價格仍會隨市場要求報酬率變動。" }
      ],
      answer: 0
    },
    sources: [
      {
        publisher: "美國證券交易委員會（SEC）Investor.gov",
        title: "Investor Bulletin: Fixed Income Investments — When Interest Rates Go Up, Prices of Fixed-Rate Bonds Fall",
        url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-86",
        supports: "固定票息不隨市場利率改變，固定利率債券價格與市場利率反向，並存在利率風險。"
      },
      {
        publisher: "OpenStax",
        title: "Principles of Finance — 10.2 Bond Valuation",
        url: "https://openstax.org/books/principles-finance/pages/10-2-bond-valuation",
        supports: "債券價格為票息與本金的現值總和；票息金額等於面額乘以票面利率。"
      }
    ],
    interactive: "none"
  },
  {
    id: "diversification",
    order: 4,
    category: "風險與配置",
    title: "分散投資",
    subtitle: "少依賴單一投資的表現，也要看資產會不會一起下跌。",
    summary: "用兩項資產各半的情境，理解分散如何減少集中風險，以及為什麼仍可能虧損。",
    question: "如果把準備投資的 NT$10,000 分成兩份，各放進一項資產，是不是就不用擔心虧錢？",
    intro: [
      "把全部資金放在同一家公司或同一產業，結果就很依賴它的表現。分散投資是把資金放到不同投資，減少單一投資出狀況時對整體的影響。不過，關鍵不只是買了幾項，還要看它們會不會在同一時間一起漲跌。",
      "當資產的表現不完全同步，一項表現較差時，另一項可能補上一部分；如果都受到相同因素影響，就未必有這種效果。分散能降低過度集中在特定公司或產業的風險，但景氣衰退等影響整體市場的風險仍然存在，不會因為多買幾項就消失。",
      "下面只看一年的結果。先用期初投入比例作為權重，把 A、B 在同一情境下的報酬率加權，得到組合報酬率；再用各情境的機率加權，才得到期望報酬率。投入比例和發生機率是兩件不同的事。"
    ],
    takeaway: "分散的效果取決於資產如何共同變動；它能減少集中風險，但市場風險與虧損可能仍在。",
    formula: {
      expression: "Rₚ = wₐ × Rₐ + wᵦ × Rᵦ；E(Rₚ) = p₁ × Rₚ,₁ + p₂ × Rₚ,₂ + p₃ × Rₚ,₃",
      symbols: [
        { symbol: "Rₚ", meaning: "投資組合在某一情境下的一年報酬率。" },
        { symbol: "wₐ、wᵦ", meaning: "期初投入 A、B 的金額占總本金的比例，兩者相加為 1。" },
        { symbol: "Rₐ、Rᵦ", meaning: "A、B 在同一情境下的一年報酬率，負數代表虧損。" },
        { symbol: "p₁、p₂、p₃", meaning: "本例三種情境各自的發生機率，合計為 1；不是資產投入比例。" },
        { symbol: "Rₚ,₁、Rₚ,₂、Rₚ,₃", meaning: "同一投資組合在三種情境下，各自算出的報酬率。" },
        { symbol: "E(Rₚ)", meaning: "依情境機率加權的期望報酬率，不是保證會實現的結果。" }
      ],
      assumptions: [
        "只看單一年度，期初以自有本金買入，期間沒有額外投入、提領或調整配置，忽略稅費。",
        "權重依期初投入金額計算，不依持有股數；百分數計算時轉成小數，例如 50% = 0.5。",
        "三種情境彼此互斥，合計涵蓋這個假設模型的全部結果；機率、報酬率與資產表現均為自編教學設定。"
      ]
    },
    example: {
      intro: "自編教學情境：本金 NT$10,000，期初分別投入 A、B 各 NT$5,000，權重各為 50%。假設一年後只有下列三種可能情境，機率合計為 40% + 40% + 20% = 100%。",
      headers: ["一年後的情境", "機率", "A 報酬率", "B 報酬率", "組合報酬率", "組合期末金額"],
      rows: [
        ["A 表現好，B 表現差", "40%", "+25%", "−5%", "+10%", "NT$11,000"],
        ["A 表現差，B 表現好", "40%", "−5%", "+25%", "+10%", "NT$11,000"],
        ["市場共同下跌", "20%", "−15%", "−15%", "−15%", "NT$8,500"]
      ],
      conclusion: "第一種情境的組合報酬率是 0.5 × 0.25 + 0.5 × (−0.05) = 0.10，也就是 10%；第二種也相同。只持有 A 的人遇到第二種情境會虧 5%，各半配置則由 B 的獲利抵銷這部分損失。可是兩項一起跌 15% 時，組合仍跌 15%，本金減少 NT$1,500。組合的期望報酬率是 0.4 × 0.10 + 0.4 × 0.10 + 0.2 × (−0.15) = 0.05，也就是 5%；平均為正，仍保留 20% 的虧損機率。",
      note: "A、B 是自編資產，所有數值與機率都是教學假設，不代表真實商品或預測。兩項資產只是為了看清楚計算，不表示持有兩項就已充分分散；真實資產的共同變動也不會固定不變。"
    },
    mistakes: [
      {
        myth: "只要買很多檔，就一定分散了。",
        fact: "如果都集中在同一產業，或多檔基金持有的內容高度重疊，仍可能一起受到衝擊。要看資金實際放在哪裡，以及資產如何共同變動，不能只數持有幾檔。"
      },
      {
        myth: "分散之後，就不會再虧損。",
        fact: "分散可以降低單一投資帶來的集中風險，不能消除影響整體市場的風險。本例共同下跌時，即使各持有一半，組合仍虧損 15%。"
      },
      {
        myth: "分散一定會提高期望報酬率。",
        fact: "組合報酬仍由投入比例與資產報酬決定。本例 A、B 單獨持有的期望報酬率也都是 5%，各半配置沒有把它提高；改變的是各情境下的結果與對單一資產的依賴。"
      }
    ],
    quiz: {
      question: "自編題目：年初把 NT$10,000 各半投入 A、B，期間不調整配置、沒有額外投入或提領，忽略稅費。一年後 A 跌 10%、B 跌 20%，哪項正確？",
      options: [
        { text: "組合不會虧損，因為已經分散投資。", explanation: "分散不保證獲利；兩項資產都下跌時，組合仍可能虧損。" },
        { text: "組合虧損 30%，期末為 NT$7,000。", explanation: "不能直接把兩個報酬率相加；A、B 各只占期初本金的一半，要先乘上各自權重。" },
        { text: "組合只虧損 10%，期末為 NT$9,000。", explanation: "這只計入 A 的報酬率，漏掉另一半資金放在 B 而下跌 20% 的影響。" },
        { text: "組合虧損 15%，期末為 NT$8,500；分散仍可能虧損。", explanation: "正確。0.5 × (−0.10) + 0.5 × (−0.20) = −0.15；期末為 10,000 × 0.85 = 8,500。分散沒有消除這次共同下跌的損失。" }
      ],
      answer: 3
    },
    sources: [
      {
        publisher: "美國證券交易委員會（SEC）Investor.gov",
        title: "Asset Allocation and Diversification",
        url: "https://www.investor.gov/introduction-investing/getting-started/asset-allocation",
        supports: "分散包括跨資產類別及同類資產內的配置；集中於單一產業或持有內容重疊的多檔基金，不一定達到分散效果。"
      },
      {
        publisher: "OpenStax",
        title: "Principles of Finance — Chapter 15 Summary",
        url: "https://openstax.org/books/principles-finance/pages/15-summary",
        supports: "公司特有風險可透過分散降低，但市場風險仍在；資產報酬不完全同步時，部分損失可能由其他資產的表現抵銷。"
      },
      {
        publisher: "OpenStax",
        title: "Principles of Finance 2e — 13.5 Probability Distributions",
        url: "https://openstax.org/books/principles-finance-2e/pages/13-5-probability-distributions",
        supports: "以投入價值計算組合權重，以及以機率加權計算期望報酬；本篇情境與數值另行自編。"
      }
    ],
    interactive: "none"
  }
];
