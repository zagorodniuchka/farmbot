import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import FarmBotControlPanelPage from './pages/ControlPanelPage';
import { BotProvider } from './BotContext.jsx';

function App() {
    const [bot, setBot] = useState(null);

    return (
        <BotProvider bot={bot}>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={<LoginForm onLogin={(jwt, botId, connectedBot) => setBot(connectedBot)} />}
                    />
                    <Route path="/control-panel" element={<FarmBotControlPanelPage />} />
                </Routes>
            </Router>
        </BotProvider>
    );
}

export default App;