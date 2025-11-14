
// 1. Necesitas BrowserRouter para que React Router funcione
import { BrowserRouter } from 'react-router-dom'; 
// 2. Importas el archivo de rutas que acabamos de completar
import { AppRoutes } from './routes/AppRoutes'; 

function App() {
  return (
    // BrowserRouter debe envolver toda la aplicación para manejar las URLs
    <BrowserRouter> 
      {/* AppRoutes contiene todas las definiciones de <Route path="..."> */}
      <AppRoutes /> 
    </BrowserRouter>
  );
}

// 3. Exportación por defecto, como exige main.tsx
export default App;