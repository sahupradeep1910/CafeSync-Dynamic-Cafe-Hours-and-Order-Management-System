const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const hours = [
  { day: 'Sunday',    open: '08:00', close: '14:00', note: 'Slow mornings only' },
  { day: 'Monday',    open: '06:30', close: '18:00', note: null },
  { day: 'Tuesday',   open: '06:30', close: '18:00', note: null },
  { day: 'Wednesday', open: '06:30', close: '20:00', note: 'Cupping night at 6 PM' },
  { day: 'Thursday',  open: '06:30', close: '18:00', note: null },
  { day: 'Friday',    open: '06:30', close: '20:00', note: 'Live pour-overs at 5 PM' },
  { day: 'Saturday',  open: '07:00', close: '16:00', note: 'Farmers market pop-up' },
];

const menu = {
  espresso: [
    { name: 'Espresso',        price: '3.50', desc: 'Double shot, 18g in / 36g out, 28 sec pull' },
    { name: 'Cortado',         price: '4.00', desc: 'Equal parts espresso & steamed milk' },
    { name: 'Flat White',      price: '4.75', desc: 'Ristretto base, silky microfoam, 5oz' },
    { name: 'Cappuccino',      price: '4.75', desc: 'Classic third-thirds, dry or wet' },
    { name: 'Latte',           price: '5.25', desc: '8oz, single origin espresso, whole or oat' },
    { name: 'Ember Mocha',     price: '5.75', desc: 'Dark cacao, espresso, smoked caramel' },
  ],
  filter: [
    { name: 'Pour Over',       price: '6.00', desc: 'Single origin, V60, brewed to order (~6 min)' },
    { name: 'Cold Brew',       price: '5.50', desc: '20hr steep, served over large-format ice' },
    { name: 'Batch Brew',      price: '3.75', desc: 'House blend, refreshed every 45 minutes' },
    { name: 'AeroPress',       price: '5.50', desc: 'Inverted method, clean & full-bodied' },
  ],
  food: [
    { name: 'Cardamom Knot',   price: '4.00', desc: 'Laminated dough, house-ground cardamom' },
    { name: 'Almond Croissant',price: '5.00', desc: 'Twice-baked, frangipane, toasted flakes' },
    { name: 'Grain Toast',     price: '4.50', desc: 'Seeded sourdough, cultured butter, honey' },
    { name: 'Seasonal Tart',   price: '5.50', desc: 'Ask barista — changes weekly' },
  ],
};

function getOpenStatus(todayEntry) {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = todayEntry.open.split(':').map(Number);
  const [ch, cm] = todayEntry.close.split(':').map(Number);
  const op = oh * 60 + om, cl = ch * 60 + cm;
  if (cur < op) {
    const d = op - cur;
    return { open: false, label: 'Opens soon', detail: `Opens in ${Math.floor(d/60)>0?Math.floor(d/60)+'h ':''}${d%60}m` };
  }
  if (cur >= op && cur < cl) {
    const d = cl - cur;
    return { open: true, label: 'Open now', detail: `Closes in ${Math.floor(d/60)>0?Math.floor(d/60)+'h ':''}${d%60}m` };
  }
  return { open: false, label: 'Closed', detail: 'Opens tomorrow' };
}

function timeNow() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

app.get('/', (req, res) => {
  const today = new Date().getDay();
  res.render('hours', { hours, today, status: getOpenStatus(hours[today]), generatedAt: timeNow(), page: 'hours' });
});

app.get('/hours', (req, res) => {
  const today = new Date().getDay();
  res.render('hours', { hours, today, status: getOpenStatus(hours[today]), generatedAt: timeNow(), page: 'hours' });
});

app.get('/menu', (req, res) => {
  res.render('menu', { menu, page: 'menu' });
});

app.get('/our-story', (req, res) => {
  res.render('our-story', { page: 'story' });
});

app.get('/order', (req, res) => {
  res.render('order', { menu, page: 'order', submitted: false });
});

app.post('/order', (req, res) => {
  res.render('order', { menu, page: 'order', submitted: true, orderData: req.body });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Roastery running → http://localhost:${PORT}`));
