const API_URL = process.env.REACT_APP_API_URL;

export default async function authFetch(path, options = {}) {

    console.log("API_URL =", API_URL);

    const token = localStorage.getItem("token");

    return fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            ...options.headers,
        },
    });
}
