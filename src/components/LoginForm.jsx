import { useState } from "react";
import { loginFarmbot } from "../api/farmbotApi";
import { connectToFarmBot } from "@/farmbotMqqt.js";

export default function LoginForm({ onLogin }) {
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');

    // Минималистичный декодер JWT, чтобы не париться с импортами
    function decodeJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            if (!base64Url) throw new Error("Invalid JWT format");
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch {
            throw new Error("Failed to decode JWT");
        }
    }

    const handleTokenCreation = async (event) => {
        event.preventDefault();
        setError('');
        setStatus('');

        try {
            const jwt = await loginFarmbot(email, password);
            setToken(jwt);
            setStatus("✅ Token created successfully");
            console.log("🔐 JWT:", jwt);

            const decoded = decodeJwt(jwt);
            const botId = decoded.bot;
            if (!botId) throw new Error("Bot ID not found in token");

            console.log("🤖 Bot ID:", botId);

            connectToFarmBot(jwt, botId, email,(topic, message) => {
                console.log("📥 Received:", topic, message);
                setStatus(`📡 Connected. Topic: ${topic}`);
            });

            if (onLogin) onLogin(jwt, botId);

        } catch (err) {
            setError(`❌ ${err.message || "Failed to login"}`);
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleTokenCreation} className="space-y-4 max-w-sm mx-auto p-4 border rounded">
            <h1 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "2rem" }}>
                🌿 FarmBot Control Panel
            </h1>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border rounded"
            />

            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}

            {status && (
                <div className="text-green-600 text-sm">{status}</div>
            )}

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition">
                Login
            </button>
        </form>
    );
}
