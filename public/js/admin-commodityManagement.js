const goodsTable = document.querySelector('.goodsTable');
const goodsColors = document.querySelector('.goodsColors');
const goodsCover = document.querySelector('.goodsCover');
const goodsCoverBtn = document.querySelector('.goodsCoverBtn');
const addGoodsData = document.querySelector('.addGoodsData');
const addGoods = document.querySelector('.addGoods');
const filterGoods = document.querySelector('.filterGoods');
const goodsName = document.querySelector('#goodsName');
const goodsType = document.querySelector('#goodsType');
const goodsWeight = document.querySelector('#goodsWeight');
const newGoodsName = document.querySelector('#newGoodsName');
const newGoodsType = document.querySelector('#newGoodsType');
const newGoodsColor = document.querySelector('#newGoodsColor');
const goodsPrice = document.querySelector('#goodsPrice');

/**
 * 新增 C3 銷量 圖表
 */
// 商品列表
let GoodsData;
let recommendNum = 0;
init();
adminNav.addEventListener('click', (e) => {
  if (e.target.textContent === '商品管理') {
    init();
  };
});

// 全部功能啟用
function init () {
  axios.get(`${baseUrl}/users/${localStorage.getItem('userId')}`, headers)
    .then(res => {
      if (res.data.isAdmin) {
        axios.get(`${baseUrl}/goods`)
          .then(res => {
            GoodsData = res.data;
            renderIInit(GoodsData);
            dialogInit();
            addNewGoods();
            goodOperation();
            filterChange();
          });
      } else {
        document.location.href = '/';
      }
    })
    .catch(() => {
      clearLogin();
    });
};

// 分類商品
function filterChange () {
  filterGoods.addEventListener('change', () => {
    if (filterGoods.value === '全部分類') {
      renderIInit(GoodsData);
    } else {
      const filterData = GoodsData.filter(item => item.type === filterGoods.value);
      renderIInit(filterData);
    };
  });
}

// 基礎頁面渲染
function renderIInit (data) {
  const goodsTableStr = [];
  const goodsNameStr = ['<option value="" selected disabled hidden>商品種類</option>'];
  const goodsTypeStr = ['<option value="" selected disabled hidden>請選擇分類</option>'];
  data.forEach(item => {
    if (item.isClose) return;
    goodsTableStr.push(
        `<tr>
            <td>${item.title.split('-')[0]}</td>
            <td>${item.title.split('-')[1] ? item.title.split('-')[1] : ''}</td>
            <td>${item.type}</td>
            <td>${item.price}</td>
            <td class="small lhMore">${item.styles.map(item => item.name).join('、')}</td>
            <td><input type="checkbox" class="recommend" ${item.isRecommend ? 'checked' : ''} data-id="${item.id}"></td>
            <td><img src="https://github.com/panduola666/2022JS-/blob/main/public/images/Vector.png?raw=true" alt="修改" class="pointer editor" style="display:${item.type === '材料包' ? 'none' : ''};" data-id="${item.id}"></td>
            <td><span class="pointer deleteGoods" data-id="${item.id}">X</span></td>
        </tr>`
    );
    // 新增商品頁面-選項渲染
    if (item.type !== '材料包') {
      goodsNameStr.push(`<option value="${item.title.split('-')[0]}">${item.title.split('-')[0]}</option>`);
      goodsTypeStr.includes (`<option value="${item.type}">${item.type}</option>`) ?
        goodsTypeStr :
        goodsTypeStr.push(`<option value="${item.type}">${item.type}</option>`);
    }
    item.isRecommend ? recommendNum++ : recommendNum;
  });
  goodsTable.innerHTML = goodsTableStr.join('');
  goodsName.innerHTML = goodsNameStr.join('');
  goodsType.innerHTML = goodsTypeStr.join('');
  renderC3();
};

// c3圖表繪製
function renderC3 () {
  const newData = {};
  GoodsData.forEach(item => {
    if (item.isClose) return;
    newData[item.title.split('-')[0]] ? newData[item.title.split('-')[0]] += item.sellNum : newData[item.title.split('-')[0]] = item.sellNum;
  });
  const newKeys = Object.keys(newData).map(item => item.length > 8 ? `${item.substring(0, 6)}...` : item);

  const commodityChart = c3.generate({
    size: {
      height: Object.keys(newData).length * 40
    },
    bindto: '#commodityChart',
    padding: {
      top: 10,
      right: 50,
      bottom: 10,
      left: 120
    },
    data: {
      x: 'x',
      columns: [
        ['x', ...newKeys],
        ['銷量', ...Object.values(newData)]
      ],
      type: 'bar',
      colors: {
        銷量: '#FC7F79'
      }
    },
    bar: {
      width: {
        ratio: 0.6
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

// 商品列表操作
function goodOperation () {
  goodsTable.addEventListener('click', (e) => {
    // 刪除商品
    if (e.target.classList.contains('deleteGoods')) {
      deleteGoodOperation(e.target.dataset.id)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: '刪除成功'
          });
        });
      return;
    };
    // 編輯商品
    if (e.target.classList.contains('editor')) {
      addGoods.click();
      localStorage.setItem('editorId', e.target.dataset.id);
      axios.get(`${baseUrl}/goods/${e.target.dataset.id}`)
        .then(res => {
          const data = res.data;
          goodsName.value = data.title.split('-')[0];
          goodsWeight.value = parseInt(data.title.split('-')[1]);
          goodsType.value = data.type;
          goodsPrice.value = data.price;
          const colorStr = [];
          data.styles.forEach(item => {
            colorStr.push(
                `<tr>
                <td class="colorName">${item.name}</td>
                <td>${item.code}</td>
                <td><span class="pointer">X</span></td>
                </tr>`
            );
          });
          goodsColors.innerHTML = colorStr.join('');
          goodsCover.setAttribute('src', data.cover);
        });
      return;
    };
    // 推薦商品
    if (e.target.classList.contains('recommend')) {
      e.target.checked ? recommendNum++ : recommendNum--;
      if (recommendNum >= 3) {
        axios.patch(`${baseUrl}/goods/${e.target.dataset.id}`, {
          isRecommend: e.target.checked
        });
        return;
      } else {
        e.target.checked = !e.target.checked;
        if (recommendNum < 3) recommendNum = 3;
        Swal.fire({
          icon: 'warning',
          title: '推薦失敗!',
          text: '推薦商品不可低於3個'
        });
      }
    };
  });
};

// 彈跳窗口-頁面渲染
function dialogInit () {
  const newGoodsNameBtn = document.querySelector('.newGoodsNameBtn');
  const newGoodsTypeBtn = document.querySelector('.newGoodsTypeBtn');
  const newColorBtn = document.querySelector('.newColorBtn');
  // 新增名稱
  newGoodsNameBtn.addEventListener('click', () => {
    if (newGoodsName.value.trim() === '') return;
    goodsName.innerHTML += `<option value="${newGoodsName.value}">${newGoodsName.value}</option>`;
    goodsName.value = newGoodsName.value;
    newGoodsName.value = '';
  });
  // 新增分類
  newGoodsTypeBtn.addEventListener('click', () => {
    if (newGoodsType.value.trim() === '') return;
    goodsType.innerHTML += `<option value="${newGoodsType.value}">${newGoodsType.value}</option>`;
    goodsType.value = newGoodsType.value;
    newGoodsType.value = '';
  });
  // 新增顏色
  newColorBtn.addEventListener('click', () => {
    if (newGoodsColor.value.includes('-#')) {
      goodsColors.innerHTML += `<tr>
        <td  class="colorName">${newGoodsColor.value.split('-')[0]}</td>
        <td>${newGoodsColor.value.split('-')[1]}</td>
        <td><span class="pointer">X</span></td>
    </tr>`;
      newGoodsColor.value = '';
    } else {
      Swal.fire({
        icon: 'warning',
        title: '格式錯誤',
        text: '格式應為: 顏色-顏色碼'
      });
    };
  });

  // 刪除顏色
  goodsColors.addEventListener('click', (e) => {
    if (e.target.className === 'pointer') {
      e.target.parentElement.parentElement.remove();
    };
  });
  // 封面上傳
  goodsCoverBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!/^http/.test(goodsCoverBtn.previousElementSibling.value) || goodsCoverBtn.previousElementSibling.value.includes('base64')) {
      Swal.fire({
        icon: 'warning',
        title: '格式錯誤',
        text: '請確認是否為圖片鏈接'
      });
      return;
    }
    goodsCover.setAttribute('src', goodsCoverBtn.previousElementSibling.value);
    goodsCoverBtn.previousElementSibling.value = '';
  });
};

// 彈跳窗口-表單資料獲取
function dialogOperation () {
  const colorName = document.querySelectorAll('.colorName');
  const goodsWeight = document.querySelector('#goodsWeight');
  const obj = {};
  if (goodsWeight.value !== '') {
    obj.title = `${goodsName.value}-${goodsWeight.value.includes('g') ? goodsWeight.value : goodsWeight.value + 'g'}`;
  } else {
    obj.title = goodsName.value;
  };
  obj.title = `${goodsName.value}${goodsWeight.value ? `-${goodsWeight.value}g` : ''}`;
  obj.price = goodsPrice.value;
  obj.isRecommend = false;
  obj.styles = [];
  obj.type = goodsType.value;
  obj.sellNum = 0;
  obj.cover = goodsCover.getAttribute('src');
  colorName.forEach(item => {
    obj.styles.push({
      name: item.textContent,
      code: item.nextElementSibling.textContent
    });
  });
  return obj;
};

// 彈跳窗口-添加新商品
function addNewGoods () {
  addGoodsData.addEventListener('click', () => {
    // 表單判斷
    if (goodsName.value === '') {
      goodsName.focus();
      return;
    };
    if (goodsType.value === '') {
      goodsType.focus();
      return;
    };
    if (goodsPrice.value === '') {
      goodsPrice.focus();
      return;
    };
    if (goodsCover.getAttribute('src') === '') {
      goodsCover.style.border = '1px solid red';
      return;
    };
    const obj = dialogOperation();
    if (localStorage.getItem('editorId')) {
      // 編輯已有商品
      axios.put(`${baseUrl}/goods/${localStorage.getItem('editorId')}`, obj)
        .then(res => {
          localStorage.removeItem('editorId');
          goodFinishAdd();
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      axios.post(`${baseUrl}/goods`, obj)
        .then(() => {
          goodFinishAdd();
        });
    };
  });
};

async function goodFinishAdd () {
  const res = await axios.get(`${baseUrl}/goods`);
  GoodsData = res.data;
  renderIInit(GoodsData);
  document.querySelector('.cancel').click();
  document.querySelector('.dialogText').reset();
  goodsColors.innerHTML = '';
  goodsCover.setAttribute('src', '');
};

// 刪除商品
async function deleteGoodOperation (id) {
  try {
    const change = await axios.patch(`${baseUrl}/goods/${id}`, {
      isClose: true,
      isRecommend: false
    });
    if (change.data.workId) {
      const work = await axios.get(`${baseUrl}/works/${change.data.workId}`);
      const isSell = work.data.isSell;
      console.log(isSell);
      isSell.canSell = '已下架';
      isSell.reason = '此商品已下架';
      const a = await axios.patch(`${baseUrl}/works/${work.data.id}`, { isSell });
      console.log(a);
    };
    const res = await axios.get(`${baseUrl}/goods`);
    GoodsData = res.data;
    renderIInit(GoodsData);
  } catch (err) {
    console.log(err);
  };
};
