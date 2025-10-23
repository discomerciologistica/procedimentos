let dados = [];

// Carrega CSV e exibe data de atualização
fetch("equipe.csv")
  .then(response => {
    const dataArquivo = new Date(response.headers.get("Last-Modified"));
    if (!isNaN(dataArquivo)) {
      const opcoes = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" };
      document.getElementById("ultimaAtualizacao").textContent =
        "⏰ Última atualização: " + dataArquivo.toLocaleString("pt-BR", opcoes);
    }
    return response.text();
  })
  .then(text => {
    const linhas = text.trim().split("\n").slice(1);
    dados = linhas.map(linha => {
      const [setor, nome, celular, email, ramal] = linha.split(",");
      return { setor, nome, celular, email, ramal };
    });
    mostrarCards(dados);
  });

// Mostra os dados em cards
function mostrarCards(lista) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  if (lista.length === 0) {
    container.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    document.getElementById("contadorResultados").textContent = "";
    return;
  }

  lista.forEach(d => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="setor">${d.setor || ""}</div>
      <div class="nome">${d.nome || ""}</div>
      <div class="contato"><i class="fa-brands fa-whatsapp" style="color: #25D366 ; "></i> ${d.celular || ""}</div>
      <div class="contato"><i class="fa-solid fa-envelope"></i> ${d.email || ""}</div>
      <div class="contato"><i class="fa-solid fa-phone"></i> ${d.ramal || ""}</div>
    `;
    container.appendChild(card);
  });

  document.getElementById("contadorResultados").textContent =
    `${lista.length} contato${lista.length > 1 ? "s" : ""} encontrado${lista.length > 1 ? "s" : ""}`;
}

// Filtro de busca
document.getElementById("searchInput").addEventListener("input", e => {
  const valor = e.target.value.toLowerCase();
  const filtrados = dados.filter(d =>
    d.nome.toLowerCase().includes(valor) || d.setor.toLowerCase().includes(valor)
  );
  mostrarCards(filtrados);
});
