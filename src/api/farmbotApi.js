import axios from "axios";

const API_BASE_URL = "https://my.farmbot.io/api";

export async function loginFarmbot(email, password) {
    const response = await axios.post(`${API_BASE_URL}/tokens`, {
        user: { email, password },
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0',
            'Origin': 'https://my.farmbot.io',
            'Referer': 'https://my.farmbot.io/',
        }
    });

    const jwt = response.data?.token?.encoded || response.data?.token || response.data;
    if (typeof jwt !== 'string') {
        throw new Error("Invalid token format");
    }
    return jwt;
}
