// 已完成!!!!!!!!!!

// 驗證碼生成
const verifyImg = document.querySelector('.verifyImg');
const fontColor = ['blue', 'yellow', 'red'];
const bgColor = ['yellow', 'red', 'blue', 'black'];
const fLetterSpacing = ['2px', '8px', '-2px', '5px'];
const verifyText = document.querySelector('.verifyText');
const registerBtn = document.querySelector('.registerBtn');
const loginBtn = document.querySelector('.loginBtn');

createCode();
verifyImg.addEventListener('click', (e) => {
  createCode();
});

function createCode () {
  const iColor = Math.floor(Math.random() * (fontColor.length));
  verifyImg.style.color = fontColor[iColor];
  verifyImg.style.backgroundColor = bgColor[iColor];
  verifyImg.style.letterSpacing = fLetterSpacing[iColor];
  let code = '';
  const codeLength = 6;// 驗證碼的長度
  const random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];// 隨機數
  for (let i = 0; i < codeLength; i++) { // 迴圈操作
    const index = Math.floor(Math.random() * 36);// 取得隨機數的索引（0~35）
    code += random[index];// 根據索引取得隨機數加到code上
  };
  verifyImg.innerHTML = code;// 把code值賦給驗證碼
};

/* 註冊邏輯 */
const register = {
  帳號: {
    presence: {
      message: '必填'
    },
    email: {
      message: '格式錯誤'
    }
  },
  密碼: {
    presence: {
      message: '必填'
    },
    length:{
      minimum: 6,
      message: '長度不可小於6'
    }
  },
  確認密碼: {
    presence: {
      message: '必填'
    },
    length:{
      minimum: 6,
      message: '長度不可小於6'
    }
  }
};
registerBtn.addEventListener('click', () => {
  const registerForm = document.querySelector('.registerForm');
  const registerPassword = document.querySelector('#registerPassword');
  const registerPasswordCheck = document.querySelector('#registerPasswordCheck');
  const err = validate(registerForm, register) || null;
  const text = [];
  for (const key in err) {
    text.push(`<p>${err[key]}</p>`)
  };
  if (err) {
    Swal.fire({
      icon: 'error',
      title: '註冊失敗',
      html: text.join('')
    });
    return
  }
  if (!err && registerPassword.value !== registerPasswordCheck.value) {
    Swal.fire({
      icon: 'error',
      title: '註冊失敗',
      text: '兩者密碼不一致'
    });
    return
  }
  axios.post(`${baseUrl}/users`, {
    email: registerForm.帳號.value,
    password: registerForm.密碼.value,
    userName: registerForm.帳號.value.split('@')[0],
    isCreator: false,
    isAdmin: false,
    shoppingCar: [],
    saveArticles: {
      worksId: [],
      articlesId: []
    },
    boughtArticles: [],
    phoneNumber: '09',
    barcode: '',
    creditCard: {
      cardNumber: '',
      expiryDate: '/',
      securityCode: ''
    }
  })
    .then(res => {
      registerForm.reset();
      window.location.href = '/success';
    })
    .catch(() => {
      localStorage.clear();
      Swal.fire({
        icon: 'error',
        title: '註冊失敗!',
        text: '此帳號已被使用'
      });
    });
});

/* 登入邏輯 */
const login = {
  帳號: {
    presence: {
      message: '必填'
    },
    email: {
      message: '格式錯誤'
    }
  },
  密碼: {
    presence: {
      message: '必填'
    },
    length:{
      minimum: 6,
      message: '長度不可小於6'
    }
  },
  驗證碼: {
    presence: {
      message: '必填'
    },
    length:{
      is: 6,
      message: '為6個字元'
    }
  }
};
loginBtn.addEventListener('click', () => {
  const loginForm = document.querySelector('.loginForm');
  const err = validate(loginForm, login) || null;
  const text = [];
  for (const key in err) {
    text.push(`<p>${err[key]}</p>`)
  };
  if (err) {
    Swal.fire({
      icon: 'error',
      title: '登入失敗',
      html: text.join('')
    });
    return
  };
  if (verifyText.value.toUpperCase() !== verifyImg.textContent.toUpperCase()) {
    Swal.fire({
      icon: 'error',
      title: '驗證錯誤'
    });
    return
  };

  axios.post(`${baseUrl}/login`, {
    email: loginForm.帳號.value,
    password: loginForm.密碼.value
  })
    .then(res => {
      localStorage.setItem('accessToken', `Bearer ${res.data.accessToken}`);
      localStorage.setItem('userId', res.data.user.id);
      window.location.href = `/user/${res.data.user.id}`;
    })
    .catch(() => {
      localStorage.clear();
      Swal.fire({
        icon: 'error',
        title: '登入失敗!',
        text: '請重新確認資料'
      });
      verifyImg.click();
    });
});

window.addEventListener('change', (e) => {
  if (e.key === 'Enter') loginBtn.focus();
});
