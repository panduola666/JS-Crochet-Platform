/**
 * 欠常見問題
 */
const moreHref = document.querySelectorAll('.moreHref>li');
const toTop = document.querySelector('.backTop');
const searchChange = document.querySelector('.searchList');
const shoppingCarIcon = document.querySelector('.shoppingCarIcon');
const goToAdmin = document.querySelector('.goToAdmin');
const searchBtn = document.querySelector('.searchBtn');
const searchContent = document.querySelector('.searchContent');
const userMore = document.querySelector('.userMore');
const userMoreHref = document.querySelector('.userMoreHref');
// 返回頂部
toTopShow();
toTop.addEventListener('click', () => {
  let num = window.pageYOffset;
  setTimeout(() => {
    while (num >= 0) {
      num -= 1;
      window.scrollTo(0, num);
    };
  }, 200);
});

// 搜尋切換
searchChange.addEventListener('click', function () {
  this.textContent === '作品名　>' ? this.textContent = '文章名　>' : this.textContent = '作品名　>';
});
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.setItem('search', searchContent.value);
  if (searchChange.textContent === '作品名　>') {
    if (searchContent.value === '') {
      location.href = '/worksList';
    } else {
      location.href = `/worksList?search=${localStorage.getItem('search')}`;
    };
  } else if (searchChange.textContent === '文章名　>') {
    if (searchContent.value === '') {
      location.href = '/articlesList';
    } else {
      location.href = `/articlesList?search=${localStorage.getItem('search')}`;
    };
  };
});
// header Icon
if (localStorage.getItem('userId')) {
  // 已登入
  axios(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, headers)
    .then(res => {
    // 購物車數量
      const shoppingCarLength = res.data.shoppingCar.length;
      shoppingCarIcon.nextElementSibling.textContent = shoppingCarLength > 9 ? '9+' : shoppingCarLength;
      // more列表改變
      moreHref[moreHref.length - 1].innerHTML = '<a href="javascript:;">會員登出</a>';
      if (res.data.isAdmin) {
        goToAdmin.style.display = 'block';
        moreHref[0].style.display = 'block';
        goToAdmin.addEventListener('click',() => window.location.href= '/admin' );
      } else {
        goToAdmin.style.display = 'none';
        moreHref[0].style.display = 'none';
      };

      if (res.data.isCreator) {
        userMoreHref.children[0].style.display = 'block';
      } else {
        userMoreHref.children[0].style.display = 'none';
      };
    })
    .catch(() => {
    // 登入超時
      localStorage.clear();
      userMoreHref.style.display = 'none';
    });

  // 用戶icon點擊進入會員專區
  userMore.addEventListener('click', (e) => {
    if (e.target.classList.contains('userIcon')) {
      axios(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, headers)
        .then(res => {
          window.location.href = `/user/${res.data.id}`;
        })
        .catch(() => {
          localStorage.clear();
          document.location.href = '/login';
        });
    }
  });
  userMore.addEventListener('mouseenter',()=>{
    userMoreHref.style.display = 'block';
  });
  userMore.addEventListener('mouseleave',()=>{
    userMoreHref.style.display = 'none';
  });
} else {
  // 未登入
  // 用戶icon轉向登入頁面
  userMore.addEventListener('click', (e) => {
    if (e.target.classList.contains('userIcon')) document.location.href = '/login';
  });
};

// 點擊購物車判斷登入
shoppingCarIcon.addEventListener('click', () => {
  axios(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, headers)
    .then(res => {
      window.location.href = `/shoppingCar/${res.data.id}`;
    })
    .catch(() => {
      clearLogin();
    });
});

// 欠一個常見問題
// more列表路徑
moreHref.forEach(item => {
  item.addEventListener('click', (e) => {
    if (e.target.textContent === '後台管理') window.location.href = '/admin';
    if (e.target.textContent === '作品列表') window.location.href = '/worksList';
    if (e.target.textContent === '技巧文章') window.location.href = '/articleList';
    if (e.target.textContent === '購買商城') window.location.href = '/goodsList';
    // if (e.target.textContent === '常見問題')
    // window.location.href='/admin';
    if (e.target.textContent === '會員登入/註冊') window.location.href = '/login';
    if (e.target.textContent === '會員登出') {
      window.location.href = '/';
      localStorage.clear();
    };
  });
});
userMoreHref.addEventListener('click', (e) => {
  if (e.target.textContent === '我的訂單') location.href = `/myOrder/${localStorage.getItem('userId')}`;
  if (e.target.textContent === '我的文章') location.href = `/myArticle/${localStorage.getItem('userId')}`;
  if (e.target.textContent === '我的留言') location.href = `/myMessage/${localStorage.getItem('userId')}`;
  if (e.target.textContent === '我的收藏') location.href = `/mySave/${localStorage.getItem('userId')}`;
  if (e.target.textContent === '材料包管理') location.href = `/userSell/${localStorage.getItem('userId')}`;
  if (e.target.textContent === '會員登出') {
    window.location.href = '/';
    localStorage.clear();
  };
});

function toTopShow () {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset < 750) {
      toTop.style.display = 'none';
    } else if (window.pageYOffset >= 750) {
      toTop.style.display = 'block';
    };
  });
};
