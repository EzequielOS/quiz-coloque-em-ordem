# Quiz: Colocando a Casa em Ordem

Projeto de quiz estático voltado para jovens (≥17 anos). Cada pergunta vale 10 pontos. Ao final a pontuação total é exibida.

Como usar
- Abra `index.html` localmente no navegador (ou hospede pelo GitHub Pages).
- O arquivo `questions.json` contém as perguntas (já incluído no repositório).

Deploy automático (GitHub Pages)
1. O workflow GitHub Actions em `.github/workflows/deploy.yml` publica o site na branch `gh-pages` sempre que você der push na `main`.
2. Certifique-se de que a branch padrão do repositório é `main`. O token do Actions (`GITHUB_TOKEN`) já é usado pela action.
3. Nas configurações do repositório → Pages, escolha a branch `gh-pages` (se necessário).

Se quiser que eu crie o commit e faça o push, autorize e eu preparo os comandos.
