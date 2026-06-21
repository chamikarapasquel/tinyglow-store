# TinyGlow Store

A complete minimal modern ecommerce MVP for cute lamps, teddy bears, room decor, gift items, and desk accessories.

## Features

- Home page with modern hero section
- Product listing with search and category filters
- Product detail modal
- Cart with quantity update and remove
- Checkout form
- WhatsApp order submission
- Admin panel for add, edit, delete products
- Admin order list with status update
- LocalStorage persistence
- Mobile responsive design

## Run from zero

1. Install Node.js LTS.
2. Open this folder in VS Code.
3. Open terminal and run:

```bash
npm install
npm run dev
```

4. Open the local URL shown in terminal, usually:

```text
http://localhost:5173
```

## Important setup

Open `src/main.jsx` and change this line:

```js
const WHATSAPP_NUMBER = '94771234567';
```

Replace it with your real WhatsApp number in international format without `+`.

Example:

```js
const WHATSAPP_NUMBER = '9477XXXXXXX';
```

## Admin panel

Click **Admin** in the navigation.

You can:

- Add products
- Edit products
- Delete products
- Set price and sale price
- Add image URL
- Mark products as featured
- View checkout orders
- Update order status

## Brutal production warning

This is a launchable MVP, not a production backend. It uses browser LocalStorage, so data is stored only in that browser.

For a real client/shop, replace LocalStorage with:

- Node.js + Express backend
- MongoDB/PostgreSQL database
- Cloudinary image upload
- Auth-protected admin login
- PayHere/WebXPay payment gateway
- Real order email/SMS notifications
