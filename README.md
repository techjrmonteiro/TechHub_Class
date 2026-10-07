# TechHub Class

Site estático orientado a dados para cursos de Tecnologia da Informação, pronto para GitHub Pages.

## Arquivos

- `index.html`: estrutura principal do site.
- `404.html`: página de erro.
- `assets/app.js`: navegação e renderização dinâmica.
- `assets/style.css`: estilos responsivos e paleta visual.
- `assets/logo.svg`: logo vetorial personalizado, usado no header e no favicon.
- `data/site.json`: informações gerais.
- `data/cursos.json`: categorias, cursos, turmas, disciplinas e materiais.
- `materiais/`: diretório opcional para arquivos que serão publicados junto ao site.

## Ícones e logo

Os ícones da interface usam Font Awesome 6 Free via CDN. É necessária conexão com a internet para carregar a biblioteca. O logo é um SVG original e local, portanto também funciona como favicon sem dependência externa.

## Catálogo cadastrado

- Aperfeiçoamento Profissional: Técnicas em Informática; Excel Avançado (turma APP.392.170).
- Qualificação Profissional: Operador de Computadores.
- Técnico: Desenvolvimento de Sistemas; Informática (turma TEC.032.038; disciplina Instalação e Manutenção de Redes SOHO).
- Aprendizagem Industrial e Iniciação Profissional estão cadastradas como categorias e prontas para receber cursos.

## Adicionar materiais

Edite `data/cursos.json` e acrescente objetos à lista `materiais` de uma turma ou disciplina. Exemplo:

```json
{
  "id": "aula-01",
  "nome": "Aula 01 — Introdução",
  "tipo": "PDF",
  "descricao": "Material de apoio da aula.",
  "url": "./materiais/aula-01.pdf",
  "tamanho": "2 MB"
}
```

O endereço pode ser um caminho relativo para arquivo publicado no repositório ou uma URL pública HTTPS. Não coloque dados pessoais ou arquivos confidenciais em repositórios públicos.

## Executar localmente

Como o catálogo é carregado com `fetch()`, abra o projeto usando um servidor HTTP local (não abra `index.html` diretamente como `file://`). Uma opção é a extensão Live Server no VS Code.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos desta pasta para a raiz do repositório.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch principal e a pasta **/(root)**.
6. Salve e aguarde a publicação.

As páginas internas usam hash routes (`#/curso/informatica`) para funcionar sem configuração adicional no servidor.
