/**
 * 完成
 * 待優化
 */
const shoppingList = document.querySelector('.shoppingList');
const totalPrice = document.querySelector('.totalPrice');

let userData;
axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, headers)
  .then(res => {
    userData = res.data;
    shoppingCarInit();
    totalPrice.children[1].addEventListener('click', () => {
      if (userData.shoppingCar.length === 0) {
        Swal.fire({
          icon: 'error',
          title: '購物車內沒有商品',
          text: '請添加購買商品'
        });
        return;
      }
      localStorage.setItem('shoppingTotalPrice', totalPrice.children[0].children[0].textContent.split('$')[1] );
      location.href = `/shoppingPay/${userData.id}`;
    });
  })
  .catch(err => {
    if (err.request.status === 403) {
      document.location.href = `/user/${localStorage.getItem('userId')}`;
    } else if (err.request.status === 401) {
      clearLogin();
    };
  });

// 基本畫面渲染
async function shoppingCarInit () {
  const text = [];
  const res = await axios.get(`${baseUrl}/goods`);
  res.data.forEach(item => {
    userData.shoppingCar.forEach(work => {
      if (item.id === work.goodId) {
        text.push(`<li class="row" data-goodId=${item.id}>
        <img src="${item.cover}" alt="${item.title}" class="d-none d-sm-block col">
        <div class="col-10 col-sm m-auto m-md-0">
          <h3 class="h2Size my1">${item.title}</h3>
          <p class="h3Size mb-5">${work.style}</p>
          <p class="h2Size text-end primaryColor goodsTotalPrice">$${item.price * work.num}</p>
        </div>
        <div class="col-12 col-md-3 d-flex flex-column justify-content-between mt1">
          <p class="h2Size text-end pe-3"><span class="pointer deleteShoppingGoods">X</span></p>
          <div class=" shoppingBTN pe-3">
            <button type="button">-</button>
            <label for="" aria-label="購買數量">
              <input type="number" name="" id="" min="0" value="${work.num}">
            </label>
            <button type="button">+</button>
          </div>
        </div>
      </li>`);
      };
    });
  });
  shoppingList.innerHTML = text.join('');
  shoppingNumChange();
  deleteShoppingGoods();
  addTotalPrice();
}

// 改變購買個數 + 直接改變userData.shoppingCar內容
function shoppingNumChange () {
  const shoppingBTN = document.querySelectorAll('.shoppingBTN');
  shoppingBTN.forEach(btn => {
    const goodsPrice = btn.parentElement.previousElementSibling.children[2].textContent.split('$')[1] / btn.children[1].children[0].value;
    btn.addEventListener('click', (e) => {
      const parent = btn.parentElement.parentElement;
      if (e.target.nodeName === 'BUTTON') {
        if (e.target.textContent === '-') {
          btn.children[1].children[0].value > 1 ? btn.children[1].children[0].value-- : btn.children[1].children[0].value;
          userData.shoppingCar.forEach((item) => {
            if (item.goodId === Number(parent.dataset.goodid)) {
              item.num = btn.children[1].children[0].value;
            };
          });
          axios.patch(`${baseUrl}/600/users/${userData.id}`, {
            shoppingCar: userData.shoppingCar
          }, headers);
        } else if (e.target.textContent === '+') {
          btn.children[1].children[0].value++;
          userData.shoppingCar.forEach(item => {
            if (item.goodId === Number(parent.dataset.goodid)) {
              item.num = btn.children[1].children[0].value;
            };
          });
          axios.patch(`${baseUrl}/600/users/${userData.id}`, {
            shoppingCar: userData.shoppingCar
          }, headers);
        };
        btn.parentElement.previousElementSibling.children[2].textContent = `$${goodsPrice * btn.children[1].children[0].value}`;
        addTotalPrice();
      };
    });
  });
};

// 刪除購物車商品
function deleteShoppingGoods () {
  const deleteShoppingGoods = document.querySelectorAll('.deleteShoppingGoods');
  deleteShoppingGoods.forEach(deleteGoods => {
    deleteGoods.addEventListener('click', () => {
      const parent = deleteGoods.parentElement.parentElement.parentElement;
      parent.remove();
      userData.shoppingCar.forEach(item => {
        if (item.goodId === Number(parent.dataset.goodid)) {
          const index = userData.shoppingCar.indexOf(item);
          userData.shoppingCar.splice(index, 1);
          axios.patch(`${baseUrl}/600/users/${userData.id}`, {
            shoppingCar: userData.shoppingCar
          }, headers)
            .then(res => {
              const shoppingCarLength = res.data.shoppingCar.length;
              shoppingCarIcon.nextElementSibling.textContent = shoppingCarLength > 9 ? '9+' : shoppingCarLength;
            });
        };
      });
      addTotalPrice();
    });
  });
};
function addTotalPrice () {
  const goodsTotalPrice = document.querySelectorAll('.goodsTotalPrice');
  let total = 0;
  goodsTotalPrice.forEach(item => {
    total += Number(item.textContent.split('$')[1]);
  });
  totalPrice.children[0].innerHTML = `總金額(${userData.shoppingCar.length}個商品):<span class="h1Size primaryColor">$${total}</span>`;
};
