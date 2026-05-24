# Pasta de imagens da galeria

Coloque aqui os arquivos `.jpg` / `.png` / `.webp` referenciados em `data/galeria.json`.

## Nomes esperados pelo `galeria.json` inicial

- `treino-infantil-01.jpg`
- `treino-adulto-01.jpg`
- `graduacao-01.jpg`
- `competicao-01.jpg`
- `equipe-01.jpg`

Enquanto as imagens reais não forem enviadas, o site exibe um placeholder elegante (gradiente escuro com iniciais do título). Basta subir os arquivos com esses nomes para o site passar a mostrá-los automaticamente.

## Adicionar novas fotos

1. Salve a imagem nesta pasta (ex.: `treino-feminino-01.jpg`).
2. Otimize tamanho (idealmente 1200×1500px, ≤ 250KB). Sugestão: https://squoosh.app/
3. Edite `../../data/galeria.json` adicionando um item:
   ```json
   {
     "titulo": "Treino feminino",
     "categoria": "Adulto",
     "imagem": "assets/galeria/treino-feminino-01.jpg"
   }
   ```
4. Faça commit e push — o site atualiza sozinho.
