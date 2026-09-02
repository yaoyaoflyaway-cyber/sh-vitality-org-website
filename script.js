// Hero 背景：LQIP 模糊底图即时显示，WebP 加载完成后切换为清晰图
(function () {
  const heroBg = document.getElementById('heroBg');
  if (!heroBg) return;
  const full = new Image();
  full.onload = () => heroBg.classList.add('loaded');
  full.src = 'images/hero-bg-grid.webp';
  if (full.complete) heroBg.classList.add('loaded');
})();

// 导航栏滚动效果
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// 移动端菜单
navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navMenu.classList.remove('active')));

// 锚点跳转交回浏览器原生行为（瞬间到位，不经过长区块动画，避免卡顿）

// 滚动揭示动画
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

// InfluenceClaw 数字员工手机：底部导航切换页面
(function () {
  var navTabs = document.querySelectorAll('.ic-nav-tab');
  var pages = {
    staff: document.getElementById('icPageStaff'),
    config: document.getElementById('icPageConfig'),
    influence: document.getElementById('icPageInfluence'),
    skills: document.getElementById('icPageSkills'),
    profile: document.getElementById('icPageProfile')
  };
  var title = document.getElementById('icDeTitle');
  var titles = { staff: '数字员工', config: '配置中心', influence: '影响力中心', skills: '技能商店', profile: '我的' };
  navTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var p = tab.getAttribute('data-page');
      Object.keys(pages).forEach(function (k) {
        if (pages[k]) pages[k].style.display = (k === p) ? 'block' : 'none';
      });
      navTabs.forEach(function (t) {
        t.classList.toggle('active', t.getAttribute('data-page') === p);
      });
      if (title && titles[p]) title.textContent = titles[p];
    });
  });
})();

// 案例区左右滑动按钮
(function () {
  var scroller = document.querySelector('.case-scroller');
  if (!scroller) return;
  var grid = scroller.querySelector('.case-grid');
  var prev = scroller.querySelector('.case-arrow--prev');
  var next = scroller.querySelector('.case-arrow--next');
  if (!grid || !prev || !next) return;
  var step = function () { return Math.max(248, Math.round(grid.clientWidth * 0.8)); };
  var update = function () {
    var max = grid.scrollWidth - grid.clientWidth;
    prev.disabled = grid.scrollLeft <= 1;
    next.disabled = grid.scrollLeft >= max - 1;
    scroller.classList.toggle('is-static', max <= 1);
  };
  prev.addEventListener('click', function () { grid.scrollBy({ left: -step(), behavior: 'smooth' }); });
  next.addEventListener('click', function () { grid.scrollBy({ left: step(), behavior: 'smooth' }); });
  grid.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();


// === 手机端长文案折叠（仅 ≤620，按指定句末文字锚点截断） ===
(function () {
  // 目标容器 + 截断锚点文字（cutText 必须能在单个 text node 中匹配）
  var TARGETS = [
    { sel: '.standard-story',     host: '.standard-layout',  cut: '打造覆盖影响力识别、人格化建模、内容创作、流量获客与业务增长的智能化赋能体系。' },
    { sel: '.highlight-story',    host: '.highlight-story',  cut: '沉淀为可复用的人格模型' },
    { sel: '.course-intro-inner', host: '.course-intro',     cut: '一场从旧经济模式向新经济模式的转型正在发生' },
    { sel: '.camp-lead',          host: '.camp-lead',        cut: '大量补课成为很多家庭的负担。' },
    { sel: '.about-intro',        host: '.about-intro',      cut: '打造覆盖影响力识别、人格化建模、内容创作、流量获客与业务增长的智能化赋能体系' },
  ];

  function isMobile() { return window.innerWidth <= 620; }

  // 在 box 内找到第一个文本节点包含 cutText 的位置，
  // 沿父级链逐层向上把 firstAfter 之后的兄弟（含跨标签后续内容、后续段落）全部移入 .fold-tail-text
  function foldByText(box, cutText) {
    var walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, null);
    var node, hit = null;
    while ((node = walker.nextNode())) {
      var i = node.textContent.indexOf(cutText);
      if (i >= 0) { hit = { node: node, end: i + cutText.length }; break; }
    }
    if (!hit) return false;
    var firstAfter = hit.node.splitText(hit.end);
    var tail = document.createElement('span');
    tail.className = 'fold-tail-text';
    firstAfter.parentNode.insertBefore(tail, firstAfter);
    function drain(n) {
      while (n) {
        var nx = n.nextSibling;
        tail.appendChild(n);
        n = nx;
      }
    }
    drain(firstAfter);
    var cur = firstAfter.parentNode;
    while (cur && cur !== box) {
      drain(cur.nextSibling);
      cur = cur.parentNode;
    }
    return true;
  }

  function init() {
    if (!isMobile()) return;
    TARGETS.forEach(function (t) {
      var box = document.querySelector(t.sel);
      if (!box || box.dataset.txtInit) return;
      box.dataset.txtInit = '1';
      var host = box.closest(t.host) || box;
      foldByText(box, t.cut);
      host.classList.add('text-collapsed');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'text-toggle';
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', function () {
        var expanded = host.classList.toggle('text-expanded');
        host.classList.toggle('text-collapsed', !expanded);
        btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      });
      host.appendChild(btn);
    });
  }

  // 桌面端：把 JS 注入的所有标记还原（DOM 复原，文案完整）
  function cleanup() {
    document.querySelectorAll('.text-collapsed, .text-expanded').forEach(function (el) {
      el.classList.remove('text-collapsed', 'text-expanded');
    });
    document.querySelectorAll('.text-toggle').forEach(function (b) { b.remove(); });
    document.querySelectorAll('.fold-tail-text').forEach(function (s) {
      var parent = s.parentNode;
      while (s.firstChild) parent.insertBefore(s.firstChild, s);
      parent.removeChild(s);
    });
    TARGETS.forEach(function (t) {
      var el = document.querySelector(t.sel);
      if (!el) return;
      try { delete el.dataset.txtInit; } catch (e) { el.dataset.txtInit = ''; }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (isMobile()) init(); else cleanup();
    }, 200);
  });
})();
