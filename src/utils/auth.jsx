import * as jwtDecode from "jwt-decode";

export const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const decoded = jwtDecode.jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decoded.exp && decoded.exp > currentTime;
    } catch (e) {
        console.error("Token inválido:", e);
        return false;
    }
};
