# ShadowPerps — Private Perpetuals on Solana

🔒 Trade perpetuals without exposing your position.

ShadowPerps is a privacy-preserving perpetual trading application built on Solana using Arcium’s confidential compute network. It enables traders to open and manage leveraged positions without revealing sensitive data like position size, leverage, or liquidation thresholds.

🌐 Live App: https://shadowperps-vert.vercel.app/  
💻 GitHub: https://github.com/WorldsBestSoftwareDeveloper/shadowperps  

---

## 🚀 Overview

Traditional perpetual exchanges expose trader intent through public positions, enabling:

- Targeted liquidations  
- MEV exploitation  
- Copy trading abuse  

ShadowPerps solves this by ensuring all sensitive trading logic is computed privately using Arcium.

Only final outcomes (such as realized PnL) are revealed.

---

## 🔐 What is Private vs Public

| Component              | Visibility |
|----------------------|-----------|
| Position size        | Private   |
| Entry price          | Private   |
| Leverage             | Private   |
| Liquidation logic    | Private   |
| Margin calculations  | Private   |
| Final PnL            | Public    |

---

## 🧠 How Arcium is Used

ShadowPerps leverages Arcium confidential compute to:

- Encrypt trade inputs client-side  
- Perform private position validation  
- Compute liquidation thresholds confidentially  
- Calculate PnL without exposing raw data  

Without Arcium, all of this data would be publicly visible and exploitable.

---

## ⚙️ Tech Stack

- Next.js  
- React  
- Tailwind CSS  
- Solana Wallet Adapter  
- Arcium Confidential Compute  
- Anchor Framework  

---

## 📱 Features

- 🔒 Private position creation  
- 🧠 Confidential liquidation checks  
- 📊 Private PnL computation  
- 🔗 Solana wallet integration  
- 📱 Mobile-first UI  

---

## 🖼 Screenshots


![App Screenshot](./public/screenshot1.png)
![Trading Interface](./public/screenshot2.png)

---

## 🎬 Demo Video

__

---

## 🧪 Running Locally

```bash
git clone https://github.com/WorldsBestSoftwareDeveloper/shadowperps.git
cd shadowperps
yarn install
yarn dev
