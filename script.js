// --- 1. ANIMAÇÃO DE REVELAR AO ROLAR ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- 2. LÓGICA DE AUTENTICAÇÃO (LocalStorage) ---
let currentUser = JSON.parse(localStorage.getItem('user2M')) || null;

function checkAuth() {
    const authNav = document.getElementById('auth-nav');
    const userNav = document.getElementById('user-nav');
    const userNameDisplay = document.getElementById('user-name-display');

    if (currentUser) {
        authNav.classList.add('hidden');
        userNav.classList.remove('hidden');
        userNameDisplay.innerText = currentUser.name.split(' ')[0];
    } else {
        authNav.classList.remove('hidden');
        userNav.classList.add('hidden');
    }
}

function register() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;

    if (name && email) {
        currentUser = { name, email, products: [] };
        localStorage.setItem('user2M', JSON.stringify(currentUser));
        closeModal('registerModal');
        checkAuth();
        alert('Conta criada com sucesso!');
    }
}

function login() {
    const email = document.getElementById('user-email').value;
    if (email) {
        // Simulação de login
        currentUser = JSON.parse(localStorage.getItem('user2M')) || { name: 'Cliente Premium', email: email, products: [] };
        localStorage.setItem('user2M', JSON.stringify(currentUser));
        closeModal('loginModal');
        checkAuth();
    }
}

function logout() {
    localStorage.removeItem('user2M');
    location.reload();
}

// --- 3. SISTEMA DE COMPRA ---
function buyProduct(productName) {
    if (!currentUser) {
        openModal('loginModal');
        return;
    }
    
    currentUser.products.push(productName);
    localStorage.setItem('user2M', JSON.stringify(currentUser));
    alert(`Obrigado! ${productName} foi adicionado à sua conta.`);
    openDashboard();
}

function openDashboard() {
    document.getElementById('dash-name').innerText = currentUser.name;
    const itemsDiv = document.getElementById('purchased-items');
    
    if (currentUser.products.length > 0) {
        itemsDiv.innerHTML = currentUser.products.map(p => `<div style="margin-bottom:8px; color:#fff;">• ${p}</div>`).join('');
    }
    openModal('dashboardModal');
}

// --- 4. MODAIS ---
function openModal(id) { document.getElementById(id).style.display = 'block'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function switchModal(c, o) { closeModal(c); openModal(o); }

window.onclick = (e) => { if (e.target.className === 'modal') e.target.style.display = 'none'; }

// --- 5. VALIDAÇÃO DO FORMULÁRIO DE CONTATO ---
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('input', () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const msg = document.getElementById('message').value;

        if (name.length > 2 && email.includes('@') && msg.length > 5) {
            submitBtn.classList.add('ready');
        } else {
            submitBtn.classList.remove('ready');
        }
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('form-content').style.display = 'none';
        document.getElementById('success-message').style.display = 'block';
    });
}

// --- SCROLL SUAVE PROFISSIONAL ---
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Ignora links que são apenas "#" ou vazios
        if (this.getAttribute('href') === '#') return;

        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Calcula a posição final descontando a altura do header
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Se for mobile, você pode fechar o menu aqui (caso tenha um menu hambúrguer)
            // closeMobileMenu(); 
        }
    });
});


// Inicializar
checkAuth();