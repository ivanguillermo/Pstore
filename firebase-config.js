import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyDk3HfCEalNjDbvx67HHdMybaAIpNw1IWY",
  authDomain: "pstorechat.firebaseapp.com",
  projectId: "pstorechat",
  storageBucket: "pstorechat.firebasestorage.app",
  messagingSenderId: "274979276949",
  appId: "1:274979276949:web:9d1b9412db8b627d2bb39c",
  measurementId: "G-904HWSPGTP"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const VAPID_KEY = "BIsvsKQYY5veWnIxbC-K7EGRkLhqS7aRWbefB9PU-F0D_Kfg8wCKJMt_n8AEiPld1aKV5Bg4wLKZ2K7c-nMI-_w";

// El service worker se registra SIEMPRE (caché offline + push), no solo al pedir permiso
const swRegistro = ('serviceWorker' in navigator)
  ? navigator.serviceWorker.register('./sw.js').catch(e => { console.error('SW:', e); return null; })
  : Promise.resolve(null);

// Obtiene el token de este dispositivo y lo guarda en tu Sheet (hoja "Tokens") una sola vez
async function obtenerYGuardarToken() {
  const registration = await swRegistro;
  if (!registration) return null;

  const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
  if (!token) return null;

  if (localStorage.getItem('pstore_fcm_token') !== token) {
    const url = (typeof CONFIG_PSTORE !== 'undefined') ? CONFIG_PSTORE.scriptUrl : null;
    if (url) {
      const enviado = navigator.sendBeacon(url, JSON.stringify({
        action: 'registrar_token',
        token: token,
        dispositivo: navigator.userAgent.substring(0, 120)
      }));
      if (enviado) localStorage.setItem('pstore_fcm_token', token);
    }
  }
  return token;
}

export async function pedirPermisoPush() {
  try {
    if (!('Notification' in window) || Notification.permission === 'denied') return null;
    const permission = await Notification.requestPermission();
    if (permission === 'granted') return await obtenerYGuardarToken();
  } catch (err) {
    console.error('❌ Error Push:', err);
  }
  return null;
}
window.pedirPermisoPush = pedirPermisoPush; // por si luego pones un botón "Activar avisos"

// Notificación con la app abierta (mensajes data-only: título/cuerpo vienen en payload.data)
onMessage(messaging, async (payload) => {
  const d = payload.data || {};
  const n = payload.notification || {};
  const registration = await swRegistro;
  if (registration) {
    registration.showNotification(d.title || n.title || 'Pstore', {
      body: d.body || n.body || '',
      icon: d.icon || 'assets/pstore.jpg',
      data: { url: d.url || '/' }
    });
  }
});

window.addEventListener('load', () => {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    // Ya aceptó antes: solo refrescar/guardar el token, sin molestar
    obtenerYGuardarToken().catch(e => console.error(e));
  } else if (Notification.permission === 'default') {
    // No pedir permiso apenas carga: esperar 8 s y un toque/clic real del usuario
    let pasaron8s = false;
    setTimeout(() => { pasaron8s = true; }, 8000);
    const alToque = () => {
      if (!pasaron8s) return;
      document.removeEventListener('click', alToque);
      pedirPermisoPush();
    };
    document.addEventListener('click', alToque);
  }
});
