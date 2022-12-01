// 收件人信息
// '2px solid red':'1px solid #1F0707';
const buyerInfo = document.querySelector('.buyerInfo');
const payMethod = document.querySelector('.payMethod');
const payByCardNum = document.querySelector('.payByCardNum');
const goodsPrice = document.querySelector('.goodsPrice');
const endPrice = document.querySelector('.endPrice');
const totalPrice = document.querySelector('.totalPrice');
const marks = document.querySelector('.marks');
const shopNumber = document.querySelector('#shopNumber');
const payByCardInput = payByCardNum.querySelectorAll('input');
axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, headers)
  .then(res => {
    const userData = res.data;
    // 信用卡輸入資料類別
    payByCardInput.forEach(input => {
      input.addEventListener('keyup', () => {
        input.value = input.value.replace(/[^0-9]/g, '');
      });
    });

    //  會員資料渲染
    buyerInfo.children[0].children[0].value = userData.userName;
    buyerInfo.children[1].children[0].value = userData.phoneNumber;
    payMethod.addEventListener('click', (e) => {
      if (e.target.value === '信用卡') {
        payByCardNum.style.display = 'block';
        payByCardNum.children[0].children[0].value = userData.creditCard.cardNumber;
        payByCardNum.children[1].children[0].value = userData.creditCard.expiryDate.split('/')[0];
        payByCardNum.children[1].children[1].value = userData.creditCard.expiryDate.split('/')[1];
        payByCardNum.children[2].children[0].value = userData.creditCard.securityCode;
        localStorage.setItem('payMethod', '信用卡');
      } else if (e.target.value === '貨到付款') {
        payByCardNum.style.display = 'none';
        localStorage.setItem('payMethod', '貨到付款');
      };
    });
    // 寄送方式選擇
    marks.addEventListener('click', (e) => {
      if (e.target.value === '全家便利商店') {
        localStorage.setItem('shopType', '全家便利商店');
      } else if (e.target.value === '7-ELEVEN') {
        localStorage.setItem('shopType', '7-ELEVEN');
      };
    });

    goodsData(userData.shoppingCar)
      .then(res => {
        goodsPrice.textContent = `$${res}`;
        endPrice.textContent = `$${Number(res) + 60}`;
        totalPrice.children[0].innerHTML = `應付款金額:<span class="h1Size primaryColor">$${Number(res) + 60}</span>`;
      });

    // 送出訂單
    totalPrice.addEventListener('click', (e) => {
      if (e.target.nodeName === 'BUTTON') {
        const obj = {};
        obj.userId = userData.id;
        obj.name = buyerInfo.children[0].children[0].value;
        obj.tel = buyerInfo.children[1].children[0].value;
        obj.state = '待處理';
        obj.isTally = false;
        obj.toShop = {
          type: localStorage.getItem('shopType'),
          shopNumber: shopNumber.value,
          sendNumber: ''
        };
        userData.shoppingCar.sort((a, b) => a.goodId - b.goodId);
        obj.boughtGoods = userData.shoppingCar;
        if (localStorage.getItem('payMethod') === '貨到付款') {
          obj.payMethod = '貨到付款';
        } else {
          obj.payMethod = {
            cardNumber: payByCardNum.children[0].children[0].value,
            expiryDate: `${payByCardNum.children[1].children[0].value}/${payByCardNum.children[1].children[1].value}`,
            securityCode: payByCardNum.children[2].children[0].value
          };
        };
        if (!obj.name || !obj.tel) {
          buyerInfo.previousElementSibling.style.color = 'red';
          buyerInfo.children[0].children[0].focus();
          Swal.fire({
            icon: 'error',
            title: '收件人信息錯誤!'
          });
          return;
        } else {
          buyerInfo.previousElementSibling.style.color = '#1F0707';
        };
        if (!localStorage.getItem('shopType') || !shopNumber.value) {
          marks.previousElementSibling.style.color = 'red';
          marks.children[0].children[0].focus();
          Swal.fire({
            icon: 'error',
            title: '寄送方式錯誤!',
            text: '請選擇寄件方式,以及輸入店號'
          });
          return;
        } else {
          marks.previousElementSibling.style.color = '#1F0707';
        };
        if (!localStorage.getItem('payMethod')) {
          payMethod.previousElementSibling.style.color = 'red';
          payMethod.children[0].children[0].focus();
          Swal.fire({
            icon: 'error',
            title: '付款方式錯誤!',
            text: '請選擇付款方式,並完善資料'
          });
          return;
        } else if (localStorage.getItem('payMethod') === '信用卡') {
          if (!obj.payMethod.cardNumber || !payByCardNum.children[1].children[0].value || !payByCardNum.children[1].children[1].value || !obj.payMethod.securityCode) {
            payMethod.previousElementSibling.style.color = 'red';
            payMethod.children[0].children[0].focus();
            Swal.fire({
              icon: 'error',
              title: '付款方式錯誤!',
              text: '請選擇付款方式,並完善資料'
            });
            return;
          } else {
            payMethod.previousElementSibling.style.color = '#1F0707';
          }
        } else {
          payMethod.previousElementSibling.style.color = '#1F0707';
        }
        localStorage.removeItem('shopType');
        localStorage.removeItem('payMethod');
        localStorage.removeItem('shoppingTotalPrice');
        axios.post(`${baseUrl}/orders`, {
          ...obj,
          createTime: new Date().getTime(),
          tallyTime: '',
          finishTime: '',
          totalPrice: endPrice.textContent.split('$')[1]
        })
          .then(res => {
            axios.patch(`${baseUrl}/600/users/${localStorage.getItem('userId')}`,{
              shoppingCar: []
            }, headers);
            location.href = `/shoppingFinish/${localStorage.getItem('userId')}`;
          });
      }
    });
  })
  .catch(err => {
    if (err.request.status === 403) {
      document.location.href = `/user/${localStorage.getItem('userId')}`;
    } else if (err.request.status === 401) {
      clearLogin();
    };
  });

async function goodsData (shoppingCar) {
  const res = await axios.get(`${baseUrl}/goods`);
  let total = 0;
  shoppingCar.forEach(item => {
    res.data.forEach(goods => {
      if (item.goodId === goods.id) {
        total += goods.price * item.num;
      };
    });
  });
  return total;
};
