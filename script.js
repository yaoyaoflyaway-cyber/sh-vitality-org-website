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

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    const t = href && href.length > 1 ? document.querySelector(href) : null;
    if (!t) return;
    e.preventDefault();
    // 滚动期间关闭 reveal 过渡，避免穿过长区块时入场动画集中触发造成卡顿
    document.documentElement.classList.add('no-anim');
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    let endTimer;
    const onScroll = () => {
      clearTimeout(endTimer);
      endTimer = setTimeout(finish, 150);
    };
    const finish = () => {
      window.removeEventListener('scroll', onScroll);
      document.documentElement.classList.remove('no-anim');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(finish, 1600); // 兜底：防止 scrollEnd 未触发时一直挂着
  });
});

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

