const mySell = document.querySelector('.mySell');
const myGoodsBody = document.querySelector('.myGoodsBody');
const totalRevenue = document.querySelector('.totalRevenue');
const myGoodsBTN = document.querySelector('.myGoodsBTN');
let myGoodsData;
let myWorksData;
let userData;

axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}?_embed=works&_embed=goods`, headers)
  .then(res => {
    userData = res.data;
    myGoodsData = res.data.goods;
    myWorksData = res.data.works;
    renderProductStatus();
    renderProductRevenue();
    renderC3Bar();
  })
  .catch(err => {
    console.log(err);
    if (err.request.status === 403) {
      location.href = `/user/${localStorage.getItem('userId')}`;
    } else if (err.request.status === 401) {
      alert('登入過期');
      clearLogin();
    };
  });

// 材料包詳情-畫面渲染
function renderProductStatus () {
  const text = [];
  myWorksData.forEach(item => {
    if (typeof item.isSell !== 'object') return;
    text.push(`
    <button type="button" class="mySellBTN" data-bs-toggle="collapse" data-bs-target="#collapseExample${item.id}"
        aria-expanded="false" aria-controls="collapseExample3">
        <div class="mySellGoods">
            <h1 class="h2Size textHidden">${item.title}</h1>
            <span class="h3Size">${item.isSell.canSell}</span>
        </div>
    </button>
    <div class="collapse" id="collapseExample${item.id}">
        <div class="mySellContent lhBigger">
            <p>審查狀態 : <span>${item.isSell.canSell}</span></p>
            <p>原因 : <span>${item.isSell.reason}</span></p>
            <a href="#" class="small">審查規則</a>
        </div>
    </div>`);
  });
  mySell.innerHTML = text.join('');
};

// 我的收益畫面渲染
function renderProductRevenue () {
  const text = [];
  let total = 0;
  myGoodsData.forEach(item => {
    const num = item.sellNum - item.transferNum;
    if (num === 0) return;
    text.push(`<tr>
      <td>${item.title}</td>
      <td>$${item.price * num}</td>
      <td>${num}</td>
      <td>$${Math.round(item.price * num / 10)}</td>
    </tr>`);
    total += Math.round(item.price * num / 10);
  });
  myGoodsBody.innerHTML = text.join('');
  totalRevenue.textContent = `總計 : $${total}`;
};

// 提取收益
myGoodsBTN.addEventListener('click', async () => {
  const { value: formValues } = await Swal.fire({
    title: '請輸入提款的帳戶資訊',
    html:
      '<p>銀行代碼:</p>' +
      '<input type="number" min="0" id="swal-input1" class="swal2-input">' +
      '<p>銀行帳號:</p>' +
      '<input type="number" min="0" id="swal-input2" class="swal2-input">',
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById('swal-input1').value,
        document.getElementById('swal-input2').value
      ]
    }
  });

  // 判斷是否輸入完成
  if (formValues) {
    if (formValues[0].trim() === '' || formValues[1].trim() === '') {
      Swal.fire({
        icon: 'error',
        title: '資料錯誤'
      });
      return
    };
    if (myGoodsBody.innerHTML === '') {
      Swal.fire({
        icon: 'error',
        title: '當前沒有收益可以提取'
      });
      return
    }
    const data = {
      userId: userData.id,
      bankCode: formValues[0],
      bankAccount: formValues[1],
      transferMoney: totalRevenue.textContent.split('$')[1],
      state: '待處理',
      finishTime: ''
    };
    transferMoney(data);
  };
});

function transferMoney (data) {
  axios.post(`${baseUrl}/transfer`, data)
    .then(res => {
      Swal.fire({
        icon: 'success',
        title: '申請提款成功'
      });
      myGoodsData.forEach(item => {
        const transferNum = item.sellNum;
        axios.patch(`${baseUrl}/goods/${item.id}`, { transferNum });
      });
      return axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}?_embed=goods`, headers)
    })
    .then(res => {
      myGoodsData = res.data.goods;
      myGoodsBTN.disabled = false;
      renderProductRevenue();
    })
    .catch(err => {
      console.log(err);
    });
}

// C3圖表
function renderC3Bar () {
  const newData = myGoodsData.reduce((obj, item) => {
    const newTitle = item.title.length > 8 ? `${item.title.substring(0, 6)}...` : item.title;
    obj[newTitle] ? obj[newTitle] += item.sellNum : obj[newTitle] = item.sellNum;
    return obj;
  }, {});
  const userSellNumChart = c3.generate({
    bindto: '#userSellNum',
    padding: {
      right: 30
    },
    data: {
      x: 'x',
      columns: [
        ['x', ...Object.keys(newData)],
        ['銷量', ...Object.values(newData)]
      ],
      type: 'bar',
      colors: {
        銷量: '#FFBEBA'
      }
    },
    bar: {
      width: {
        ratio: 0.5
      }
    },
    axis: {
      rotated: true,
      x: {
        type: 'category',
        tick: {
          rotate: 75,
          multiline: false
        },
        height: 130
      },
      y: {
        label: {
          text: '單位: 件',
          position: 'outer-middle'
        }
      }
    }
  });
};
