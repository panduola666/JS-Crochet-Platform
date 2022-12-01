const pendingTransfer = document.querySelector('.pendingTransfer');
const finishTransfer = document.querySelector('.finishTransfer');
adminNav.addEventListener('click', (e) => {
  if (e.target.textContent === '收益提領審核') {
    let transferData;
    axios.get(`${baseUrl}/transfer?_expand=user`)
      .then(res => {
        transferData = res.data;
        renderTransfer(transferData);
        // 轉帳進度切換
        const states = pendingTransfer.querySelectorAll('.state');
        states.forEach(select => {
          select.addEventListener('change', async () => {
            await axios.patch(`${baseUrl}/transfer/${select.dataset.id}`,{
              state: select.value,
              finishTime: new Date().getTime()
            });
            const res = await axios.get(`${baseUrl}/transfer?_expand=user`);
            transferData = res.data;
            renderTransfer(transferData);
          });
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
});

// 待審核畫面渲染
function renderTransfer (transferData) {
  const pending = [];
  const finish = [];
  transferData.forEach(item => {
    if (item.state === '待處理') {
      pending.push(`<tr>
        <td>${item.user.userName}</td>
        <td>${item.bankAccount}</td>
        <td>${item.bankCode}</td>
        <td>${item.transferMoney}</td>
        <td>
            <select name="" id="" class="state" data-id="${item.id}">
                <option value="待處理" selected>待處理</option>
                <option value="已轉帳">已轉帳</option>
            </select>
        </td>
      </tr>`);
    } else {
      finish.push(`<tr>
            <td>${item.user.userName}</td>
            <td>${item.bankAccount}</td>
            <td>${item.bankCode}</td>
            <td>${item.transferMoney}</td>
            <td>${item.state}</td>
            <td class="small lhMore">
                ${timer(item.finishTime)}
            </td>
        </tr>`)
    }
  });
  pendingTransfer.innerHTML = pending.join('');
  finishTransfer.innerHTML = finish.join('');
};
