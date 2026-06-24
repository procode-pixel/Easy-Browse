import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, updatePassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const loginSection = document.getElementById('login-section');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');

// --- Auth State ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.style.display = 'none';
        dashboard.style.display = 'block';
        loadAdminLinks();
    } else {
        loginSection.style.display = 'block';
        dashboard.style.display = 'none';
    }
});

// --- Login ---
loginBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginError.style.display = 'none';
    } catch (error) {
        loginError.textContent = "خطأ في تسجيل الدخول: " + error.message;
        loginError.style.display = 'block';
    }
});

// --- Logout ---
logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// --- Link Management ---
const currentLinksDiv = document.getElementById('current-links');
const addSiteBtn = document.getElementById('add-site-btn');

function loadAdminLinks() {
    const q = query(collection(db, "links"), orderBy("order", "asc"));
    onSnapshot(q, (snapshot) => {
        currentLinksDiv.innerHTML = '';
        snapshot.forEach((snapshotDoc) => {
            const data = snapshotDoc.data();
            const div = document.createElement('div');
            div.className = 'link-item';
            div.innerHTML = `
                <div>
                    <strong>${data.name}</strong> - <span style="font-size: 0.8em; opacity: 0.7;">${data.url}</span>
                </div>
                <button class="delete-btn" onclick="window.deleteLink('${snapshotDoc.id}')">حذف</button>
            `;
            currentLinksDiv.appendChild(div);
        });
    });
}

// Global function for delete button
window.deleteLink = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذا الموقع؟')) {
        await deleteDoc(doc(db, "links", id));
    }
};

addSiteBtn.addEventListener('click', async () => {
    const name = document.getElementById('site-name').value;
    const url = document.getElementById('site-url').value;
    const icon = document.getElementById('site-icon').value;
    const order = parseInt(document.getElementById('site-order').value) || 0;
    const bgColor = document.getElementById('site-color').value;

    if (!name || !url) return alert('يرجى ملء الاسم والرابط');

    try {
        await addDoc(collection(db, "links"), {
            name, url, icon, order, bgColor,
            createdAt: new Date()
        });
        // Clear inputs
        document.getElementById('site-name').value = '';
        document.getElementById('site-url').value = '';
        document.getElementById('site-icon').value = '';
        document.getElementById('site-color').value = '';
        alert('تمت الإضافة بنجاح!');
    } catch (e) {
        alert('خطأ: ' + e.message);
    }
});

// --- Seeding Default Data ---
const seedBtn = document.getElementById('seed-btn');
const defaultSites = [
    { name: "Doser Portfolio", url: "https://abdelrahman-doser.vercel.app", icon: "fas fa-user-tie", order: 1, className: "doser-portfolio" },
    { name: "يوتيوب", url: "https://www.youtube.com", icon: "fab fa-youtube", order: 2, className: "youtube" },
    { name: "فيسبوك", url: "https://www.facebook.com", icon: "fab fa-facebook-f", order: 3, className: "facebook" },
    { name: "إنستاجرام", url: "https://www.instagram.com", icon: "fab fa-instagram", order: 4, className: "instagram" },
    { name: "تيك توك", url: "https://www.tiktok.com", icon: "fab fa-tiktok", order: 5, className: "tiktok" },
    { name: "X (تويتر)", url: "https://x.com", icon: "fab fa-twitter", order: 6, className: "x-twitter" },
    { name: "ChatGPT", url: "https://chat.openai.com", icon: "fas fa-robot", order: 7, className: "chatgpt" },
    { name: "جيميناي", url: "https://gemini.google.com", icon: "fas fa-brain", order: 8, className: "gemini" },
    { name: "Gmail", url: "https://mail.google.com/", icon: "fas fa-envelope", order: 9, className: "gmail" },
    { name: "Drive", url: "https://drive.google.com/", icon: "fab fa-google-drive", order: 10, className: "drive" },
    { name: "GitHub", url: "https://github.com", icon: "fab fa-github", order: 11, className: "github" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "fab fa-linkedin", order: 12, className: "linkedin" },
    { name: "Canva", url: "https://www.canva.com", icon: "fas fa-palette", order: 13, className: "canva" },
    { name: "Pinterest", url: "https://www.pinterest.com", icon: "fab fa-pinterest", order: 14, className: "pinterest" },
    { name: "ترجمة", url: "https://translate.google.com/", icon: "fas fa-language", order: 15, className: "translate" },
    { name: "StackOverflow", url: "https://stackoverflow.com", icon: "fab fa-stack-overflow", order: 16, className: "stackoverflow" },
    { name: "Spotify", url: "https://www.spotify.com", icon: "fab fa-spotify", order: 17, className: "spotify" },
    { name: "Netflix", url: "https://www.netflix.com", icon: "fas fa-film", order: 18, className: "netflix" }
];

seedBtn.addEventListener('click', async () => {
    if (confirm('هل تريد استعادة كافة المواقع الافتراضية؟ سيتم إضافتها جميعاً الآن.')) {
        seedBtn.disabled = true;
        seedBtn.textContent = 'جاري المعالجة...';
        
        try {
            console.log("Starting restore...");
            for (const site of defaultSites) {
                const docRef = await addDoc(collection(db, "links"), {
                    ...site,
                    createdAt: new Date()
                });
                console.log("Added site: ", site.name, " ID: ", docRef.id);
            }
            alert('تمت استعادة 18 موقعاً بنجاح! يرجى تحديث الصفحة.');
        } catch (e) {
            console.error("Restore Error: ", e);
            alert('خطأ أثناء الاستعادة: ' + e.message);
        }
        seedBtn.disabled = false;
        seedBtn.textContent = 'استعادة المواقع الافتراضية';
    }
});

// --- Change Password ---
const changePassBtn = document.getElementById('change-pass-btn');
const newPassInput = document.getElementById('new-password');

changePassBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    const newPass = newPassInput.value;
    if (newPass.length < 6) return alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');

    try {
        await updatePassword(user, newPass);
        alert('تم تحديث كلمة المرور بنجاح!');
        newPassInput.value = '';
    } catch (e) {
        alert('خطأ: ' + e.message + ' (قد تحتاج لتسجيل الدخول مرة أخرى للقيام بهذه العملية)');
    }
});
