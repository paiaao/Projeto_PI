let narrativa = {};
let habilidades = {
  combate: 0,
  inteligencia: 0,
  observacao: 0,
  agilidade: 0
};
let inventario = [];

function escolher(destino) {
  const estado = narrativa[destino];
  const textoDiv = document.getElementById("texto");
  const opcoesDiv = document.getElementById("opcoes");

  textoDiv.textContent = estado.texto;
  opcoesDiv.innerHTML = "";

  estado.opcoes.forEach(op => {
    const requisitos = op.requisitos || {};
    const bonus = op.bonus || {};
    const itens = op.itens || [];
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
      // adicionar itens ao inventário
      itens.forEach(item => {
        if (!inventario.includes(item)) {
          inventario.push(item);
        }
      });
      escolher(op.destino);
    };

    opcoesDiv.appendChild(botao);
  });

  atualizarPainelHabilidades();
  atualizarPainelInventario();
}

function atualizarPainelHabilidades() {
  for (let skill in habilidades) {
    document.getElementById(skill).textContent = habilidades[skill];
  }
}

function atualizarPainelInventario() {
  const lista = document.getElementById("inventario-lista");
  lista.innerHTML = "";
  if (inventario.length === 0) {
    const vazio = document.createElement("li");
    vazio.textContent = "Vazio";
    lista.appendChild(vazio);
  } else {
    inventario.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      lista.appendChild(li);
    });
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
