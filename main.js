const firebaseConfig = {
  apiKey: "AIzaSyBQ3_l4mgXQCsDB57CycWc85BzcJpwzaMU",
  authDomain: "myportafolio-c95ce.firebaseapp.com",
  projectId: "myportafolio-c95ce",
  storageBucket: "myportafolio-c95ce.firebasestorage.app",
  messagingSenderId: "287998507502",
  appId: "1:287998507502:web:7204a1e64747f52d0676ff"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Carga dinámica de proyectos
async function loadProjects() {
    const container = document.getElementById('dynamic-projects-container');
    if (!container) return;
    
    try {
        const querySnapshot = await db.collection("projects").orderBy("createdAt", "desc").get();
        
        container.innerHTML = ''; // Limpiar mensaje de carga
        
        if (querySnapshot.empty) {
            container.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">No hay proyectos publicados aún.</p>';
            return;
        }
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const techList = data.technologies.split(',').map(t => `<span>${t.trim()}</span>`).join('');
            
            const isColor = data.imageOrColor.trim().startsWith('#');
            const styleAttribute = isColor 
                ? `style="background: ${data.imageOrColor};"` 
                : `style="background-image: url('${data.imageOrColor}'); background-size: cover; background-position: center;"`;
            
            const cardHTML = `
                <div class="project-card glass fade-in">
                    <div class="project-img" ${styleAttribute}></div>
                    <div class="project-info">
                        <h3>${data.title}</h3>
                        <p>${data.description}</p>
                        <div class="tech-tags">
                            ${techList}
                        </div>
                        <a href="${data.link}" target="_blank" class="btn-text">Ver Detalles &rarr;</a>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });

        // Re-aplicar observador a los elementos nuevos cargados dinámicamente usando el observer global
        const newFadeElements = document.querySelectorAll('#dynamic-projects-container .fade-in');
        if (window.observer) {
            newFadeElements.forEach(el => window.observer.observe(el));
        }

    } catch (error) {
        console.error("Error cargando proyectos: ", error);
        container.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: #ff6b6b;">Error conectando a Firebase. Revisa la consola o las reglas de seguridad.</p>';
    }
}

// Iniciar la carga de proyectos al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});
