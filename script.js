let narrativa = {};
let habilidades = {
  combate: 0,
  inteligencia: 0,
  observacao: 0,
  agilidade: 0
};

function escolher(destino) {
  const estado = narrativa[destino];
  const textoDiv = document.getElementById("texto");
  const opcoesDiv = document.getElementById("opcoes");

  textoDiv.textContent = estado.texto;
  opcoesDiv.innerHTML = "";

  estado.opcoes.forEach(op => {
    const requisitos = op.requisitos || {};
    const bonus = op.bonus || {};
    const podeEscolher = Object.keys(requisitos).every(skill => habilidades[skill] >= requisitos[skill]);

    // Construir a legenda de requisitos, se houver
    let legenda = "";
    const requisitosTexto = Object.entries(requisitos)
      .map(([skill, valor]) => `${skill[0].toUpperCase() + skill.slice(1)}: ${valor}`)
      .join(", ");

    if (requisitosTexto) {
      legenda = ` [Requer: ${requisitosTexto}]`;
    }

    const botao = document.createElement("button");
    botao.textContent = op.texto + legenda;
    botao.disabled = !podeEscolher;

    botao.onclick = () => {
      // aplicar bônus ao selecionar
      for (let skill in bonus) {
        if (habilidades.hasOwnProperty(skill)) {
          habilidades[skill] += bonus[skill];
        }
      }
      escolher(op.destino);
    };

    opcoesDiv.appendChild(botao);
  });

  atualizarPainelHabilidades();
}

function atualizarPainelHabilidades() {
  for (let skill in habilidades) {
    document.getElementById(skill).textContent = habilidades[skill];
  }
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
