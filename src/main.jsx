import React, { useMemo, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, ShoppingBag, Menu, X, Plus, Minus, Trash2, Star, Heart, Edit3, Save, Package, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import './styles.css';

const STORAGE_PRODUCTS = 'tinyglow_products_v1';
const STORAGE_CART = 'tinyglow_cart_v1';
const STORAGE_ORDERS = 'tinyglow_orders_v1';
const WHATSAPP_NUMBER = '94771234567'; // Replace with your WhatsApp number, format: country code + number

const seedProducts = [
  { id: 'p1', name: 'Mini Moon Lamp', category: 'Cute Lamps', price: 2450, salePrice: 2190, stock: 12, featured: true, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=900&auto=format&fit=crop', description: 'A soft warm lamp for bedrooms, desks, and cozy night corners.', specs: 'Warm LED light • USB powered • Soft-touch finish' },
  { id: 'p2', name: 'Cloud Bedside Lamp', category: 'Cute Lamps', price: 3250, salePrice: 2990, stock: 8, featured: true, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=900&auto=format&fit=crop', description: 'A dreamy lamp that makes your room feel calm and aesthetic.', specs: 'Soft glow • Lightweight • Perfect for gifts' },
  { id: 'p3', name: 'Soft Teddy Bear', category: 'Teddy Bears', price: 1950, salePrice: 1750, stock: 20, featured: true, image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?q=80&w=900&auto=format&fit=crop', description: 'A cute soft teddy for birthdays, anniversaries, and surprise gifts.', specs: 'Premium plush • Medium size • Gift-ready' },
  { id: 'p4', name: 'Cozy Desk Plant', category: 'Room Decor', price: 990, salePrice: null, stock: 25, featured: false, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=900&auto=format&fit=crop', description: 'A tiny decor piece to make your desk look cleaner and happier.', specs: 'Low maintenance • Minimal pot • Desk-friendly' },
  { id: 'p5', name: 'Pastel Gift Box', category: 'Gift Items', price: 3690, salePrice: 3290, stock: 7, featured: true, image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=900&auto=format&fit=crop', description: 'A ready-made cute gift bundle for someone special.', specs: 'Includes mini plush • card • decor item' },
  { id: 'p6', name: 'Aesthetic Desk Tray', category: 'Desk Accessories', price: 1490, salePrice: null, stock: 15, featured: false, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900&auto=format&fit=crop', description: 'A clean organizer tray for daily desk essentials.', specs: 'Minimal design • Lightweight • Easy to clean' },
  { id: 'p7', name: 'Heart Cushion', category: 'Room Decor', price: 1690, salePrice: 1450, stock: 14, featured: false, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=900&auto=format&fit=crop', description: 'A soft cushion that adds a warm cute touch to your room.', specs: 'Soft fabric • Washable cover • Gift suitable' },
  { id: 'p8', name: 'Tiny Desk Lamp', category: 'Cute Lamps', price: 1890, salePrice: null, stock: 11, featured: false, image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=900&auto=format&fit=crop', description: 'A small modern lamp for study tables and side tables.', specs: 'Compact • Warm white • Modern shape' }
];

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function money(value) { return `Rs. ${Number(value || 0).toLocaleString('en-LK')}`; }
function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

function Header({ page, setPage, cartCount }) {
  const [open, setOpen] = useState(false);
  const links = [ ['home','Home'], ['shop','Shop'], ['about','About'], ['contact','Contact'], ['admin','Admin'] ];
  const go = (p) => { setPage(p); setOpen(false); window.scrollTo(0,0); };
  return <header className="header">
    <div className="container nav">
      <button className="brand" onClick={() => go('home')}><span className="logo">✦</span><span>TinyGlow</span></button>
      <nav className="desktop-nav">{links.map(([id,label]) => <button key={id} className={page===id?'active':''} onClick={() => go(id)}>{label}</button>)}</nav>
      <button className="cart-btn" onClick={() => go('cart')}><ShoppingBag size={20}/><span>{cartCount}</span></button>
      <button className="menu-btn" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    </div>
    {open && <div className="mobile-nav">{links.map(([id,label]) => <button key={id} onClick={() => go(id)}>{label}</button>)}<button onClick={() => go('cart')}>Cart ({cartCount})</button></div>}
  </header>
}

function ProductCard({ product, addToCart, openProduct }) {
  const price = product.salePrice || product.price;
  return <article className="product-card">
    <button className="image-btn" onClick={() => openProduct(product)}><img src={product.image} alt={product.name}/></button>
    <div className="product-info">
      <p className="category">{product.category}</p>
      <h3>{product.name}</h3>
      <p className="desc">{product.description}</p>
      <div className="price-row"><strong>{money(price)}</strong>{product.salePrice && <span>{money(product.price)}</span>}</div>
      <div className="card-actions"><button onClick={() => openProduct(product)} className="secondary">View</button><button onClick={() => addToCart(product.id)}>Add to cart</button></div>
    </div>
  </article>
}

function Home({ products, setPage, addToCart, openProduct }) {
  const featured = products.filter(p => p.featured).slice(0,4);
  return <main>
    <section className="hero container">
      <div className="hero-copy">
        <span className="eyebrow"><Sparkles size={16}/> Cute gifts & cozy decor</span>
        <h1>Cute things for cozy spaces.</h1>
        <p>Shop soft lamps, teddy bears, aesthetic desk items, and small gifts that make rooms feel warmer and more personal.</p>
        <div className="hero-actions"><button onClick={() => setPage('shop')}>Shop collection</button><button className="ghost" onClick={() => setPage('about')}>Our vibe</button></div>
      </div>
      <div className="hero-card"><img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop" alt="Cozy room decor"/><div className="floating-card"><Heart size={18}/> Soft, simple, gift-ready</div></div>
    </section>
    <section className="container benefits">
      <div><Truck/><h3>Islandwide delivery</h3><p>Start with manual delivery handling, then automate later.</p></div>
      <div><ShieldCheck/><h3>Trusted checkout</h3><p>COD and bank transfer first. PayHere can be added later.</p></div>
      <div><Package/><h3>Gift-ready items</h3><p>Bundle products into birthday and couple gift packs.</p></div>
    </section>
    <section className="container section-head"><div><p className="eyebrow-text">Featured picks</p><h2>Best cute products</h2></div><button className="ghost" onClick={() => setPage('shop')}>View all</button></section>
    <section className="container grid">{featured.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} openProduct={openProduct}/>)}</section>
  </main>
}

function Shop({ products, addToCart, openProduct }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = products.filter(p => (category === 'All' || p.category === category) && `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query.toLowerCase()));
  return <main className="container page">
    <div className="shop-top"><div><p className="eyebrow-text">Shop</p><h1>Minimal cute collection</h1></div><div className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search lamps, teddy bears..."/></div></div>
    <div className="filters">{categories.map(c => <button key={c} className={category===c?'selected':''} onClick={() => setCategory(c)}>{c}</button>)}</div>
    <section className="grid">{filtered.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} openProduct={openProduct}/>)}</section>
    {filtered.length === 0 && <p className="empty">No products found.</p>}
  </main>
}

function ProductModal({ product, close, addToCart }) {
  if (!product) return null;
  const price = product.salePrice || product.price;
  return <div className="modal-backdrop" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={close}><X/></button><img src={product.image} alt={product.name}/><div><p className="category">{product.category}</p><h2>{product.name}</h2><div className="stars"><Star fill="currentColor" size={17}/><Star fill="currentColor" size={17}/><Star fill="currentColor" size={17}/><Star fill="currentColor" size={17}/><Star size={17}/> Gift-friendly pick</div><p>{product.description}</p><p className="specs">{product.specs}</p><div className="price-row big"><strong>{money(price)}</strong>{product.salePrice && <span>{money(product.price)}</span>}</div><p className="stock">Stock: {product.stock}</p><button onClick={() => { addToCart(product.id); close(); }}>Add to cart</button></div></div></div>
}

function Cart({ products, cart, setCart, setPage }) {
  const items = cart.map(item => ({...item, product: products.find(p => p.id === item.id)})).filter(i => i.product);
  const total = items.reduce((sum, i) => sum + (i.product.salePrice || i.product.price) * i.qty, 0);
  const changeQty = (id, delta) => setCart(cart.map(i => i.id === id ? {...i, qty: Math.max(1, i.qty + delta)} : i));
  const remove = id => setCart(cart.filter(i => i.id !== id));
  return <main className="container page cart-page"><div><p className="eyebrow-text">Cart</p><h1>Your cute picks</h1></div>{items.length === 0 ? <div className="empty-box"><h2>Your cart is empty</h2><p>Add products from the shop before checkout.</p><button onClick={() => setPage('shop')}>Go to shop</button></div> : <div className="cart-layout"><section className="cart-items">{items.map(({product, qty}) => <div className="cart-item" key={product.id}><img src={product.image} alt={product.name}/><div><h3>{product.name}</h3><p>{money(product.salePrice || product.price)}</p><div className="qty"><button onClick={() => changeQty(product.id,-1)}><Minus size={15}/></button><span>{qty}</span><button onClick={() => changeQty(product.id,1)}><Plus size={15}/></button></div></div><button className="icon-danger" onClick={() => remove(product.id)}><Trash2/></button></div>)}</section><aside className="summary"><h2>Order summary</h2><div className="summary-row"><span>Subtotal</span><strong>{money(total)}</strong></div><div className="summary-row"><span>Delivery</span><span>Confirm manually</span></div><button onClick={() => setPage('checkout')}>Checkout</button><button className="ghost full" onClick={() => setPage('shop')}>Continue shopping</button></aside></div>}</main>
}

function Checkout({ products, cart, setCart, setPage, orders, setOrders }) {
  const [form, setForm] = useState({name:'', phone:'', address:'', city:'', payment:'Cash on Delivery', note:''});
  const items = cart.map(item => ({...item, product: products.find(p => p.id === item.id)})).filter(i => i.product);
  const total = items.reduce((sum, i) => sum + (i.product.salePrice || i.product.price) * i.qty, 0);
  const submit = (e) => {
    e.preventDefault();
    if (!items.length) return;
    const order = { id: uid(), createdAt: new Date().toLocaleString(), customer: form, items: items.map(i => ({ id:i.product.id, name:i.product.name, qty:i.qty, price:i.product.salePrice || i.product.price })), total, status:'New' };
    setOrders([order, ...orders]);
    setCart([]);
    const lines = order.items.map(i => `- ${i.name} x ${i.qty} = ${money(i.price*i.qty)}`).join('%0A');
    const msg = `Hi TinyGlow, I want to place this order:%0A${lines}%0A%0ATotal: ${money(total)}%0AName: ${form.name}%0APhone: ${form.phone}%0AAddress: ${form.address}, ${form.city}%0APayment: ${form.payment}%0ANote: ${form.note}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    setPage('home');
  };
  return <main className="container page"><p className="eyebrow-text">Checkout</p><h1>Complete your order</h1><form className="checkout" onSubmit={submit}><section className="form-card"><label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Phone<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>Address<textarea required value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></label><label>City<input required value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/></label><label>Payment method<select value={form.payment} onChange={e=>setForm({...form,payment:e.target.value})}><option>Cash on Delivery</option><option>Bank Transfer</option></select></label><label>Order note<textarea value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/></label></section><aside className="summary"><h2>Order</h2>{items.map(i => <div className="mini-row" key={i.product.id}><span>{i.product.name} × {i.qty}</span><strong>{money((i.product.salePrice || i.product.price)*i.qty)}</strong></div>)}<div className="summary-row total"><span>Total</span><strong>{money(total)}</strong></div><button disabled={!items.length}>Place order on WhatsApp</button></aside></form></main>
}

function About() { return <main className="container page narrow"><p className="eyebrow-text">About</p><h1>Small products. Warm rooms. Better gifts.</h1><p>TinyGlow is a minimal modern gift and decor store for people who like cute, cozy, and aesthetic things. The focus is simple: soft lighting, plush gifts, room decor, and desk items that feel personal without looking messy.</p><p>Brutal business truth: the brand wins only if the product photos, packaging, and delivery trust are strong. The website gives you the structure, but your product selection and content will decide sales.</p></main> }
function Contact() { return <main className="container page narrow"><p className="eyebrow-text">Contact</p><h1>Talk to TinyGlow</h1><div className="contact-card"><p><strong>WhatsApp:</strong> +94 77 123 4567</p><p><strong>Email:</strong> hello@tinyglow.lk</p><p><strong>Instagram:</strong> @tinyglow.lk</p><p><strong>Delivery:</strong> Sri Lanka islandwide, confirmed manually for the MVP.</p></div></main> }

function Admin({ products, setProducts, orders, setOrders }) {
  const empty = { name:'', category:'Cute Lamps', price:'', salePrice:'', stock:'', featured:false, image:'', description:'', specs:'' };
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const submit = e => { e.preventDefault(); const product = {...form, id: editing || uid(), price:Number(form.price), salePrice: form.salePrice ? Number(form.salePrice) : null, stock:Number(form.stock), featured:Boolean(form.featured), image: form.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=900&auto=format&fit=crop'}; setProducts(editing ? products.map(p => p.id===editing ? product : p) : [product, ...products]); setForm(empty); setEditing(null); };
  const edit = p => { setEditing(p.id); setForm({...p}); window.scrollTo(0,0); };
  const del = id => setProducts(products.filter(p => p.id !== id));
  return <main className="container page admin"><p className="eyebrow-text">Admin</p><h1>Product management</h1><form className="admin-form" onSubmit={submit}><input placeholder="Product name" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Cute Lamps</option><option>Teddy Bears</option><option>Room Decor</option><option>Gift Items</option><option>Desk Accessories</option></select><input placeholder="Price" type="number" required value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/><input placeholder="Sale price optional" type="number" value={form.salePrice || ''} onChange={e=>setForm({...form,salePrice:e.target.value})}/><input placeholder="Stock" type="number" required value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/><input placeholder="Image URL" value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/><textarea placeholder="Description" required value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><textarea placeholder="Specs" value={form.specs} onChange={e=>setForm({...form,specs:e.target.value})}/><label className="check"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})}/> Featured product</label><button><Save size={18}/>{editing ? 'Update product' : 'Add product'}</button>{editing && <button type="button" className="ghost" onClick={()=>{setEditing(null); setForm(empty)}}>Cancel edit</button>}</form><h2>Products</h2><div className="admin-list">{products.map(p => <div className="admin-row" key={p.id}><img src={p.image}/><div><strong>{p.name}</strong><p>{p.category} • {money(p.salePrice || p.price)} • Stock {p.stock}</p></div><button className="secondary" onClick={() => edit(p)}><Edit3 size={16}/> Edit</button><button className="danger" onClick={() => del(p.id)}><Trash2 size={16}/> Delete</button></div>)}</div><h2>Orders</h2><div className="admin-list">{orders.length === 0 ? <p className="empty">No orders yet.</p> : orders.map(o => <div className="order" key={o.id}><strong>{o.customer.name} — {money(o.total)}</strong><p>{o.createdAt} • {o.customer.phone} • {o.customer.city}</p><p>{o.items.map(i => `${i.name} x${i.qty}`).join(', ')}</p><select value={o.status} onChange={e=>setOrders(orders.map(x => x.id===o.id?{...x,status:e.target.value}:x))}><option>New</option><option>Confirmed</option><option>Packed</option><option>Delivered</option><option>Cancelled</option></select></div>)}</div></main>
}

function App() {
  const [page, setPage] = useState('home');
  const [products, setProducts] = useState(() => load(STORAGE_PRODUCTS, seedProducts));
  const [cart, setCart] = useState(() => load(STORAGE_CART, []));
  const [orders, setOrders] = useState(() => load(STORAGE_ORDERS, []));
  const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => save(STORAGE_PRODUCTS, products), [products]);
  useEffect(() => save(STORAGE_CART, cart), [cart]);
  useEffect(() => save(STORAGE_ORDERS, orders), [orders]);
  const cartCount = useMemo(() => cart.reduce((s,i)=>s+i.qty,0), [cart]);
  const addToCart = id => setCart(prev => { const found = prev.find(i => i.id === id); return found ? prev.map(i => i.id===id?{...i, qty:i.qty+1}:i) : [...prev, {id, qty:1}]; });
  const props = { products, setProducts, cart, setCart, orders, setOrders, setPage, addToCart, openProduct:setSelectedProduct };
  return <><Header page={page} setPage={setPage} cartCount={cartCount}/>{page==='home' && <Home {...props}/>} {page==='shop' && <Shop {...props}/>} {page==='cart' && <Cart {...props}/>} {page==='checkout' && <Checkout {...props}/>} {page==='about' && <About/>} {page==='contact' && <Contact/>} {page==='admin' && <Admin {...props}/>}<ProductModal product={selectedProduct} close={()=>setSelectedProduct(null)} addToCart={addToCart}/><footer><div className="container footer"><strong>TinyGlow</strong><span>Minimal cute gifts & cozy decor.</span></div></footer></>;
}

createRoot(document.getElementById('root')).render(<App />);
