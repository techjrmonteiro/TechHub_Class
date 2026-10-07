const DATA_URL = "./data/cursos.json";
const SITE_URL = "./data/site.json";
let DATA = { categorias: [], cursos: [] };
let SITE = {};
let searchTerm = "";
const app = document.querySelector("#main-content");
const nav = document.querySelector(".main-nav");
const menuButton = document.querySelector(".mobile-menu");
document.querySelector("#footer-year").textContent = new Date().getFullYear();

const icon = (name, extra = "") => `<i class="fa-solid ${escapeHTML(name || "fa-file")} ${extra}" aria-hidden="true"></i>`;
function escapeHTML(value = "") {
  return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}
function safeURL(value = "") {
  const url = String(value).trim();
  if (!url || url === "#") return "";
  if (/^(https?:\/\/|mailto:|\.{0,2}\/|\/)/i.test(url)) return url;
  return "";
}
async function loadData() {
  try {
    const [courseResponse, siteResponse] = await Promise.all([fetch(DATA_URL), fetch(SITE_URL)]);
    if (!courseResponse.ok) throw new Error("Falha ao carregar data/cursos.json");
    DATA = await courseResponse.json();
    SITE = siteResponse.ok ? await siteResponse.json() : {};
    router();
  } catch (error) {
    app.innerHTML = `<section class="empty error-box"><div class="empty-icon">${icon("fa-triangle-exclamation")}</div><h2>Não foi possível carregar o catálogo</h2><p>Confirme se os arquivos da pasta <code>data/</code> foram publicados corretamente e se o site está sendo aberto por um servidor web.</p></section>`;
    console.error(error);
  }
}
menuButton?.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(opened));
  menuButton.innerHTML = icon(opened ? "fa-xmark" : "fa-bars");
});
nav?.addEventListener("click", e => {
  if (e.target.closest("a")) {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    if (menuButton) menuButton.innerHTML = icon("fa-bars");
  }
});
function getCategory(id) { return DATA.categorias.find(x => x.id === id); }
function getCourse(id) { return DATA.cursos.find(x => x.id === id); }
function allClasses() { return DATA.cursos.flatMap(c => (c.turmas || []).map(t => ({...t, curso:c}))); }
function allDisciplines() { return allClasses().flatMap(t => (t.disciplinas || []).map(d => ({...d, turma:t, curso:t.curso}))); }
function countMaterials() {
  return DATA.cursos.reduce((sum,c) => sum + (c.turmas || []).reduce((sub,t) =>
    sub + (t.materiais || []).length + (t.disciplinas || []).reduce((n,d) => n + (d.materiais || []).length, 0), 0), 0);
}
function breadcrumb(items) {
  return `<div class="breadcrumbs"><a href="#/">Início</a>${items.map((item,i) => `<span>${item.href ? `<a href="${escapeHTML(item.href)}">${escapeHTML(item.label)}</a>` : escapeHTML(item.label)}</span>`).join("")}</div>`;
}
function courseCard(c) {
  const cat = getCategory(c.categoria);
  const classes = c.turmas || [];
  const firstClass = classes[0];
  return `<article class="course-card">
    <a class="course-card-link" href="#/curso/${escapeHTML(c.id)}">
      <div class="course-card-art"><div class="art-glow"></div><span class="course-art-icon">${icon(c.icone || "fa-laptop-code")}</span><span class="art-label">TECHHUB CLASS</span></div>
      <div class="course-card-content">
        <span class="badge badge-blue">${escapeHTML(cat?.nome || "Curso")}</span>
        <h3>${escapeHTML(c.nome)}</h3><p>${escapeHTML(c.descricao)}</p>
        ${firstClass ? `<div class="class-hint">${icon("fa-users")} <span>Turma: ${escapeHTML(firstClass.codigo)}</span></div>` : ""}
        <div class="course-card-bottom"><span>${icon("fa-folder-open")} Curso</span><span>${icon("fa-graduation-cap")} ${escapeHTML(cat?.nome || "")}</span><b aria-hidden="true">${icon("fa-arrow-right")}</b></div>
      </div>
    </a>
  </article>`;
}
function categoryCard(cat) {
  const total = DATA.cursos.filter(c => c.categoria === cat.id).length;
  return `<a class="category-card" href="#/categoria/${escapeHTML(cat.id)}">
    <span class="category-icon">${icon(cat.icone)}</span><h3>${escapeHTML(cat.nome)}</h3><span class="category-count">${total} ${total === 1 ? "curso" : "cursos"}</span>
  </a>`;
}
function renderHome() {
  const classes = allClasses().length;
  const disciplines = allDisciplines().length;
  app.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow"><span class="eyebrow-dot"></span> Plataforma de aprendizagem em TI</span>
        <div class="hero-brand"><img src="./assets/logo.svg" alt=""><div><span>Tech<strong>Hub</strong></span><small>CLASS</small></div></div>
        <h1>Seu futuro em tecnologia começa aqui!</h1>
        <p>${escapeHTML(SITE.descricao || "Cursos de TI com conteúdo organizado, acessível e direcionado para o seu desenvolvimento profissional.")}</p>
        <div class="hero-actions"><a class="btn btn-bright" href="#/cursos">${icon("fa-magnifying-glass")} Explorar cursos</a><a class="btn btn-glass" href="#/categorias">Ver categorias ${icon("fa-arrow-right")}</a></div>
        <div class="hero-trust"><span>${icon("fa-circle-check")} Conteúdo organizado</span><span>${icon("fa-graduation-cap")} Foco profissional</span></div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="visual-orbit orbit-one"></div><div class="visual-orbit orbit-two"></div>
        <div class="code-window"><div class="window-top"><span></span><span></span><span></span><b>techhub.js</b></div><div class="code-lines"><i>const</i> <b>aprendizado</b> = {<br><em>&nbsp; tecnologia:</em> <strong>"futuro"</strong>,<br><em>&nbsp; pratica:</em> <strong>true</strong>,<br><em>&nbsp; oportunidades:</em> <strong>"∞"</strong><br>};<br><br><i>function</i> <b>evoluir</b>() {<br>&nbsp; return <strong>"Seu próximo nível"</strong>;<br>}</div></div>
        <div class="float-chip chip-course">${icon("fa-graduation-cap")} Cursos de TI</div><div class="float-chip chip-files">${icon("fa-folder-open")} Materiais organizados</div><div class="float-chip chip-code">${icon("fa-code")} Aprenda fazendo</div>
      </div>
    </section>
    <section class="stats">
      <div class="stat"><span class="stat-icon">${icon("fa-book-open")}</span><div><strong>${DATA.cursos.length}</strong><small>Cursos cadastrados</small></div></div>
      <div class="stat"><span class="stat-icon">${icon("fa-users")}</span><div><strong>${classes}</strong><small>Turmas cadastradas</small></div></div>
      <div class="stat"><span class="stat-icon">${icon("fa-list-check")}</span><div><strong>${disciplines}</strong><small>Disciplinas técnicas</small></div></div>
      <div class="stat"><span class="stat-icon">${icon("fa-folder-open")}</span><div><strong>${countMaterials()}</strong><small>Áreas de materiais</small></div></div>
    </section>
    <section class="section">
      <div class="section-heading"><div><span class="eyebrow eyebrow-dark">Encontre seu caminho</span><h2>Categorias de cursos</h2><p>Escolha a modalidade que combina com seu próximo objetivo.</p></div></div>
      <div class="category-grid">${DATA.categorias.map(categoryCard).join("")}</div>
    </section>
    <section class="section">
      <div class="section-heading heading-row"><div><span class="eyebrow eyebrow-dark">Aprenda e avance</span><h2>Cursos em destaque</h2><p>Acesse cursos, turmas e seus conteúdos.</p></div><a class="text-link" href="#/cursos">Ver todos os cursos ${icon("fa-arrow-right")}</a></div>
      <div class="course-grid">${DATA.cursos.map(courseCard).join("")}</div>
    </section>
    <section class="cta-strip"><div class="cta-icon">${icon("fa-lightbulb")}</div><div><h2>Aprendizado organizado, no seu ritmo.</h2><p>Encontre os materiais da sua turma e continue desenvolvendo suas habilidades.</p></div><a class="btn btn-primary" href="#/cursos">Acessar catálogo ${icon("fa-arrow-right")}</a></section>`;
}
function renderCourses() {
  const q = searchTerm.trim().toLocaleLowerCase("pt-BR");
  const filtered = DATA.cursos.filter(c => !q || [c.nome,c.descricao,getCategory(c.categoria)?.nome].some(v => (v || "").toLocaleLowerCase("pt-BR").includes(q)));
  app.innerHTML = `${breadcrumb([{label:"Cursos"}])}<section class="page-heading"><span class="eyebrow eyebrow-dark">Catálogo completo</span><h1>Explore os cursos</h1><p>Pesquise por nome ou categoria para encontrar sua próxima etapa de aprendizagem.</p></section>
    <div class="search-panel"><label class="search-field">${icon("fa-magnifying-glass")}<input id="course-search" type="search" value="${escapeHTML(searchTerm)}" placeholder="Buscar cursos ou categorias..." aria-label="Buscar cursos"><kbd>⌕</kbd></label><span class="results-count">${filtered.length} resultados</span></div>
    <div class="course-grid section-grid">${filtered.length ? filtered.map(courseCard).join("") : `<div class="empty full-width"><div class="empty-icon">${icon("fa-magnifying-glass")}</div><h2>Nenhum curso encontrado</h2><p>Tente buscar por outro termo.</p></div>`}</div>`;
  const input = document.querySelector("#course-search");
  input?.addEventListener("input", e => { const pos = e.target.selectionStart; searchTerm = e.target.value; renderCourses(); const next = document.querySelector("#course-search"); next?.focus(); next?.setSelectionRange(pos,pos); });
}
function renderCategories() {
  app.innerHTML = `${breadcrumb([{label:"Categorias"}])}<section class="page-heading"><span class="eyebrow eyebrow-dark">Organize sua jornada</span><h1>Categorias</h1><p>Os cursos estão organizados por modalidade de formação.</p></section><div class="category-grid category-grid-large">${DATA.categorias.map(categoryCard).join("")}</div>`;
}
function renderCategory(id) {
  const cat = getCategory(id); if (!cat) return renderNotFound();
  const list = DATA.cursos.filter(c => c.categoria === id);
  app.innerHTML = `${breadcrumb([{label:"Categorias",href:"#/categorias"},{label:cat.nome}])}<section class="page-heading"><span class="eyebrow eyebrow-dark">${icon(cat.icone)} Categoria</span><h1>${escapeHTML(cat.nome)}</h1><p>${escapeHTML(cat.descricao)}</p></section>
    ${list.length ? `<div class="course-grid">${list.map(courseCard).join("")}</div>` : `<div class="empty"><div class="empty-icon">${icon("fa-folder-open")}</div><h2>Nenhum curso cadastrado</h2><p>Esta categoria ainda não possui cursos.</p></div>`}`;
}
function renderCourse(id) {
  const c = getCourse(id); if (!c) return renderNotFound();
  const cat = getCategory(c.categoria), classes = c.turmas || [], technical = c.categoria === "tecnico";
  app.innerHTML = `${breadcrumb([{label:"Cursos",href:"#/cursos"},{label:c.nome}])}
    <section class="detail-hero"><div class="detail-icon">${icon(c.icone || "fa-laptop-code")}</div><div class="detail-copy"><span class="badge badge-blue">${escapeHTML(cat?.nome || "")}</span><h1>${escapeHTML(c.nome)}</h1><p>${escapeHTML(c.descricao)}</p><div class="detail-meta"><span>${icon("fa-circle-check")} ${escapeHTML(c.status || "Ativo")}</span><span>${icon("fa-users")} ${classes.length} ${classes.length === 1 ? "turma" : "turmas"}</span>${technical ? `<span>${icon("fa-list-check")} Conteúdo por disciplina</span>` : ""}</div></div></section>
    <section class="section"><div class="section-heading"><div><span class="eyebrow eyebrow-dark">Acesso ao conteúdo</span><h2>Turmas disponíveis</h2><p>Abra uma turma para consultar seus materiais e disciplinas.</p></div></div>
    ${classes.length ? `<div class="data-list">${classes.map(t => `<article class="data-row"><div class="row-icon">${icon("fa-users")}</div><div class="row-copy"><h3>${escapeHTML(t.nome)}</h3><p>${escapeHTML(t.codigo)} · ${escapeHTML(t.periodo || "")}</p></div><div class="row-end">${technical && t.disciplinas?.length ? `<span class="badge">${t.disciplinas.length} disciplinas</span>` : ""}<a class="btn btn-primary btn-small" href="#/turma/${escapeHTML(t.id)}">Abrir turma ${icon("fa-arrow-right")}</a></div></article>`).join("")}</div>` : `<div class="empty"><div class="empty-icon">${icon("fa-users")}</div><h2>Nenhuma turma cadastrada</h2><p>As turmas deste curso serão exibidas aqui quando forem adicionadas ao catálogo.</p></div>`}</section>`;
}
function materialList(materials) {
  if (!materials?.length) return `<div class="empty compact"><div class="empty-icon">${icon("fa-folder-open")}</div><h2>Nenhum material cadastrado</h2><p>Os arquivos adicionados ao catálogo aparecerão aqui.</p></div>`;
  return `<div class="materials-list">${materials.map(m => {
    const url = safeURL(m.url);
    return `<article class="material-row"><div class="material-type">${icon(m.tipo?.toLowerCase().includes("pdf") ? "fa-file-pdf" : m.tipo?.toLowerCase().includes("planilha") ? "fa-file-excel" : m.tipo?.toLowerCase().includes("pasta") ? "fa-folder" : "fa-file-lines")}</div><div class="material-copy"><h3>${escapeHTML(m.nome)}</h3><p>${escapeHTML(m.descricao || "")}${m.tamanho ? ` · ${escapeHTML(m.tamanho)}` : ""}</p></div><div class="material-action">${url ? `<a class="btn btn-primary btn-small" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">Abrir arquivo ${icon("fa-arrow-up-right-from-square")}</a>` : `<span class="badge badge-muted">Em breve</span>`}</div></article>`;
  }).join("")}</div>`;
}
function renderClass(id) {
  const t = allClasses().find(x => x.id === id); if (!t) return renderNotFound();
  const technical = t.curso.categoria === "tecnico";
  app.innerHTML = `${breadcrumb([{label:t.curso.nome,href:`#/curso/${t.curso.id}`},{label:t.codigo}])}
    <section class="page-heading"><span class="eyebrow eyebrow-dark">${icon("fa-users")} Página da turma</span><h1>${escapeHTML(t.nome)}</h1><p>${escapeHTML(t.descricao || "")}</p></section>
    <div class="detail-layout"><section class="content-panel"><div class="panel-heading"><div><h2>${technical ? "Disciplinas da turma" : "Materiais da turma"}</h2><p>${technical ? "Cada disciplina possui uma página própria com seus materiais." : "Arquivos, atividades e referências disponíveis para esta turma."}</p></div></div>
    ${technical ? ((t.disciplinas || []).length ? `<div class="data-list">${t.disciplinas.map(d => `<article class="data-row"><div class="row-icon">${icon("fa-book-open")}</div><div class="row-copy"><h3>${escapeHTML(d.nome)}</h3><p>${escapeHTML(d.cargaHoraria || "Carga horária a definir")} · ${escapeHTML(d.descricao || "")}</p></div><div class="row-end"><a class="btn btn-primary btn-small" href="#/disciplina/${escapeHTML(d.id)}">Ver disciplina ${icon("fa-arrow-right")}</a></div></article>`).join("")}</div>` : `<div class="empty compact"><h2>Disciplinas em breve</h2><p>As disciplinas desta turma ainda não foram cadastradas.</p></div>`) : materialList(t.materiais)}
    </section><aside class="content-panel side-panel"><h2>Detalhes da turma</h2><div class="detail-fact"><span>Curso</span><strong>${escapeHTML(t.curso.nome)}</strong></div><div class="detail-fact"><span>Código</span><strong>${escapeHTML(t.codigo)}</strong></div><div class="detail-fact"><span>Status</span><strong><i class="fa-solid fa-circle status-dot" aria-hidden="true"></i> ${escapeHTML(t.status || "Ativa")}</strong></div><div class="detail-fact"><span>Período</span><strong>${escapeHTML(t.periodo || "Não informado")}</strong></div></aside></div>`;
}
function renderDiscipline(id) {
  const d = allDisciplines().find(x => x.id === id); if (!d) return renderNotFound();
  app.innerHTML = `${breadcrumb([{label:d.curso.nome,href:`#/curso/${d.curso.id}`},{label:d.turma.codigo,href:`#/turma/${d.turma.id}`},{label:d.nome}])}
    <section class="page-heading"><span class="eyebrow eyebrow-dark">${icon("fa-book-open")} Disciplina técnica</span><h1>${escapeHTML(d.nome)}</h1><p>${escapeHTML(d.descricao || "")}</p></section>
    <div class="detail-layout"><section class="content-panel"><div class="panel-heading"><div><h2>Materiais da disciplina</h2><p>Apostilas, arquivos, atividades e recursos de aprendizagem.</p></div></div>${materialList(d.materiais)}</section>
    <aside class="content-panel side-panel"><h2>Detalhes da disciplina</h2><div class="detail-fact"><span>Curso</span><strong>${escapeHTML(d.curso.nome)}</strong></div><div class="detail-fact"><span>Turma</span><strong>${escapeHTML(d.turma.codigo)}</strong></div><div class="detail-fact"><span>Carga horária</span><strong>${escapeHTML(d.cargaHoraria || "A definir")}</strong></div><a class="btn btn-outline btn-block" href="#/turma/${escapeHTML(d.turma.id)}">${icon("fa-arrow-left")} Voltar para turma</a></aside></div>`;
}
function renderAbout() {
  app.innerHTML = `${breadcrumb([{label:"Sobre"}])}<section class="page-heading"><span class="eyebrow eyebrow-dark">Sobre a plataforma</span><h1>Conhecimento que conecta você ao futuro.</h1><p>O TechHub Class organiza cursos e materiais de Tecnologia da Informação em uma experiência simples e acessível.</p></section>
    <div class="about-grid"><article class="content-panel"><div class="about-icon">${icon("fa-diagram-project")}</div><h2>Orientado a dados</h2><p>Os dados de cursos, turmas, disciplinas e materiais ficam em arquivos JSON separados da interface. Assim, o catálogo pode crescer sem criar uma página HTML para cada item.</p></article><article class="content-panel"><div class="about-icon">${icon("fa-cloud-arrow-up")}</div><h2>Pronto para GitHub Pages</h2><p>O site usa HTML, CSS e JavaScript sem backend. Publique os arquivos em um repositório e ative o GitHub Pages para disponibilizar o catálogo.</p></article></div>
    <div class="note-box">${icon("fa-circle-info")} <span>Para adicionar materiais, edite <code>data/cursos.json</code> e informe a URL pública do arquivo no campo <code>url</code>.</span></div>`;
}
function renderNotFound() {
  app.innerHTML = `<section class="not-found"><div class="not-found-symbol">${icon("fa-compass")}</div><span class="eyebrow eyebrow-dark">Ops! Página não encontrada</span><h1>Não encontramos esse conteúdo.</h1><p>O endereço pode estar incorreto ou o conteúdo ainda não foi cadastrado.</p><a class="btn btn-primary" href="#/">Voltar ao início ${icon("fa-arrow-right")}</a></section>`;
}
function updateNav() {
  const hash = location.hash || "#/";
  document.querySelectorAll(".main-nav a").forEach(a => {
    const href = a.getAttribute("href");
    a.classList.toggle("active", href === "#/" ? hash === "#/" : hash.startsWith(href));
  });
}
function router() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [path,id] = raw.split("/");
  if (path !== "cursos") searchTerm = "";
  if (!path) renderHome();
  else if (path === "cursos") renderCourses();
  else if (path === "categorias") renderCategories();
  else if (path === "categoria" && id) renderCategory(id);
  else if (path === "curso" && id) renderCourse(id);
  else if (path === "turma" && id) renderClass(id);
  else if (path === "disciplina" && id) renderDiscipline(id);
  else if (path === "sobre") renderAbout();
  else renderNotFound();
  updateNav();
  window.scrollTo({top:0,behavior:"instant"});
}
window.addEventListener("hashchange", router);
loadData();
