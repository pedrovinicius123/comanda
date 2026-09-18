// Data/hora do cabeçalho
function atualizarData() {
    const agora = new Date();
    const texto = agora.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    document.getElementById('data-atual').textContent = 'data: ' + texto;
}
atualizarData();
setInterval(atualizarData, 1000);
