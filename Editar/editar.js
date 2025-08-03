window.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    const response = await fetch(`http://localhost:3000/products/${id}`);
    const produto = await response.json();

    document.getElementById('nome').value = produto.name || '';
    document.getElementById('preco').value = produto.price || '';
    document.getElementById('imagem').value = produto.image || '';
    document.getElementById('categorias').value = produto.category || '';
    document.getElementById('descricao').value = produto.description || '';
    document.getElementById('avaliacao').value = produto.rating || '';

    document.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const dadosAtualizados = {
            name: document.getElementById('nome').value,
            price: document.getElementById('preco').value,
            image: document.getElementById('imagem').value,
            category: document.getElementById('categorias').value,
            description: document.getElementById('descricao').value,
            rating: document.getElementById('avaliacao').value
        };

        await fetch(`http://localhost:3000/products/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAtualizados)
        });

        alert('Produto atualizado com sucesso!');
    });
});