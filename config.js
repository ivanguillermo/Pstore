// ==========================================
// CONFIGURACIÓN BASE LOCAL Y DE RESPALDO
// ==========================================

const CONFIG_PSTORE = {
  // 1. Identidad y Contacto de la Tienda
  nombreTienda: "Pstore",
  urlLogo: "assets/pstore.jpg",
  numeroWhatsapp: "+584126216661",
  mensajeBienvenida: "¡Bienvenidos a Pstore!",
  urlPdfCatalogo: "https://drive.google.com/file/d/1UbvpO9gN32uocysk-97mQ3RFlLUp-R9q/view?usp=sharing",  
  
  // Redes Sociales (Opcionales)
  linkInstagram: "https://www.instagram.com/pstorevzla",
  linkFacebook: "https://www.facebook.com/people/Pstore-Variedades/100069365366035/",

  // 2. Moneda Alternativa  
  simboloMonedaAlt: "Bs.",

  // 3. Enlace de publicación CSV de tu pestaña 'Configuracion' en Google Sheets
  urlSheetConfig: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_D4Cym7p0ATsh5UCG2Q3kbvhy5WuMPx0Q8gCfdz_l9IDoaCb4jn1T8zQ9YKCCvt-0GA0vkDrwKXX2/pub?gid=1458625703&single=true&output=csv",
  // 4. URL ÚNICA del Apps Script (pedidos, métricas, tokens push). Cambia SOLO aquí.
  //    Debe ser el despliegue donde publicaste pstore.gs.
  scriptUrl: "https://script.google.com/macros/s/AKfycbz40EOo3jeOAXgy7ARuVbjDD0mWT9a7KhMTuWOpglsg9KRc-ooOeTXnek3sFbjkAEJoPw/exec",

  // 5. Tasa de emergencia (Bs. por USD) si falla la hoja Y no hay una tasa guardada. 0 = sin respaldo.
  tasaBcvRespaldo: 0,

  // 6. Se llena sola con las variables "--algo" de tu hoja `website`. No tocar.
  estilosCSS: {}
};
