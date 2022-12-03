const needReviewedTable = document.querySelector('.needReviewedTable');
const finishReviewedTable = document.querySelector('.finishReviewedTable');
let worksData
adminNav.addEventListener('click', (e) => {
  if (e.target.textContent === '材料包審核') {
    axios.get(`${baseUrl}/works`)
      .then(res => {
        worksData = res.data;
        renderReviewed();
        needReviewedOperate();
        finishReviewedOperate();
      });
  };
});

// 待審核表格操作
function needReviewedOperate () {
  needReviewedTable.addEventListener('click', (e) => {
    if (e.target.className === 'pointer') {
      e.target.previousElementSibling.focus();
    };
    if (e.target.nodeName === 'SELECT' && e.target.value !== '待審核') {
      const thisInput = needReviewedTable.querySelector(`input[data-id="${e.target.dataset.id}"]`);
      if (thisInput.value.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: '原因不得為空'
        });
        e.target.value = '待審核';
        return;
      };
      isSellChange(e.target.dataset.id, e.target.value, thisInput.value)
        .then(async (res) => {
          const isSell = res.data.isSell;
          // 增加新的商品
          const newData = {
            title: isSell.title,
            price: isSell.price,
            isRecommend: false,
            styles: [],
            type: '材料包',
            sellNum: 0,
            transferNum: 0,
            cover: res.data.cover,
            workId: res.data.id,
            materials: isSell.materials,
            userId: res.data.userId,
            isClose: false
          };
          const getGoods = await axios.get(`${baseUrl}/goods`);
          if (e.target.value === '通過') {
            for (let i = 0; i < getGoods.data.length; i++) {
              if (getGoods.data[i].workId === newData.workId && getGoods.data[i].userId === newData.userId && !getGoods.data[i].isClose) {
                axios.patch(`${baseUrl}/goods/${i + 1}`, {
                  isClose: true
                })
                break;
              };
            };
            axios.post(`${baseUrl}/goods`, newData);
          }
          const newRes = await axios.get(`${baseUrl}/works`);
          worksData = newRes.data;
          renderReviewed();
        });
    };
  });
};
// 已審核表格原因修改
function finishReviewedOperate () {
  finishReviewedTable.addEventListener('click', (e) => {
    if (e.target.className === 'pointer') {
      e.target.previousElementSibling.focus();
    };
  });
  reasonChange();
};
function reasonChange () {
  const finishReason = finishReviewedTable.querySelectorAll('.finishReason');
  finishReason.forEach(input => {
    input.addEventListener('change', async () => {
      const res = await axios.get(`${baseUrl}/works/${input.dataset.id}`);
      const isSell = res.data.isSell;
      isSell.reason = input.value;
      const patchRes = await axios.patch(`${baseUrl}/works/${input.dataset.id}`,{isSell});
      Swal.fire({
        icon: 'success',
        title: '當前原因修改完成'
      });
    });
  });
};

// 基礎畫面渲染
function renderReviewed () {
  const needReviewedStr = [];
  const finishReviewedStr = [];
  worksData.forEach(item => {
    if (typeof item.isSell === 'object') {
      const materials = item.isSell.materials;
      if (item.isSell.canSell === '待審核') {
        needReviewedStr.push(`<tr>
            <td>${item.isSell.title}</td>
            <td>${item.isSell.price}</td>
            <td class="small lhMore">${renderMaterials(materials)}</td>
            <td>
                <select name="" id="" class="" data-id="${item.id}">
                    <option value="待審核" selected disabled hidden>待審核</option>
                    <option value="通過">通過</option>
                    <option value="失敗">失敗</option>
                </select>
            </td>
            <td>
                <input type="text" data-id="${item.id}" placeholder="客服將在3~7天內完成審核">
                <img src="https://github.com/panduola666/2022JS-/blob/main/public/images/Vector.png?raw=true" alt="編輯原因" class="pointer">
            </td>
        </tr>`);
      } else {
        finishReviewedStr.push(`<tr>
            <td>${item.isSell.title}</td>
            <td>${item.isSell.price}</td>
            <td class="small lhMore">${renderMaterials(materials)}</td>
            <td>${item.isSell.canSell}</td>
            <td>
                <input type="text" value="${item.isSell.reason}" data-id="${item.id}" class="finishReason">
                <img src="https://github.com/panduola666/2022JS-/blob/main/public/images/Vector.png?raw=true" alt="" class="pointer">
            </td>
        </tr>`);
      };
    };
  });
  needReviewedTable.innerHTML = needReviewedStr.join('');
  finishReviewedTable.innerHTML = finishReviewedStr.join('');
};

// 材料包內材料文字轉換
function renderMaterials (materials) {
  const arr = [];
  materials.forEach(item => {
    const str = item[0].split('-');
    arr.push(`<p>${str[0]} (${str[1]}) - ${item[1]} * ${item[2]}</p>`);
  });
  return arr.join('');
};

// 材料包審核狀態切換
async function isSellChange (id, auditResults, auditReason) {
  const res = await axios.get(`${baseUrl}/works/${id}`);
  const isSell = res.data.isSell;
  isSell.canSell = auditResults;
  isSell.reason = auditReason;
  return axios.patch(`${baseUrl}/works/${id}`,{
    isSell
  });
};
