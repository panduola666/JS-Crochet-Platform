/**
 * 完成
 */
const orderList = document.querySelector('.orderList');
const nowHref = location.href.split('/');
let ordersData;
let goodsData;
if (localStorage.getItem('userId')) {
  if (nowHref[nowHref.length - 1] !== localStorage.getItem('userId')) {
    location.href = `/myOrder/${localStorage.getItem('userId')}`;
  };
  Promise.all([axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}?_embed=orders`, headers), axios.get(`${baseUrl}/goods`)])
    .then(res => {
      ordersData = res[0].data.orders;
      goodsData = res[1].data;
      const text = [];
      ordersData.forEach(item => {
        text.push(`<li class="p-3">
        <div class="d-flex justify-content-between py-1 align-items-center flex-wrap mb-3">
          <p>訂單${item.state}</p>
          <p>訂單編號:${item.id}</p>
        </div>
        ${renderBoughtGoods(item)}
        <div class="d-flex justify-content-between pt-3 align-items-sm-center flex-column flex-sm-row">
          <p class="mb-3 mb-sm-0">${item.boughtGoods.length}商品</p>
          <p class="mb-3 mb-sm-0 h3Size">訂單金額:<span class="primaryColor ms-3">$${renderTotalPrice(item)}</span></p>
          <button type="button" data-order="${item.id}"}>訂單詳情</button>
        </div>
      </li>`);
      });
      orderList.innerHTML = text.join('');
    })
    .catch(err => {
      if (err.request.status === 403) {
        document.location.href = `/user/${localStorage.getItem('userId')}`;
      } else if (err.request.status === 401) {
        clearLogin();
      };
    });

  orderList.addEventListener('click', (e) => {
    if (e.target.nodeName === 'BUTTON') location.href = `/orderDerail/${localStorage.getItem('userId')}/${e.target.dataset.order}`;
  });
} else {
  // 未登入
  Swal.fire({
    icon: 'error',
    title: '登入過期!',
    text: '請重新登入'
  });
  setTimeout(() => {
    document.location.href = '/login';
  }, 2000);
}

function renderBoughtGoods (item) {
  const str = [];
  item.boughtGoods.forEach(boughtGood => {
    goodsData.forEach(good => {
      if (good.id === boughtGood.goodId) {
        str.push(`<div
        class="py-1 mb-3 d-flex justify-content-between align-items-sm-center border-top border-dark flex-column flex-sm-row">
        <h3 class="h3Size">${good.title}</h3>
        <p class="h4Size">${boughtGood.style}x${boughtGood.num}</p>
        <p class="h2Size text-end">$${Number(good.price) * Number(boughtGood.num)}</p>
      </div>`);
      };
    });
  });
  return str.join('');
};

function renderTotalPrice (item) {
  let num = 0;
  item.boughtGoods.forEach(boughtGood => {
    goodsData.forEach(good => {
      if (good.id === boughtGood.goodId) {
        num += Number(good.price) * Number(boughtGood.num);
      };
    });
  });
  return num;
};
