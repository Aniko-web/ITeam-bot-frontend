# ITeam — Mobile Legends Telegram Mini App (Frontend)

Kibersport uslubidagi zamonaviy, tezkor va moslashuvchan **ITeam** Telegram Mini App (TMA).

---

## 🎨 Imkoniyatlar va Sahifalar
* **Asosiy Sahifa (`/`):** Dinamik bannyerlar karuseli, IStars balansi, Quick Match LFG tavsiyalari
* **Mening Jamoam (`/teams/my-team`):** 5 nafar asosiy o‘yinchi, 2 nafar zaxira, MPL rasmiy logotiplari va maxfiy ovozli aloqa
* **5v5 PvP Arena (`/pvp`):** Custom 5v5 Draft Pick lobbilari va kod orqali kirish
* **Sozlamalar (`/settings`):** MLBB ID & IGN tahrirlash, dinamik fonlar (Live Particles, Deep Void, Minimal Slate, Carbon Mesh), til va xabarnomalar
* **Suzuvchi Navigatsiya:** Mobil kibersport UI uslubidagi suzuvchi qora kapsula (`BottomNav.tsx`)
* **IStars Valyutasi & Playdom:** 100 IStars = 5,000 UZS kursi bo‘yicha to‘lov modali
* **10 ta Yangi Rank Gerblari & 5 ta Lane Logolari:** Vektor va shaffof PNG formatda

---

## 🚀 O‘rnatish va Ishga Tushirish

### 1. Repository'ni klon qiling:
```bash
git clone https://github.com/Aniko-web/ITeam-bot-frontend.git frontend
cd frontend
```

### 2. Muhit sozlamalarini kiriting (.env):
```bash
cp .env.example .env
nano .env
```
Backend serveringiz manzilini kiriting:
```ini
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

### 3. Docker orqali ishga tushirish (Server 1 / VPS):
```bash
docker compose up -d --build
```

Yoki mahalliy ishlab chiqish (Development):
```bash
npm install
npm run dev
```

Production build tekshirish:
```bash
npm run build
```

---

## ☁️ Vercel yoki Cloudflare Pages ga Joylash
1. GitHub hisobingizdan `ITeam-bot-frontend` reposini Vercel'ga ulang.
2. **Environment Variables** bo‘limida:
   - `NEXT_PUBLIC_API_URL` = `https://api.yourdomain.com/api/v1`
3. **Deploy** tugmasini bosing.
