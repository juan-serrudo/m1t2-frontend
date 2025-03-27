import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import "./index.css";
// import { locale, addLocale, PrimeReactProvider } from 'primereact/api'
// import esLocale from 'primereact/resources/locales/es'
// import 'primereact/resources/themes/soho-light/theme.css'
// import 'primereact/resources/themes/saga-blue/theme.css'
// import 'primereact/resources/themes/tailwind-light/theme.css'
// import 'primereact/resources/primereact.min.css'
// import 'primeicons/primeicons.css'

import App from './App'

// addLocale('es', {
//   firstDayOfWeek: 1,
//   dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
//   dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
//   dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
//   monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
//   monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
//   today: 'Hoy',
//   clear: 'Limpiar',
//   //...
// })
// locale('es');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
