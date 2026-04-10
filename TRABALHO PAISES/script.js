// CONTROLE DE PAGINAÇÃO
let listaPaises = [];
let paginaAtual = 0;
const porPagina = 5;

// BUSCAR PAÍS
function buscarPais() {
  const nome = document.getElementById("pais").value.toLowerCase().trim();

  if (!nome) {
    Swal.fire("Erro", "Digite um país!", "error");
    return;
  }

  fetch(`https://restcountries.com/v3.1/name/${nome}`)
    .then(res => {
      if (!res.ok) {
        throw new Error("País não encontrado");
      }
      return res.json();
    })
    .then(data => {
      if (!data || !data.length) {
        Swal.fire("Erro", "País não encontrado!", "error");
        return;
      }

      mostrarPais(data[0]);
    })
    .catch(() => {
      Swal.fire("Erro", "Falha ao buscar país!", "error");
    });
}

// BUSCAR POR REGIÃO
function buscarRegiao() {
  const regiao = document.getElementById("regiao").value;

  if (!regiao) {
    Swal.fire("Erro", "Selecione uma região!", "error");
    return;
  }

  fetch(`https://restcountries.com/v3.1/region/${regiao}`)
    .then(res => {
      if (!res.ok) {
        throw new Error("Erro na API");
      }
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error("Resposta inválida");
      }

      listaPaises = data;
      paginaAtual = 0;
      renderizarPagina();
    })
    .catch(() => {
      Swal.fire("Erro", "Falha ao buscar região!", "error");
    });
}

// RENDERIZAR PÁGINA
function renderizarPagina() {
  const container = document.getElementById("preview-container");
  container.innerHTML = "";

  const inicio = paginaAtual * porPagina;
  const fim = inicio + porPagina;
  const pagina = listaPaises.slice(inicio, fim);

  pagina.forEach(pais => {
    const nomePT = pais.translations?.por?.common || pais.name.common;

    const card = document.createElement("div");
    card.className = "country-card";

    card.innerHTML = `
      <img src="${pais.flags.png}">
      <div>
        <h3>${nomePT}</h3>
        <p>Capital: ${pais.capital ? pais.capital[0] : "N/A"}</p>
      </div>
    `;

    card.onclick = () => mostrarDetalhes(pais);

    container.appendChild(card);
  });

  renderizarBotoes();
}

// BOTÕES
function renderizarBotoes() {
  const container = document.getElementById("preview-container");

  const nav = document.createElement("div");
  nav.style.marginTop = "10px";

  nav.innerHTML = `
    <button onclick="paginaAnterior()">⬅ Anterior</button>
    <button onclick="proximaPagina()">Próximo ➡</button>
  `;

  container.appendChild(nav);
}

function proximaPagina() {
  if ((paginaAtual + 1) * porPagina < listaPaises.length) {
    paginaAtual++;
    renderizarPagina();
  }
}

function paginaAnterior() {
  if (paginaAtual > 0) {
    paginaAtual--;
    renderizarPagina();
  }
}

// MOSTRAR PAÍS
function mostrarPais(pais) {
  const nome = pais.translations?.por?.common || pais.name.common;
  const capital = pais.capital ? pais.capital[0] : "N/A";
  const populacao = pais.population.toLocaleString();
  const moeda = pais.currencies ? Object.values(pais.currencies)[0].name : "N/A";
  const bandeira = pais.flags.png;

  const html = `
    <div class="country-card">
      <img src="${bandeira}">
      <div>
        <h3>${nome}</h3>
        <p>Capital: ${capital}</p>
        <p>População: ${populacao}</p>
        <p>Moeda: ${moeda}</p>
      </div>
    </div>
  `;

  document.getElementById("preview-container").innerHTML = html;

  salvarHistorico(nome, capital, bandeira);
}

// DETALHES
function mostrarDetalhes(pais) {
  const nome = pais.translations?.por?.common || pais.name.common;

  Swal.fire({
    title: nome,
    html: `
      <img src="${pais.flags.png}" width="100"><br><br>
      <b>Capital:</b> ${pais.capital ? pais.capital[0] : "N/A"}<br>
      <b>População:</b> ${pais.population.toLocaleString()}<br>
      <b>Região:</b> ${pais.region}<br>
      <b>Moeda:</b> ${pais.currencies ? Object.values(pais.currencies)[0].name : "N/A"}
    `
  });
}

// HISTÓRICO
function salvarHistorico(nome, capital, bandeira) {
  let lista = JSON.parse(localStorage.getItem("paises")) || [];

  lista.push({ nome, capital, bandeira });

  localStorage.setItem("paises", JSON.stringify(lista));

  atualizarTabela();
}

function atualizarTabela() {
  let lista = JSON.parse(localStorage.getItem("paises")) || [];

  let html = "";

  lista.forEach(p => {
    html += `
      <tr>
        <td><img src="${p.bandeira}" width="50"></td>
        <td>${p.nome}</td>
        <td>${p.capital}</td>
      </tr>
    `;
  });

  document.getElementById("table-body").innerHTML = html;
}

window.onload = atualizarTabela;