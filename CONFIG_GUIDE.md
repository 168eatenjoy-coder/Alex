# 🚀 專案風格與細節打包 —— 快速改裝與多商品部署指南

歡迎使用本項目的**「極速改裝與多商品部署模組化系統」**！
我們已經將本專案所有硬核賽車風格（HUD 掃描線、EVA 新世紀福音戰士警告版面、分期金流計算、專業施工卡片、賽道實時模擬數據）全部**參數化、模組化**。

這意味著：**您不需要修改任何 React 前端程式碼（HTML / CSS / JavaScript），只需要在單一檔案 `src/data.ts` 中修改設定，即可秒速將這套極致狂野的風格套用在任何新產品上！**

---

## 📂 核心架構：您要帶走的所有素材與檔案

如果您要把這套風格搬到其他專案，或者在 GitHub 上複製新的儲存庫做新商品，以下是至關重要的五個核心部分：

1. **`src/data.ts` (核心控制台)**：
   * 所有商品文案、售價、規格、信用卡期數說明、第三方付款 PayUni 連結、技師評價、即時通知氣泡等，全都在這裡！
2. **`/public` 目錄 (圖片資源集)**：
   * 包含您剛放進來的四個產品大圖（`product.jpg`、`hks_demo.jpg`、`data.jpg`、`install.jpg`）。更換新產品時，只需用同名圖片覆蓋即可！
3. **`src/App.tsx` (視覺引擎頁)**：
   * 包含所有的微動畫、選單、信用卡選擇彈窗和即時模擬冷卻、北宜機油溫度震盪、倒數警示器等互動功能，它會自動抓取 `src/data.ts` 的設定。
4. **`src/index.css` (賽博風格樣式庫)**：
   * 包含經典的 EVA 斑馬警告條樣式、HUD 掃描線、霓虹發光字（`text-glow`）、傾斜按鈕（`skew-box`）與 MAGI 主機邊框發光。
5. **`src/components/CoolingChart.tsx` (互動折線圖)**：
   * 超高質感的 SVG 線性對比動態折線圖，滑鼠滑過時能在精密刻度上實時對比原廠與改裝後的防線數據。

---

## 🛠️ 如何加入「立即結帳」的第三方付款連結？

在 `src/data.ts` 檔案中，找到 **`INSTALLMENT_PLANS`**（分期付款配置陣列）：

```typescript
export const INSTALLMENT_PLANS: InstallmentPlan[] = [
  {
    id: "1",
    months: 1,
    label: "一次付清 (One-Time Payment)",
    rate: 0.0,
    description: "免手續費，快速啟動絕對領域",
    payLink: "請替換成您在 PayUni、藍新、或綠界申請的「一次付清」收款連結網址"
  },
  {
    id: "3",
    months: 3,
    label: "信用卡 3 期分期付款",
    rate: 0.029,
    description: "輕鬆入手，2.9% 輕量利息無壓力",
    payLink: "請替換成您在第三方金流後台產生的「3 期分期」收款連結網址"
  },
  // 以下類推...
];
```

### 💡 運作機制與如何更換：
1. **申請金流賬號**：前往 **PayUni (統一金流)**、**藍新金流** 或 **綠界科技** 註冊商家並通過審核。
2. **產生快速收款連結**：
   * 在您的金流商家後台建立**「快速收款連結」**或**「商品賣場」**。
   * 請依照不同的分期數（例如：一次付清、3期、6期、12期）分別建立獨立的收款連結（因為不同期數的手續費率不同）。
3. **填入 `payLink`**：將產生的網址複製，填入對應分期方案的 `payLink` 欄位中。
4. **效果**：當消費者在前台選擇了某個分期方案，並點擊最後的 **「Confirm & Launch Order（確認無誤，發送訂單）」** 時，系統就會**秒速安全跳轉進您專屬的 PayUni 行動刷卡網頁**，完成交易！

---

## 🎨 3 分鐘改裝新商品範例（以高性能機械鍵盤為例）

若您要開始做一個不同的新商品，您可以複製這個 GitHub 專案，然後直接將 `src/data.ts` 修改乾淨，例如：

```typescript
// 1. 更換本地圖片網址 (在 /public 放進同名圖片，或使用線上網址)
export const IMAGES = {
  heroBg: "/keyboard_hero.jpg",
  product: "/keyboard_detail.jpg",
  dataCurve: "/switch_latency_graph.jpg",
  installMechanic: "/lubrication_master.jpg",
};

// 2. 更改產品主要售價、庫存與細節
export const PRODUCT_DATA: Product = {
  id: "cyber-deck-keyboard",
  name: "CYBER-DECK 磁軸客製化機械鍵盤",
  subName: "Evangelion Neo-Tokyo Stage 2 Edition",
  originalPrice: 9800,
  price: 8900,
  stockLeft: 12,
  specs: [
    "CYBER-DECK 鋁合金陽極CNC框體 (EVA特仕色)",
    "佳達隆萬磁王軸 2.0 (Pre-lubed 極致潤軸)",
    "PBT 二色成型原廠高度限製鍵帽組"
  ],
  features: [
    {
      title: "0.1ms 急速超限觸發",
      description: "支援動態輸入 RT (Rapid Trigger) 機械感應，觸發鍵程精準至 0.02mm，讓您的指尖戰鬥性能大幅領先對手。",
      icon: "Gauge"
    },
    // 下略...
  ]
};

// 3. 調整警告視窗裡的硬核台詞
export const SYSTEM_CONFIG = {
  ...
  magiSection: {
    watermark: "延遲極限",
    emergencyBadge: "延遲暴走",
    emergencyDetails: "EMERGENCY: INPUT DELAY SPARK WARNING",
    quoteHeader: "你的手指跟不上畫面啊！",
    episodeTitle: "EPISODE: ZERO LAG FANTASY",
    ...
  }
};
```

只需儲存檔案並提交上傳，您的 Netlify 就會秒速自動構建完成！整個網站一瞬間就會變成新鍵盤的專屬賽博賣場，完美承襲極速、熱血、高質感的包裝風貌！

祝您生意興隆，新商品大賣！如有任何疑問随时告訴我！
