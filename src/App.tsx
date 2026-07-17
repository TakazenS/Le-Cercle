import "./App.css";
import { useAuth } from "./Auth/auth.tsx";
import { AuthScreen } from "./Auth/AuthScreen.tsx";

function App() {
    const { isAuthenticated, logout } = useAuth();
    if (!isAuthenticated) return <AuthScreen />;
  return (
    <main className="container">
        <p>Connecté ! (bientôt le reste)</p>
        <button onClick={logout}>Se deconnecter</button>
    </main>
  );
}

export default App;
