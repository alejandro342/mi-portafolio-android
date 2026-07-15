import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBQ3_l4mgXQCsDB57CycWc85BzcJpwzaMU",
  authDomain: "myportafolio-c95ce.firebaseapp.com",
  projectId: "myportafolio-c95ce",
  storageBucket: "myportafolio-c95ce.firebasestorage.app",
  messagingSenderId: "287998507502",
  appId: "1:287998507502:web:7204a1e64747f52d0676ff"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const addProjectForm = document.getElementById('add-project-form');
const projectMsg = document.getElementById('project-msg');
const logoutBtn = document.getElementById('logout-btn');

// Observador de estado de sesión
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
    } else {
        loginSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
    }
});

// Lógica de Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const pass = document.getElementById('admin-password').value;
    loginError.innerText = '';
    
    signInWithEmailAndPassword(auth, email, pass)
        .catch(err => {
            loginError.innerText = "Error: Credenciales incorrectas o usuario no registrado.";
            console.error(err);
        });
});

// Lógica de Logout
logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// Añadir Proyecto a Firestore
addProjectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    projectMsg.innerText = "Guardando...";
    projectMsg.className = "success-msg";
    
    const title = document.getElementById('proj-title').value;
    const desc = document.getElementById('proj-desc').value;
    const tech = document.getElementById('proj-tech').value;
    const img = document.getElementById('proj-img').value;
    const link = document.getElementById('proj-link').value;
    
    try {
        await addDoc(collection(db, "projects"), {
            title: title,
            description: desc,
            technologies: tech,
            imageOrColor: img,
            link: link,
            createdAt: serverTimestamp()
        });
        projectMsg.innerText = "¡Proyecto guardado exitosamente y publicado!";
        addProjectForm.reset();
        setTimeout(() => { projectMsg.innerText = ''; }, 3500);
    } catch (err) {
        console.error("Error al guardar: ", err);
        projectMsg.innerText = "Error al guardar. Verifica que las Reglas de Firestore permitan escritura.";
        projectMsg.className = "error-msg";
    }
});
