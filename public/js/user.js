// 完成
const avatar = document.querySelector('.avatar');
const application = document.querySelector('.application');
const baseDBList = document.querySelectorAll('.baseDBList li');
const applicationAgree = document.querySelector('.agree');
const userDBInput = document.querySelectorAll('.userDB input');
const userDBChange = document.querySelector('.userDBChange');
const userAccount = document.querySelector('.userAccount');
const addCreditCard = document.querySelector('.creditCardBTN');
const creditCardInfo = document.querySelector('.creditCardNum');
const myCreditCard = document.querySelector('.myCreditCard');
const passwordDB = document.querySelector('.passwordDB');
const pwInput = document.querySelectorAll('.passwordDB input');
const passwordChange = passwordDB.querySelector('button');
let userDb;
axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}?_embed=works&_embed=articles`, headers)
  .then(res => {
    userDb = res.data;
    userDbInit();
    applyCreator(userDb.isCreator);
    userDbChange();
  })
  .catch(err => {
    if (err.request.status === 403) {
      location.href = `/user/${localStorage.getItem('userId')}`;
    } else if (err.request.status === 401) {
      clearLogin();
    };
  });

// 畫面渲染
function userDbInit () {
  avatar.textContent = userDb.userName[0];
  userAccount.textContent = `帳號: ${userDb.email}`;
  userDBInput[0].value = userDb.userName;
  userDBInput[1].value = userDb.phoneNumber;
  userDBInput[2].value = userDb.barcode;
  userDBInput[3].value = userDb.creditCard.cardNumber;
  userDBInput[4].value = userDb.creditCard.expiryDate.split('/')[0];
  userDBInput[5].value = userDb.creditCard.expiryDate.split('/')[1];
  userDBInput[6].value = userDb.creditCard.securityCode;
  myCreditCard.textContent = userDb.creditCard.cardNumber.replace(userDb.creditCard.cardNumber.slice(3, -3), '*'.repeat(userDb.creditCard.cardNumber.slice(3, -3).length));
  baseDBList[0].children[1].textContent = `${userDb.articles.length + userDb.works.length}篇`;
  baseDBList[1].children[1].textContent = `${userDb.boughtArticles.length}篇`;
  baseDBList[2].children[1].textContent = `${userDb.saveArticles.worksId.length + userDb.saveArticles.articlesId.length}篇`;
};

// 會員資料變更
function userDbChange () {
  userDBChange.addEventListener('click', () => {
    if (userDBChange.textContent === '編輯') {
      userDBInput.forEach(input => {
        input.disabled = false;
      });
      addCreditCard.disabled = false;
      userDBChange.textContent = '確認';
    } else if (userDBChange.textContent === '確認') {
      if (userDBInput[2].value !== '' && !/^\//.test(userDBInput[2].value)) {
        Swal.fire({
          icon: 'info',
          title: '手機載具格式錯誤',
          text: '格式應為: "/"開頭的8個字元'
        });
        return;
      };
      if (/[^0-9]/g.test(userDBInput[3].value) || /[^0-9]/g.test(userDBInput[4].value) || /[^0-9]/g.test(userDBInput[5].value) || /[^0-9]/g.test(userDBInput[6].value)) {
        // 信用卡有打非數字
        Swal.fire({
          icon: 'info',
          title: '信用卡不可輸入非數字'
        });
        return;
      };
      if (userDBInput[3].value === '') {
        userDBInput[4].value = '';
        userDBInput[5].value = '';
        userDBInput[6].value = '';
      } else if (userDBInput[4].value === '' || userDBInput[5].value === '' || userDBInput[6].value === '') {
        Swal.fire({
          icon: 'info',
          title: '信用卡未完善'
        });
        return;
      }
      avatar.textContent = userDBInput[0].value[0];
      const needChang = userDBInput[3].value.slice(3, -3);
      myCreditCard.textContent = userDBInput[3].value.replace(needChang, '*'.repeat(needChang.length));
      creditCardInfo.style.display = 'none';
      axios.patch(`${baseUrl}/600/users/${userDb.id}`, {
        userName: userDBInput[0].value,
        phoneNumber: userDBInput[1].value,
        barcode: userDBInput[2].value,
        creditCard: {
          cardNumber: userDBInput[3].value,
          expiryDate: `${userDBInput[4].value}/${userDBInput[5].value}`,
          securityCode: userDBInput[6].value
        }
      }, headers)
        .then(res => {
          userDBChange.textContent = '編輯';
          addCreditCard.disabled = true;
          userDBInput.forEach(input => {
            input.disabled = true;
          });
        })
        .catch(err => console.log(err));
    };
  });

  // 新增帳戶
  addCreditCard.addEventListener('click', () => {
    creditCardInfo.style.display = creditCardInfo.style.display === 'block' ? 'none' : 'block';
  });
};
// 判斷是否為原創者以及申請原創者
function applyCreator (isCreator) {
  if (isCreator) {
    application.style.display = 'none';
    baseDBList[3].style.display = 'flex';
  } else {
    applicationAgree.addEventListener('click', () => {
      document.querySelector('#exampleModal').classList.remove('show');
      document.querySelector('div.modal-backdrop').classList.remove('show');
      application.style.display = 'none';
      baseDBList[3].style.display = 'flex';
      axios.patch(`${baseUrl}/600/users/${userDb.id}`, {
        isCreator: true
      }, headers);
    });
  };
};

// 管理文章-跳轉頁面
baseDBList.forEach(li => {
  li.addEventListener('click', (e) => {
    if (li.textContent.includes('我的文章')) document.location.href = `/myArticle/${userDb.id}`;
    if (li.textContent.includes('我的留言')) document.location.href = `/myMessage/${userDb.id}`;
    if (li.textContent.includes('我的收藏')) document.location.href = `/mySave/${userDb.id}`;
    if (li.textContent.includes('材料包管理')) document.location.href = `/userSell/${userDb.id}`;
  });
});




const register = {
  原密碼: {
    length:{
      minimum: 6,
      message: '長度不可小於6'
    }
  },
  新密碼: {
    length:{
      minimum: 6,
      message: '長度不可小於6'
    }
  },
  確認新密碼: {
    length:{
      minimum: 6,
      message: '長度不可小於6'
    }
  }
};
// 修改密碼
passwordChange.addEventListener('click', () => {
  const err = validate(passwordDB, register) || null;
  
  const passwordRegex = /[a-zA-Z0-9]{6,}/;
  if (passwordChange.textContent === '編輯') {
    // 編輯
    passwordChange.textContent = '確認';
    pwInput.forEach(input => {
      input.disabled = false;
      input.style.borderBottomColor = '#1F0707';
    });
  } else {
    // 確認資料
    const text = [];
    for (const key in err) {
      text.push(`<p>${err[key]}</p>`)
    };
    if (err) {
      Swal.fire({
        icon: 'error',
        title: '修改失敗',
        html: text.join('')
      });
      return;
    };

    if (pwInput[0].value.trim() === '') {
      pwInput.forEach(input => {
        input.disabled = true;
        input.style.borderBottomColor = 'none';
        input.value = '';
      });
      passwordChange.textContent = '編輯';
      return;
    };

    axios.post(`${baseUrl}/login`, {
      email: userDb.email,
      password: pwInput[0].value
    })
      .then(async (res) => {
      // 密碼正確
        if (pwInput[2].value !== pwInput[1].value) {
          Swal.fire({
            icon: 'error',
            title: '修改失敗',
            text: '兩次密碼輸入不一致'
          });
          return
        };
        if (pwInput[2].value ==='' || pwInput[1].value ===''){
          Swal.fire({
            icon: 'error',
            title: '修改失敗',
            text: '新密碼不得為空'
          });
          return
        }
        try {
          await axios.patch(`${baseUrl}/600/users/${userDb.id}`, {
            password: pwInput[1].value
          }, headers);
          // 驗證成功
          pwInput.forEach(input => {
            input.disabled = true;
            input.style.borderBottomColor = 'none';
            input.value = '';
          });
          passwordChange.textContent = '編輯';
          localStorage.clear();
          Swal.fire({
            icon: 'success',
            title: '修改密碼成功',
            text: '請重新登入'
          });
          setTimeout(() => {
            document.location.href = '/login';
          }, 2000);
        } catch {
          clearLogin();
        };
      })
      .catch(err => {
        // 密碼錯誤
        Swal.fire({
          icon: 'error',
          title: '原密碼錯誤'
        });
      })
  };
});
