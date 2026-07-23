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
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
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

