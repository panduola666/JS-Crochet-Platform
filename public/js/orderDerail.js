const orderDetails = document.querySelector('.orderDetails');
const nowHref = location.href.split('/');
let orderData;
let goodsData;
if (localStorage.getItem('userId')) {
  if (nowHref[nowHref.length - 2] !== localStorage.getItem('userId')) {
    location.href = `/myOrder/${localStorage.getItem('userId')}`;
  };
  Promise.all([axios.get(`${baseUrl}/orders/${nowHref[nowHref.length - 1]}`), axios.get(`${baseUrl}/goods`)])
    .then(res => {
      orderData = res[0].data;
      goodsData = res[1].data;
      orderDetails.innerHTML = `
    <div class="d-flex align-items-center justify-content-between border-bottom border-dark pb-3">
    <h4>寄件編號:${orderData.toShop.sendNumber}</h4>
    <p class="d-flex flex-wrap">訂單編號:<span>${orderData.id}</span></p>
  </div>
  <div class="steps">
    <div class="d-flex align-content-center justify-content-between flex-grow-1">
      <div class="orderStep">
        <img src="${'https://github.com/panduola666/2022JS-/blob/main/public/images/order_primary.png?raw=true'}" alt="">
        <p>訂單已生成</p>
        <p class="small">${new Date(orderData.createTime).toLocaleDateString().replace(/\//g, '-')}</p>
      </div>
      <div class="stepsLine"></div>
      <div class="storeHouseStep">
        <img src="${orderData.isTally ? 'https://github.com/panduola666/2022JS-/blob/main/public/images/storehouse_primary.png?raw=true' : 'https://github.com/panduola666/2022JS-/blob/main/public/images/storehouse.png?raw=true'}" alt="">
        <p>理貨${orderData.isTally ? '完畢' : '中'}</p>
        <p class="small">${orderData.tallyTime === '' ? '' : new Date(orderData.tallyTime).toLocaleDateString().replace(/\//g, '-')}</p>
      </div>
      <div class="stepsLine"></div>
      <div class="logisticsStep">
        <img src="${orderData.isTally ? 'https://github.com/panduola666/2022JS-/blob/main/public/images/logistics_primary.png?raw=true' : 'https://github.com/panduola666/2022JS-/blob/main/public/images/logistics.png?raw=true'}" alt="">
        <p>訂單${orderData.state}</p>
        <p class="small">${orderData.finishTime === '' ? '' : new Date(orderData.finishTime).toLocaleDateString().replace(/\//g, '-')}</p>
      </div>
      <div class="stepsLine"></div>
      <div class="homeStep">
        <img src="${orderData.state === '待處理' ? 'https://github.com/panduola666/2022JS-/blob/main/public/images/home.png?raw=true' : 'https://github.com/panduola666/2022JS-/blob/main/public/images/home_primary.png?raw=true'}" alt="">
        <p>${orderData.state}</p>
        <p class="small">${orderData.finishTime === '' ? '' : new Date(orderData.finishTime).toLocaleDateString().replace(/\//g, '-')}</p>
      </div>
    </div>
    <div class="d-flex flex-column justify-content-between flex-grow-1">
      <p class="h4Size mt-3 mt-lg-0 d-flex justify-content-between">商品總額:<span>$${orderData.totalPrice - 60}</span></p>
      <p class="h4Size mt-3 mt-lg-0 d-flex justify-content-between">運費總額:<span>$60</span></p>
      <p class="h4Size mt-3 mt-lg-0 d-flex justify-content-between">付款總額:<span
          class="primaryColor">$${orderData.totalPrice}</span>
      </p>
    </div>
  </div>
  <div class="recipientInfo p-3">
    <p class="h3Size mb1">收件信息</p>
    <div class="d-flex align-items-sm-center justify-content-around flex-wrap text-center">
      <p>${orderData.name}</p>
      <p>${orderData.tel}</p>
      <p class="flex-shrink-0 me-sm-3">${orderData.toShop.type}<span class="small">(店號${orderData.toShop.shopNumber})</span></p>
      <p>付款方式:${typeof orderData.payMethod === 'string' ? orderData.payMethod : '信用卡'}</p>
    </div>
  </div>
  <ul class="orderGoods">
  ${renderBoughtGoods()}
  </ul>
  <div class="d-flex  justify-content-between p-3 border-top border-dark">
    <p>${orderData.boughtGoods.length}商品</p>
    <p>訂單金額:<span class="primaryColor h3Size">$${orderData.totalPrice}</span></p>
  </div>`;
    })
    .catch(() => clearLogin());
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

function renderBoughtGoods () {
  const text = [];
  goodsData.forEach(good => {
    orderData.boughtGoods.forEach(boughtGood => {
      if (good.id === boughtGood.goodId) {
        text.push(`<li class="row py-3">
        <img src="${good.cover}" alt="" class="col-5 col-sm-4 col-lg-3">
        <div class="col d-flex justify-content-between flex-column">
          <p class="h2Size">${good.title}</p>
          <p class="text-end h3Size">${boughtGood.style}　x${boughtGood.num}</p>
          <p class="secondaryColor h2Size text-end">$${good.price * boughtGood.num}</p>
        </div>
      </li>`);
      }
    });
  });
  return text.join('');
};
