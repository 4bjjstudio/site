# 4BJJ — Studio de Artes Marciais

Site institucional do **4BJJ**, um Studio de Artes Marciais focado em Jiu-Jitsu.
Estático, sem backend, sem build, sem dependências.
Construído apenas com **HTML, CSS e JavaScript puro**.

> *Disciplina no tatame, evolução para a vida.*

---

## 🧭 Estrutura do projeto

```
.
├── index.html                # Página única, todas as seções
├── styles.css                # Tema marcial (preto/branco/vermelho)
├── script.js                 # Menu mobile, galeria, scroll, fallbacks
├── data/
│   └── galeria.json          # Dados das fotos da galeria
├── assets/
│   ├── logo-4bjj.svg         # Logo provisório (caso .jpeg não exista)
│   ├── favicon.svg
│   ├── og-cover.svg          # Imagem de compartilhamento social
│   └── galeria/              # Fotos referenciadas em galeria.json
├── CNAME                     # Domínio 4bjj.com.br (GitHub Pages)
├── robots.txt
├── sitemap.xml
└── .nojekyll                 # Impede o Jekyll no GitHub Pages
```

---

## 🏃 Rodar localmente

Como é tudo estático, **abrir `index.html` direto no navegador funciona** — exceto pela galeria, que usa `fetch()` para ler `data/galeria.json` e o navegador bloqueia leitura local de arquivos por padrão.

Use qualquer servidor estático:

```bash
# Opção A — Python (já vem instalado na maioria dos sistemas)
python3 -m http.server 8000
# abra http://localhost:8000

# Opção B — Node (npx, sem instalar nada permanente)
npx --yes serve .

# Opção C — VS Code: extensão "Live Server" → clique direito no index.html
```

---

## 🚀 Deploy

### A) GitHub Pages (recomendado para começar — gratuito)

1. No repositório (`JanusJJR/-4bjj-site`), vá em **Settings → Pages**.
2. Em **Source**, selecione `Deploy from a branch` → branch `main`, pasta `/ (root)`.
3. Salve. O GitHub vai publicar em `https://janusjjr.github.io/-4bjj-site/`.
4. O arquivo [`CNAME`](CNAME) já está configurado com `4bjj.com.br`. Em **Settings → Pages → Custom domain** confirme o domínio. Marque **Enforce HTTPS** assim que o certificado for emitido (alguns minutos após o DNS propagar).

**DNS do `4bjj.com.br`** (no painel do registrador — Registro.br, Cloudflare, etc.):

| Tipo  | Nome    | Valor                       |
|-------|---------|-----------------------------|
| A     | `@`     | `185.199.108.153`           |
| A     | `@`     | `185.199.109.153`           |
| A     | `@`     | `185.199.110.153`           |
| A     | `@`     | `185.199.111.153`           |
| CNAME | `www`   | `janusjjr.github.io.`       |

Depois de propagar (15min–24h), `https://4bjj.com.br` já abre o site.

### B) Cloudflare Pages (recomendado para produção)

1. Acesse https://dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git**.
2. Selecione o repositório `JanusJJR/-4bjj-site`.
3. Configuração de build:
   - **Build command:** *(deixe vazio)*
   - **Build output directory:** `/`
4. Em **Custom domains**, adicione `4bjj.com.br` e `www.4bjj.com.br`. A Cloudflare cria os registros automaticamente se o domínio já estiver na conta; se não, exibe os DNS a configurar no Registro.br.
5. Cada `git push` na branch `main` redeploya o site em segundos.

> Não use os dois ao mesmo tempo apontando para o mesmo domínio. Escolha um.

---

## ✏️ Editar conteúdo

A maior parte do conteúdo está no [`index.html`](index.html) — basta abrir e alterar.
Configurações de contato ficam no topo do [`script.js`](script.js) em `SITE_CONFIG`:

```js
const SITE_CONFIG = {
  WHATSAPP_NUMBER: "5500000000000",   // DDI+DDD+número (sem sinais)
  WHATSAPP_MESSAGE: "Olá! ...",       // mensagem pré-preenchida
  INSTAGRAM_URL: "https://instagram.com/4bjjstudio",
  ADDRESS: "Rua exemplo, 000 — Cidade/UF",
  HOURS: [
    { label: "Segunda a Sexta", value: "06h00 – 22h00" },
    ...
  ],
  MAP_EMBED_SRC: ""  // veja abaixo
};
```

### Trocar a logo

Substitua [`assets/logo-4bjj.svg`](assets/logo-4bjj.svg) OU coloque um arquivo `assets/logo-4bjj.jpeg` (o HTML carrega o JPEG e, se faltar, usa o SVG provisório como fallback).

Tamanho ideal da logo: **256×256px**, fundo transparente ou branco.

### Foto do professor

Coloque a foto em `assets/paulo-cesar-brasileiro.jpeg`.
Proporção sugerida: **4:5** (ex.: 800×1000px). Se o arquivo não existir, o site mostra um placeholder elegante com as iniciais "PCB".

### Adicionar fotos na galeria

1. Salve o arquivo otimizado em [`assets/galeria/`](assets/galeria/) — exemplo: `treino-feminino-01.jpg`.
2. Abra [`data/galeria.json`](data/galeria.json) e acrescente um item:

   ```json
   {
     "titulo": "Treino feminino",
     "categoria": "Adulto",
     "imagem": "assets/galeria/treino-feminino-01.jpg"
   }
   ```

3. Commit + push. Os filtros por categoria são gerados automaticamente.

**Dicas:**
- Otimize as imagens em https://squoosh.app/ (mantenha cada uma com ≤ 250KB).
- Proporção sugerida: **4:5** (cards verticais).
- Se o JPG não for encontrado, o card mostra um placeholder em vez de quebrar.

### Editar depoimentos

No [`index.html`](index.html), procure por `<!-- DEPOIMENTOS -->` e altere os `<blockquote>`.

### Adicionar o mapa do Google

1. Abra https://maps.google.com → busque seu endereço.
2. **Compartilhar → Incorporar um mapa → COPIAR HTML**.
3. Do HTML copiado, pegue só o conteúdo do atributo `src="…"`.
4. Cole no `SITE_CONFIG.MAP_EMBED_SRC` no [`script.js`](script.js).

### Trocar WhatsApp / Instagram / endereço / horários

Só edite as constantes do `SITE_CONFIG` no [`script.js`](script.js). O site atualiza tudo automaticamente (link do botão flutuante, seção de contato, CTA grande).

---

## ✅ O que está incluso

- Responsivo (mobile, tablet, desktop).
- Acessibilidade básica: `skip-link`, `aria-*`, foco visível, contraste, `alt` nas imagens, `prefers-reduced-motion`.
- SEO básico: `title`, `description`, `canonical`, Open Graph, Twitter Cards, Schema.org `SportsActivityLocation`, `sitemap.xml`, `robots.txt`.
- Botão flutuante WhatsApp com pulse.
- Galeria dinâmica via JSON, com filtros por categoria e fallback gracioso.
- Scroll spy (link da seção ativa é destacado no menu).
- Animações suaves de entrada (respeitam `prefers-reduced-motion`).
- Sem dependência de npm, frameworks ou backend.

---

## 📜 Licença

© 2026 4BJJ Studio de Artes Marciais. Todos os direitos reservados.
