import { AuthProvider } from "./context/AuthContext.jsx";
import LoginForm from "./components/LoginForm";

function App() {
    return (
        <AuthProvider>
            <LoginForm />
        </AuthProvider>
    );
}

export default App;
