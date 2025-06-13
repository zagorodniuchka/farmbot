import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from '@/components/LoginForm.jsx';
import {FarmBotControlPanel} from "@/pages/ControlPanelPage.jsx";

export const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/control-panel" element={<FarmBotControlPanel />} />
            </Routes>
        </Router>
    );
};
