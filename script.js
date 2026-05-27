import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    GithubAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- CONFIGURAÇÃO FIREBASE ---
const firebaseConfig = {
    apiKey: "CHAVE_REMOVIDA    ",
    authDomain: "register-and-login---dark.firebaseapp.com",
    projectId: "register-and-login---dark",
    storageBucket: "register-and-login---dark.firebasestorage.app",
    messagingSenderId: "926259655882",
    appId: "1:926259655882:web:b86da9cc107da8a85e3033",
    measurementId: "G-HP6SG43BCM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- 1. ANIMAÇÃO DE REVELAR AO ROLAR ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- 2. LÓGICA DE LOGIN SOCIAL (GOOGLE / GITHUB) ---
const googleBtn = document.getElementById('googleBtn');
const githubBtn = document.getElementById('githubBtn');
let isAuthenticating = false; 

if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        if (isAuthenticating) return;
        isAuthenticating = true;
        try {
            const res = await signInWithPopup(auth, new GoogleAuthProvider());
            localStorage.setItem('user2M', JSON.stringify({ name: res.user.displayName, email: res.user.email }));
            window.location.href = "index.html";
        } catch (e) {
            if (e.code !== 'auth/cancelled-popup-request') alert("Erro Google: " + e.message);
        } finally { isAuthenticating = false; }
    });
}

if (githubBtn) {
    githubBtn.addEventListener('click', async () => {
        if (isAuthenticating) return;
        isAuthenticating = true;
        try {
            const res = await signInWithPopup(auth, new GithubAuthProvider());
            localStorage.setItem('user2M', JSON.stringify({ name: res.user.displayName || "User", email: res.user.email }));
            window.location.href = "index.html";
        } catch (e) {
            if (e.code !== 'auth/cancelled-popup-request') alert("Erro GitHub: " + e.message);
        } finally { isAuthenticating = false; }
    });
}

// --- LÓGICA DE CADASTRO (EMAIL/SENHA) ---
const createBtn = document.getElementById('createBtn');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');

if (createBtn) {
    createBtn.addEventListener('click', async () => {
        if (!createBtn.classList.contains('ready')) return;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
            localStorage.setItem('user2M', JSON.stringify({
                name: emailInput.value.split('@')[0],
                email: userCredential.user.email
            }));
            alert("Conta criada com sucesso!");
            window.location.href = "index.html";
        } catch (error) {
            alert("Erro ao cadastrar: " + error.message);
        }
    });
}

// --- LÓGICA DE LOGIN (EMAIL/SENHA) ---
const loginBtn = document.getElementById('loginBtn');
const emailLogin = document.getElementById('emailLogin');
const passwordLogin = document.getElementById('passwordLogin');

if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        if (!loginBtn.classList.contains('ready')) return;

        const email = emailLogin.value.trim();
        const password = passwordLogin.value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem('user2M', JSON.stringify({
                name: email.split('@')[0],
                email: userCredential.user.email
            }));
            alert("Login realizado com sucesso!");
            window.location.href = "index.html";
        } catch (error) {
            console.error("Erro detectado:", error.code);
            if (error.code === 'auth/invalid-credential') {
                alert("E-mail ou senha incorretos. (Nota: Se você criou a conta pelo Google, deve logar pelo botão do Google).");
            } else {
                alert("Erro: " + error.message);
            }
        }
    });
}

// --- 3. LÓGICA DO "OLHO" E VALIDAÇÃO DE INPUTS ---
document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');
    const currentPassInput = document.getElementById('passwordInput') || document.getElementById('passwordLogin');

    if (togglePassword && currentPassInput && eyeIcon) {
        togglePassword.addEventListener('click', () => {
            const isPassword = currentPassInput.type === 'password';
            currentPassInput.type = isPassword ? 'text' : 'password';
            if (isPassword) {
                togglePassword.classList.replace('text-zinc-600', 'text-white');
                eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
            } else {
                togglePassword.classList.replace('text-white', 'text-zinc-600');
                eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
            }
        });
    }

    if (emailInput && passwordInput && createBtn) {
        const checkInputs = () => {
            if (emailInput.value.includes('@') && passwordInput.value.length >= 6) {
                createBtn.classList.add('ready');
            } else {
                createBtn.classList.remove('ready');
            }
        };
        emailInput.addEventListener('input', checkInputs);
        passwordInput.addEventListener('input', checkInputs);
    }

    if (emailLogin && passwordLogin && loginBtn) {
        const checkLoginInputs = () => {
            if (emailLogin.value.includes('@') && passwordLogin.value.length >= 6) {
                loginBtn.classList.add('ready');
            } else {
                loginBtn.classList.remove('ready');
            }
        };
        emailLogin.addEventListener('input', checkLoginInputs);
        passwordLogin.addEventListener('input', checkLoginInputs);
    }
    
    // Executa a verificação de interface ao carregar
    checkAuthUI();
});

// --- 4. INTERFACE DE USUÁRIO (PERFIL / SAIR) ---
function checkAuthUI() {
    const authContainer = document.querySelector('.header-auth');
    const user = JSON.parse(localStorage.getItem('user2M'));

    if (user && authContainer) {
        authContainer.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="color: #888; font-size: 14px;">Olá, <b style="color: #fff;">${user.name}</b></span>
                <button onclick="logoutUser()" class="login-btn" style="padding: 5px 15px; font-size: 12px; border-color: #333;">Sair</button>
            </div>
        `;
    }
}

// Tornando a função global para o onclick
window.logoutUser = () => {
    localStorage.removeItem('user2M');
    window.location.href = "index.html";
};

// --- 5. SCROLL SUAVE ---
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        }
    });
});