const menuButton = document.getElementById('menuButton');
const mobileNav = document.getElementById('mobileNav');
const openQuote = document.getElementById('openQuote');
const closeQuote = document.getElementById('closeQuote');
const quoteDrawer = document.getElementById('quoteDrawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');
const quoteItemsEl = document.getElementById('quoteItems');
const quoteCount = document.getElementById('quoteCount');
const sendQuote = document.getElementById('sendQuote');
const clearQuote = document.getElementById('clearQuote');
const toast = document.getElementById('toast');

let quote = JSON.parse(localStorage.getItem('alumarQuote') || '[]');

menuButton.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? '×' : '☰';
});

document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = '☰';
}));

function persist() {
  localStorage.setItem('alumarQuote', JSON.stringify(quote));
  renderQuote();
}

function renderQuote() {
  quoteCount.textContent = quote.length;
  if (!quote.length) {
    quoteItemsEl.innerHTML = '<p class="empty-state">Nenhum produto adicionado ainda.</p>';
    return;
  }
  quoteItemsEl.innerHTML = quote.map((item, index) => `
    <div class="drawer-item">
      <div><strong>${item.name}</strong><span>${item.price}</span></div>
      <button type="button" data-remove="${index}">Remover</button>
    </div>
  `).join('');
  quoteItemsEl.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      quote.splice(Number(btn.dataset.remove), 1);
      persist();
    });
  });
}

function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1700);
}

document.querySelectorAll('.add-quote').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    const item = { name: card.dataset.name, price: card.dataset.price };
    if (!quote.some(q => q.name === item.name)) {
      quote.push(item);
      persist();
      showToast();
    } else {
      openDrawer();
    }
  });
});

function openDrawer() {
  quoteDrawer.classList.add('open');
  drawerBackdrop.classList.add('open');
  quoteDrawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  quoteDrawer.classList.remove('open');
  drawerBackdrop.classList.remove('open');
  quoteDrawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

openQuote.addEventListener('click', openDrawer);
closeQuote.addEventListener('click', closeDrawer);
drawerBackdrop.addEventListener('click', closeDrawer);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

clearQuote.addEventListener('click', () => {
  quote = [];
  persist();
});

sendQuote.addEventListener('click', () => {
  if (!quote.length) {
    alert('Adicione pelo menos um produto ao orçamento.');
    return;
  }
  const lines = quote.map((item, i) => `${i + 1}. ${item.name} — oferta exibida: ${item.price}`);
  const message = `Olá Alumar! Gostaria de consultar estes itens:\n\n${lines.join('\n')}\n\nPode confirmar disponibilidade, valor atual e entrega?`;
  window.open(`https://wa.me/5521989846564?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

document.getElementById('year').textContent = new Date().getFullYear();
renderQuote();
