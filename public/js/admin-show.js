const adminNav = document.querySelector('.adminNav');
const adminNavLis = adminNav.querySelectorAll('li');
const commodityManagement = document.querySelector('.commodityManagement');
const ordersManagement = document.querySelector('.ordersManagement');
const userSellAudit = document.querySelector('.userSellAudit');
const withdrawalApplication = document.querySelector('.withdrawalApplication');

adminNav.addEventListener('click', (e) => {
  adminNavLis.forEach(li => li.classList.remove('active'));
  e.target.classList.add('active');
  if (e.target.textContent === '商品管理') {
    commodityManagement.style.display = 'block';
    ordersManagement.style.display = 'none';
    userSellAudit.style.display = 'none';
    withdrawalApplication.style.display = 'none';
    return;
  };
  if (e.target.textContent === '訂單管理') {
    commodityManagement.style.display = 'none';
    ordersManagement.style.display = 'block';
    userSellAudit.style.display = 'none';
    withdrawalApplication.style.display = 'none';
    return;
  };
  if (e.target.textContent === '材料包審核') {
    commodityManagement.style.display = 'none';
    ordersManagement.style.display = 'none';
    userSellAudit.style.display = 'block';
    withdrawalApplication.style.display = 'none';
    return;
  };
  if (e.target.textContent === '收益提領審核') {
    commodityManagement.style.display = 'none';
    ordersManagement.style.display = 'none';
    userSellAudit.style.display = 'none';
    withdrawalApplication.style.display = 'block';
    return;
  };
});
