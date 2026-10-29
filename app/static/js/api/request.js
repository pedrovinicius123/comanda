export async function apiRequest(path, { method = "GET", body } = {}) {
    const options = {
        method,
        credentials: "same-origin",
        headers: {},
    };

    if (body !== undefined) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    const response = await fetch(path, options);
    if (response.redirected) {
        throw new Error("Sua sessão expirou. Entre novamente para continuar.");
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || "Não foi possível concluir a operação.");
    }
    return data;
}