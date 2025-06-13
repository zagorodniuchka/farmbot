import axios from "axios";

const API_BASE_URL = "https://my.farmbot.io/api";

export async function loginFarmbot(email, password) {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/tokens`,
            { user: { email, password } },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }
        );
        console.log("📡 API Response:", response.data);
        const jwt = response.data?.token?.encoded || response.data?.token;
        if (typeof jwt !== 'string') {
            throw new Error("Invalid token format");
        }
        return jwt;
    } catch (err) {
        console.error("�19 API Error:", err.response?.data || err.message);
        throw new Error(err.response?.data?.error || "Failed to login");
    }
}