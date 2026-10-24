# KURIO — NFT Marketplace

Aplicação web de marketplace de NFTs desenvolvida como solução para o desafio técnico de Front-end da **Jungle Gaming**.

O projeto utiliza React e TypeScript, com foco em navegação, descoberta de NFTs, gerenciamento de carrinho e simulação de compra.

A aplicação conta com uma API simulada utilizando Mock Service Worker (MSW), permitindo executar os principais fluxos sem depender de um backend externo.

## Aplicação publicada

**[Acessar KURIO](https://greenmint.vercel.app/)**

## Tecnologias utilizadas

- **React 19** — Construção da interface.
- **TypeScript** — Tipagem estática.
- **Vite** — Ambiente de desenvolvimento e build.
- **Tailwind CSS 4** — Estilização e responsividade.
- **TanStack Router** — Navegação e parâmetros de URL.
- **TanStack Query** — Consultas, cache e gerenciamento do estado assíncrono.
- **Axios** — Comunicação HTTP.
- **Mock Service Worker (MSW)** — Simulação de API REST.
- **Playwright** — Testes end-to-end.
- **Oxlint** — Análise estática do código.

## Funcionalidades implementadas

### Marketplace

- Listagem de NFTs com dados fornecidos pela API simulada.
- Busca por nome e criador.
- Filtros por categoria e faixa de preço.
- Ordenação por preço e data.
- Visualizações de lançamentos recentes e NFTs em alta, utilizando critérios simulados.
- Paginação dos resultados.
- Sincronização dos filtros com os parâmetros da URL.
- Persistência dos filtros após atualização da página.
- Estados de carregamento, erro e resultados vazios.

### Detalhes do NFT

- Rota dinâmica para cada colecionável.
- Exibição de imagem, nome, criador, categoria e preço.
- Galeria preparada para múltiplas imagens.
- Seleção de edição.
- Controle de quantidade.
- Validação da disponibilidade e do estoque.
- Tratamento de NFTs inexistentes.
- Adição de itens ao carrinho.

### Carrinho

- Inclusão de NFTs por edição e quantidade.
- Atualização de quantidades.
- Remoção de itens.
- Validação do estoque disponível.
- Persistência local dos itens.
- Cotação calculada pela API simulada.
- Aplicação e validação de cupons.
- Cálculo de subtotal, desconto, taxa de rede e total.

### Checkout e pedidos

- Revisão dos valores antes da compra.
- Seleção da rede utilizada na simulação.
- Informação de endereço de carteira.
- Processamento de pedidos pela API simulada.
- Revalidação do estoque e do total da cotação.
- Proteção básica contra pedidos duplicados utilizando chave de idempotência.
- Página de confirmação de compra.
- Persistência local dos pedidos.
- Consulta do pedido por identificador.
- Limpeza do carrinho após confirmação.

**Observação:** todas as operações de pagamento são simuladas. A aplicação não realiza transações reais em blockchain.

## Instalação e execução

### Pré-requisitos

- Node.js compatível com as dependências do projeto.
- npm.

### Clonar o repositório

```bash
git clone https://github.com/JeanSouza911/greenmint.git
cd greenmint
```

### Instalar as dependências

```bash
npm install
```

### Executar o projeto

```bash
npm run dev
```

A aplicação estará disponível no endereço informado pelo Vite, normalmente:

`http://localhost:5173`

### Build de produção

```bash
npm run build
```

### Executar a versão de produção localmente

```bash
npm run preview
```

### Análise estática

```bash
npm run lint
```

## Testes automatizados

Os testes end-to-end utilizam Playwright.

Para executar:

```bash
npx playwright test
```

Os cenários implementados incluem:

- Verificação inicial de carregamento da aplicação.
- Fluxo de compra simulada, desde a seleção de um NFT até a confirmação do pedido.
- Consulta da confirmação após atualização da página.
- Verificação do carrinho após uma compra confirmada.

Para instalar os navegadores necessários ao Playwright, caso ainda não estejam disponíveis:

```bash
npx playwright install
```

## API simulada

A aplicação utiliza o MSW para interceptar requisições HTTP e responder com dados simulados.

Entre os endpoints implementados estão:

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/nfts` | Listagem, pesquisa, filtros, ordenação e paginação |
| GET | `/api/nfts/:id` | Detalhes de um NFT |
| GET | `/api/cart` | Consulta do carrinho |
| POST | `/api/cart/items` | Adição de itens |
| PATCH | `/api/cart/items/:id` | Atualização da quantidade |
| DELETE | `/api/cart/items/:id` | Remoção de itens |
| POST | `/api/cart/quote` | Cálculo da cotação |
| POST | `/api/orders` | Processamento simulado do pedido |
| GET | `/api/orders/:id` | Consulta de um pedido |

Os dados de NFTs são simulados, e o carrinho e os pedidos utilizam armazenamento local no navegador.

O arquivo `mockServiceWorker.js` é necessário para o funcionamento da API simulada no navegador.

### Cenários de cupom

Para testar o comportamento da cotação, foram definidos os seguintes cupons fictícios:

| Cupom | Comportamento |
|---|---|
| `KURIO10` | Aplica desconto de 10% |
| `EXPIRED10` | Retorna mensagem de cupom expirado |
| Outros valores | Retornam cupom inválido |

A taxa de rede é simulada e não representa uma estimativa de custos reais de blockchain.

Os valores monetários da cotação são calculados com aritmética decimal baseada em `BigInt`, evitando erros comuns de precisão de ponto flutuante.

## Decisões técnicas

A estrutura do projeto busca separar responsabilidades entre componentes de interface, funcionalidades de domínio, rotas e comunicação HTTP.

O TanStack Router gerencia a navegação e os parâmetros de pesquisa. O TanStack Query gerencia o estado assíncrono das consultas e mutações, enquanto o Axios centraliza as requisições HTTP.

O MSW permite desenvolver e demonstrar os fluxos principais sem um servidor externo.

Para os valores em ETH, a aplicação utiliza representações decimais em string e conversão para unidades inteiras nos cálculos financeiros.

## Escopo e limitações conhecidas

O projeto foi desenvolvido sob um prazo limitado, e a estratégia adotada foi **priorizar a implementação e a validação de um fluxo funcional de ponta a ponta**, desde a descoberta de NFTs até a confirmação simulada de um pedido.

Essa decisão permitiu entregar uma aplicação executável, publicada e com testes automatizados, embora nem todos os requisitos do desafio tenham sido concluídos.

Permanecem como limitações:

- Autenticação, cadastro e gerenciamento de sessão ainda não implementados.
- Gerenciamento de favoritos por usuário não implementado.
- Perfil do colecionador e gerenciamento completo de carteiras pendentes.
- Integração de eventos em tempo real com Socket.IO pendente.
- Cenários completos de pagamento recusado e recuperação de falhas ainda não implementados.
- Dados e imagens dos NFTs ainda parcialmente simulados.
- Cobertura automatizada concentrada no carregamento e no fluxo principal de compra.
- Ausência de auditoria Lighthouse documentada.
- Persistência restrita ao navegador, sem armazenamento centralizado compartilhado.

A intenção foi preservar a integridade do que estava funcional, em vez de apresentar recursos incompletos como concluídos.

## Referências

- [Desafio técnico — Jungle Gaming](https://github.com/junglegaming/frontend-challenge)
- [Protótipo no Figma](https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=0-1)
- [Aplicação publicada](https://greenmint.vercel.app/)

---

Projeto desenvolvido como parte do desafio técnico de Front-end da Jungle Gaming.