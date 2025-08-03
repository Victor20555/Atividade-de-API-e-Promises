let paginaAtual = 1;
const roupaspagina = 9;

async function main() {
    const totalrequest = await fetch('http://localhost:3000/products?_limit=1');
    const totalRoupas = totalrequest.headers.get('X-Total-Count');
    const totalPaginas = Math.ceil(totalRoupas / roupaspagina);

    await renderPagina(paginaAtual, totalPaginas);
    criarPaginacao(totalPaginas);
}

async function renderPagina(pagina, totalPaginas) {
    const roupas = await getroupas(roupaspagina, pagina);
    const container = document.querySelector('.roupas');
    container.innerHTML = '';
    roupas.forEach(roupa => {
        const card = criarCard({
            imagem: roupa.image.includes("placeholder") ? "../imagens/modelo.jpg" : roupa.image,
            nome: roupa.name,
            subtitulo: roupa.category,
            descricao: roupa.description,
            preco: roupa.price,
            avaliacao: roupa.rating,
            id: roupa.id
        });
        container.appendChild(card);
    });


    document.querySelectorAll('.icon.red').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = btn.getAttribute('data-id');
            if (confirm('Tem certeza que deseja excluir este produto?')) {
                await fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' });
                await renderPagina(paginaAtual, totalPaginas);
                criarPaginacao(totalPaginas);
            }
        });
    });
}

function criarPaginacao(totalPaginas) {
    const paginacao = document.querySelector('.paginacao');
    paginacao.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'paginacao-arrow';
    prevBtn.innerHTML = '&lt;';
    prevBtn.disabled = paginaAtual === 1;
    prevBtn.onclick = async () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            await renderPagina(paginaAtual, totalPaginas);
            criarPaginacao(totalPaginas);
        }
    };
    paginacao.appendChild(prevBtn);

    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === paginaAtual ? 'pagina-btn active' : 'pagina-btn';
        btn.onclick = async () => {
            paginaAtual = i;
            await renderPagina(paginaAtual, totalPaginas);
            criarPaginacao(totalPaginas);
        };
        paginacao.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'paginacao-arrow';
    nextBtn.innerHTML = '&gt;';
    nextBtn.disabled = paginaAtual === totalPaginas;
    nextBtn.onclick = async () => {
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            await renderPagina(paginaAtual, totalPaginas);
            criarPaginacao(totalPaginas);
        }
    };
    paginacao.appendChild(nextBtn);
}

function criarCard({ imagem, nome, subtitulo, descricao, preco, avaliacao, id }) {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
        <div class="imagem-wrapper">
            <img src="${imagem}" alt="${nome}" class="produto-img">
            <div class="card-top">
                <span class="rating">${avaliacao} <img src="../imagens/star.png" alt="estrela"></span>
                <div class="icons">
                    <img src="../imagens/lixeira.png" alt="Deletar" class="icon red" data-id="${id}">
                    <a href="../Editar/editar.html?id=${id}">
                        <img src="../imagens/editar.png" alt="Editar" class="icon blue">
                    </a>
                </div>
            </div>
        </div>
        <div class="card-info">
            <h3>${nome}</h3>
            <p class="subtitulo">${subtitulo}</p>
            <p class="descricao">${descricao}</p>
            <p class="preco">R$${Number(preco).toFixed(2)}</p>
        </div>
    `;

    return card;
}



main();


async function getroupas(limit, page) {
    const response = await fetch(`http://localhost:3000/products?_limit=${limit}&_page=${page}`);
    return response.json();
}