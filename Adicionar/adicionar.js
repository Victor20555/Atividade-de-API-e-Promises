window.addEventListener('DOMContentLoaded', () => {
    
    document.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const totalrequest = await fetch('http://localhost:3000/products?_limit=1');
        const novoid = totalrequest.headers.get('X-Total-Count') + 1;

        const dadosnovoproduto = {
            name: document.getElementById('nome').value,
            price: document.getElementById('preco').value,
            image: document.getElementById('imagem').value,
            category: document.getElementById('categorias').value,
            description: document.getElementById('descricao').value,
            rating: document.getElementById('avaliacao').value,
            id: novoid
        };

        await fetch(`http://localhost:3000/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosnovoproduto) 
        });

        alert('Produto adicionado com sucesso!');
    });
});