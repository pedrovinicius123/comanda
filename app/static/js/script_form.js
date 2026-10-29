const form = document.querySelector("[data-auth-form]");
const mensagem = document.getElementById("auth-mensagem");

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensagem.textContent = "";

    const formData = new FormData(form);
    const senha = formData.get("password");
    if (form.dataset.mode === "register" && senha !== document.getElementById("confirmacaoSenha").value) {
        mensagem.textContent = "As senhas não conferem.";
        return;
    }

    const dados = { email: formData.get("email"), password: senha };
    if (form.dataset.mode === "register") {
        dados.name = formData.get("name");
    }

    try {
        const resposta = await fetch(form.action, {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });
        const resultado = await resposta.json().catch(() => ({}));
        if (!resposta.ok) {
            throw new Error(resultado.error || "Não foi possível autenticar.");
        }
        window.location.assign("/");
    } catch (erro) {
        mensagem.textContent = erro.message;
    }
});