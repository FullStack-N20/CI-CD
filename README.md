# 📘 Konspekt

## 🌐 Servers va Cloud Services
- **Server** — bu foydalanuvchi so‘rovlarini qabul qiluvchi va qayta ishlovchi dasturiy/hardver qurilma.
- **Cloud services** — serverlarni o‘zingiz boshqarmasdan, xizmat sifatida ijaraga olish imkoniyati.
- Misollar:
  - **IaaS** (Infrastructure as a Service) → AWS EC2, Azure VM
  - **PaaS** (Platform as a Service) → Heroku, Railway
  - **SaaS** (Software as a Service) → Gmail, Dropbox
- Afzalliklari:
  - Tez sozlash
  - Moslashuvchan (scalability)
  - Kam xarajat boshlang‘ich bosqichda

---

## 🧪 Testing Pyramid
- Testlashda xarajat va tezlikni balanslash modeli:
  1. **Unit tests** (asos, eng ko‘p bo‘lishi kerak)
     - Biror kichik funksiyani test qiladi
     - Tez ishlaydi
  2. **Integration tests**
     - Modullar qanday ishlashini tekshiradi
     - Sekinroq, lekin muhim
  3. **E2E (End-to-End tests)**
     - Butun ilova foydalanuvchi nuqtayi nazaridan test qilinadi
     - Eng sekin va qimmat

---

## ⚙️ Jest Operators
- **`expect(value)`** — qiymatni test qilish uchun ishlatiladi.
- Asosiy matcherlar:
  - `toBe(value)` — qat’iy tenglik
  - `toEqual(object)` — obyekt qiymatini tekshirish
  - `toBeNull()`, `toBeUndefined()`, `toBeTruthy()`, `toBeFalsy()`
  - `toContain(item)` — massiv/substring tekshirish
  - `toThrow()` — xato kutish
- Qo‘shimcha:
  - `.not` — inkor qilish (`expect(x).not.toBe(y)`)

---

## 🎭 Mock va Spy
- **Mock** — funksiyaning “soxta” versiyasini yaratish, haqiqiy ishni bajarmaydi, faqat chaqirilishini kuzatadi.
  - `jest.fn()`
  - `jest.mock('./module')`
- **Spy** — haqiqiy funksiyani kuzatish, chaqiruvlarini va parametrlarini tekshirish.
  - `jest.spyOn(obj, 'method')`

---

## 💰 Exp vs Cheap (Expensive vs Cheap Tests)
- **Cheap tests** (Arzon):
  - Unit testlar
  - Tez ishlaydi
  - Ko‘p yoziladi
- **Expensive tests** (Qimmat):
  - Integration va E2E testlar
  - Ko‘proq vaqt va resurs talab qiladi
  - Kamroq yoziladi, lekin juda muhim

---
