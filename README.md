# AutoPartsShop.UI 🛒🚗  
Angular Frontend – Autóalkatrész Webshop Felhasználói Felület

## 🧾 Áttekintés

Az **AutoPartsShop.UI** projekt egy modern, reszponzív frontend felület az AutoPartsShop webáruházhoz, amely lehetővé teszi a látogatók számára az autóalkatrészek és felszerelések keresését, kosárba helyezését, rendelés leadását, valamint a felhasználói profil és rendelések kezelését.  

A rendszer Angular 16+ keretrendszert használ, `standalone components` architektúrával és REST API-k segítségével kommunikál az ASP.NET Core backenddel (Autopartsshop.API projekt).

---

## 🧰 Technológiák

- Angular 16+
- TypeScript
- Angular Router
- FormsModule, ReactiveFormsModule
- Bootstrap 
- JWT alapú hitelesítés
- Reszponzív layout 

---

## 🧩 Fő funkciók

### 🌐 Publikus oldal:
- Gépjármű modell és alkatrészkategória szerinti keresés
- Felszerelések keresése név és kategória alapján
- Kosárba helyezés és kosár tartalmának megtekintése

### 👤 Felhasználói fiók:
- Regisztráció és bejelentkezés (JWT token kezeléssel)
- Profil adatok megtekintése
- Rendeléseim lista (státuszmegjelöléssel)
- Rendelés leadása és sikeres rendelés visszaigazolás

### 🛠️ Admin oldal:
- Admin bejelentkezés
- Admin dashboard
- Járművek, modellek, alkatrészek, felszerelések és kategóriák kezelése
- Rendelések megtekintése és státusz frissítése
- Képfeltöltés termékekhez

---

## ▶️ Fejlesztői indítás

### Előfeltételek:
- Node.js (ajánlott verzió: 18+)
- Angular CLI (globálisan telepítve):  
  ```bash
  npm install -g @angular/cli
  ```

### Telepítés:
```
git clone https://github.com/sajat-felhasznalo/AutoPartsShop.UI.git
cd AutoPartsShop.UI
npm install
```

### Indítás:
```
ng serve
```

Az alkalmazás elérhető lesz a böngészőben:  
`http://localhost:4200`

---

## 🔗 Backend kapcsolat

A frontend az **AutoPartsShop.API** nevű backend API-val kommunikál.  
Az API URL-t az `environment.ts` fájlban tudod beállítani:

```ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api' // vagy a saját API címed
};
```

---

## 📌 Fő oldalak és komponensek

| Útvonal | Komponens | Leírás |
|--------|-----------|--------|
| `/alkatreszek` | `PartListComponent` | Alkatrészek listázása |
| `/kosar` | `CartComponent` | Kosár |
| `/rendeles` | `OrderComponent` | Rendelés leadása |
| `/success` | `SuccessComponent` | Rendelés visszaigazolás |
| `/bejelentkezes` | `LoginComponent` | Bejelentkezés |
| `/regisztracio` | `RegisterComponent` | Regisztráció |
| `/profil` | `ProfileComponent` | Felhasználói adatok |
| `/rendeleseim` | `UserOrdersComponent` | Rendeléseim |
| `/admin/**` | Admin komponensek | Admin funkciók (csak guarddal elérhető) |

---

## 🔐 Hitelesítés

- Bejelentkezéskor JWT token kerül elmentésre `localStorage`-ba
- Token automatikusan hozzáadódik az API hívások `Authorization` fejlécéhez
- Védett útvonalakat route guard védi (`adminGuard`)

---

## 🖼️ Képfeltöltés

Az admin termékrögzítő felület támogatja a képek kiválasztását és feltöltését a backend szerverre, amely az elérési útvonalat menti az adatbázisba.

---

## 📄 Licenc

Ez a projekt tanulási és demonstrációs célból készült.  
Szabadon használható, módosítható és kiterjeszthető egyéni célra.

---

