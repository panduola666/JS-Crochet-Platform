const pendingOrders = document.querySelector('.pendingOrders');
const completedOrders = document.querySelector('.completedOrders');
const searchOrderId = document.querySelector('.searchOrderId');
const needSearchId = document.querySelector('#orderId');
const searchOrderTable = document.querySelector('.searchOrderTable');
let ordersData;
let goodsData;
adminNav.addEventListener('click', (e) => {
  if (e.target.textContent === '訂單管理') {
    Promise.all([axios.get(`${baseUrl}/orders`) , axios.get(`${baseUrl}/goods`)])
      .then(res => {
        ordersData = res[0].data;
        goodsData = res[1].data;
        renderOrders();
      });
  };
});
// 訂單詳情
searchOrderId.addEventListener('click', () => {
  const thisData = ordersData.filter(item=>item.id == needSearchId.value);
  if (!needSearchId.value) {
    searchOrderTable.innerHTML = `<tr>
    <td></td>
    <td>請輸入要查詢的訂單編號</td>
    <td class="text-start"></td>
    </tr>`;
    needSearchId.focus();
    return;
  };
  if (thisData.length === 0) {
    searchOrderTable.innerHTML = `<tr>
    <td></td>
    <td>沒有該筆訂單</td>
    <td class="text-start"></td>
    </tr>`;
    return;
  };
  const searchOrderMsgStr = [];
  const optionStr = [];
  goodsData.forEach(good => {
    thisData[0].boughtGoods.forEach(bought => {
      if (good.id === bought.goodId) {
        optionStr.includes(goodsOption(good)) ? optionStr : optionStr.push(goodsOption(good));
      };
    });
  });
  searchOrderMsgStr.push(`<tr>
    <td>${thisData[0].id}</td>
    <td>
        <select class="chooseMaterial">
        <option value="" selected hidden disabled>請選擇要查看的商品</option>
            ${optionStr.join('')}
        </select>
    </td>
    <td class="text-start showMaterial"></td>
    </tr>`);
  searchOrderTable.innerHTML = searchOrderMsgStr.join('');
  const chooseMaterial = document.querySelector('.chooseMaterial');
  const showMaterial = document.querySelector('.showMaterial');
  chooseMaterial.addEventListener('change', () => {
    const text = [];
    goodsData.forEach(good => {
      thisData[0].boughtGoods.forEach(bought => {
        if (good.title === chooseMaterial.value) {
          if (good.id === bought.goodId) text.push(show(good, bought));
        };
      });
    });
    showMaterial.innerHTML = text.join('');
  });
});

function show (good, bought) {
  const goodsMaterial = [];
  const text = [];
  if (good.type === '材料包') {
    goodsMaterial.push(...good.materials)
    goodsMaterial.forEach(item => {
      if (isNaN(parseInt(item[2]))) {
        item[2];
      } else {
        item[2] = parseInt(item[2]) * parseInt(bought.num);
      };
    });
    const obj = goodsMaterial.reduce((obj, item) => {
      obj[item[0]] ? obj[item[0]] += `${item[1]}*${item[2]}  ` : obj[item[0]] = `${item[1]}*${item[2]}  `;
      return obj;
    }, {});
    for (const key in obj) {
      text.push(`<p>${key} - ${obj[key]}</p>`);
    };
    text.push(`<p>2mm號簡易鉤針 *1</p>
      <p>DIY手工玩偶填充棉 *1</p>
      <p>記號扣 *3</p>`);
    return text.join('');
  } else {
    text.push(`<p>${bought.style} *${bought.num}</p>`);
    return text.join('');
  };
};

function goodsOption (good) {
  const text = [];
  const obj = {};
  obj[good.title] ? obj[good.title]++ : obj[good.title] = 1;
  for (const key in obj) {
    text.push(`<option value="${key}">${key}</option>`);
  };
  return text.join('');
};

// 訂單畫面
pendingOrders.addEventListener('click', (e) => {
  if (e.target.className === 'isTally') {
    let tallyTime = '';
    if (e.target.checked) tallyTime = new Date().getTime();
    axios.patch(`${baseUrl}/orders/${e.target.dataset.id}`, {
      isTally: e.target.checked,
      tallyTime: tallyTime
    });
  };
  if (e.target.className === 'pointer') {
    e.target.parentElement.previousElementSibling.children[0].focus();
  };
});

function renderOrders () {
  const pendingStr = [];
  const completedStr = [];
  ordersData.forEach(item => {
    if (item.state === '待處理') {
      pendingStr.push(
        `<tr>
            <td>${item.id}</td>
            <td>
                <select name="" id="" class="orderState" data-id="${item.id}">
                    <option value="待處理" selected>待處理</option>
                    <option value="已出貨">已出貨</option>
                    <option value="已取消">已取消</option>
                </select>
            </td>
            <td><input type="checkbox" class="isTally" data-id="${item.id}" ${item.isTally ? 'checked' : ''}></td>
            <td class="buyerInfo lhBigger" data-id="${item.id}">
                <p>${item.name}(${item.tel})</p>
                <p>${item.toShop.type} ( 店號:${item.toShop.shopNumber} )</p>
            </td>
            <td><input type="text" class="sendNumber" placeholder="請輸入寄件編號..." data-id="${item.id}"></td>
            <td><img src="/images/Vector.png" alt="修改" class="pointer"></td>
        </tr>`
      );
    }else{
        completedStr.push(
            `<tr>
            <td>${item.id}</td>
            <td>${item.state}</td>
            <td><input type="checkbox" name="" id="" checked disabled></td>
            <td class="lhBigger">
                <p>${item.name}(${item.tel})</p>
                <p>${item.toShop.type}　( 店號:${item.toShop.shopNumber} )</p>
            </td>
            <td><input type="text" value="${item.toShop.sendNumber}" disabled></td>
            </tr>`
        );
    };
  });
  pendingOrders.innerHTML = pendingStr.join('');
  completedOrders.innerHTML = completedStr.join('');
  orderStateChange();
};

// 改變審核狀態
function orderStateChange () {
  const orderState = document.querySelectorAll('.orderState');
  orderState.forEach(state => {
    state.addEventListener('change', () => {
      const thisInput = document.querySelector(` .sendNumber[data-id="${state.dataset.id}"] `);
      const thisTally = document.querySelector(` .isTally[data-id="${state.dataset.id}"] `);
      const thisBuyerInfo = document.querySelector(` .buyerInfo[data-id="${state.dataset.id}"] `);
      if (state.value === '已出貨' && thisInput.value === '') {
        state.value = '待處理';
        Swal.fire({
          icon: 'error',
          title: '寄件編號未填寫!'
        });
        return;
      };
      if (state.value === '已出貨' && !thisTally.checked) {
        state.value = '待處理';
        Swal.fire({
          icon: 'error',
          title: '理貨進度未完成!'
        });
        return;
      };
      let finishTime = '';
      if (state.value !== '待處理') finishTime = new Date().getTime();
      orderFinish(state, thisInput, thisBuyerInfo, finishTime);
    });
  });
};

async function orderFinish (state, thisInput, thisBuyerInfo, finishTime) {
  const data = {
    state: state.value,
    finishTime,
    toShop: {
      type: thisBuyerInfo.children[1].textContent.split(' ')[0],
      shopNumber: thisBuyerInfo.children[1].textContent.split(' ')[1].replace(/[^0-9]/g, ''),
      sendNumber: thisInput.value
    }
  };
  const res = await axios.patch(`${baseUrl}/orders/${state.dataset.id}`, data);
  const orders = await axios.get(`${baseUrl}/orders`);
  ordersData = orders.data;
  renderOrders();

  // 商品銷量更改
  const thisData = await axios.get(`${baseUrl}/orders/${state.dataset.id}`);
  const thisSellNum = thisData.data.boughtGoods.reduce((obj, item) => {
    obj[item.goodId] ? obj[item.goodId] += Number(item.num) : obj[item.goodId] = Number(item.num);
    return obj
  }, {});
  for (const key in thisSellNum) {
    axios.get(`${baseUrl}/goods/${key}`)
      .then(async res => {
        const sellNum = res.data.sellNum + thisSellNum[key];
        await axios.patch(`${baseUrl}/goods/${key}`,{sellNum})
      })
      .catch(err => {
        console.log(err);
      })
  };
};
