let narrativa = {};

function escolher(destino) {
  const estado = narrativa[destino];
  const textoDiv = document.getElementById("texto");
  const opcoesDiv = document.getElementById("opcoes");

  textoDiv.textContent = estado.texto;
  opcoesDiv.innerHTML = "";

  estado.opcoes.forEach(op => {
    const botao = document.createElement("button");
    botao.textContent = op.texto;
    botao.onclick = () => escolher(op.destino);
    opcoesDiv.appendChild(botao);
  });
}
window.onload = () => {
  fetch("narrativa.json")
    .then(res => res.json())
    .then(json => {
      narrativa = json;
      escolher("inicio");
    })
    .catch(err => {
      document.getElementById("texto").textContent = "Erro ao carregar a história.";
      console.error(err);
    });
};
