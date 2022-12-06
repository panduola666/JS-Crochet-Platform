/**
 * 完成
 */
const tagList = document.querySelectorAll('.tagList > li');
const sortBTN = document.querySelectorAll('.sortBTN > button');
const addArticleBTN = document.querySelector('.addArticle');
const pageList = document.querySelector('.pageList');
const articles = document.querySelector('.articles');
const nowHref = location.href.split('=');
let data;
// 發布按鈕
if (localStorage.getItem('userId')) {
  addArticleBTN.style.display = 'flex';
  addArticleBTN.addEventListener('click', () => {
    localStorage.removeItem('works');
    localStorage.removeItem('articles');
    window.location.href = '/addArticle';
  });
} else {
  addArticleBTN.style.display = 'none';
};
axios.get(`${baseUrl}/works`)
  .then(res => {
    searchContent.value = localStorage.getItem('search');
    localStorage.removeItem('search');
    data = res.data;
    const page = 1;// 頁數
    const limit = 5;// 一頁幾個
    const start = 0;
    if (nowHref.length > 1) {
      data = data.filter(work => work.title.includes(decodeURIComponent(nowHref[nowHref.length - 1])));
    };
    articleInit(page, limit, start);
    filterArticles(page, limit, start);
    typeArticles(res.data, page, limit, start);
    // 分頁
    pagination(page, limit, start);
  });

function pagination (page, limit, start) {
  pageList.children[0].addEventListener('click', () => {
    if (page > 1) {
      page--;
      start -= limit;
      articleInit(page, limit, start);
      pageList.children[1].textContent = `第${page}/${Math.ceil(data.length / limit)}頁`;
    }
  });
  pageList.children[2].addEventListener('click', () => {
    if (page < Math.ceil(data.length / limit)) {
      page++;
      start += limit;
      articleInit(page, limit, start);
      pageList.children[1].textContent = `第${page}/${Math.ceil(data.length / limit)}頁`;
    };
  });
  pageList.children[1].textContent = `第${page}/${Math.ceil(data.length / limit)}頁`;
};
function articleInit (page, limit, start) {
  const str = [];
  const newData = data.slice(start, limit * page);
  newData.forEach(item => {
    str.push(`<div class="article my1" data-id="${item.id}">
    <div class="myArticleInfo py-2">
      <p class="d-flex flex-wrap"><span>收藏:${item.saveNum}</span>　<span>瀏覽:${item.scanNum}</span></p>
      <p class="text-end">${timer(item.createDate)}</p>
    </div>
    <article class="row justify-content-around py-3">
      <div class="col col-md-8">
        <h1 class="textHidden h2Size pb-3 px-3 px-md-2">${item.title}</h1>
        <div class="articleFont px-3 px-md-2">
          ${item.content}
        </div>
      </div>
      <img src="${item.cover}" alt="" class="articleImg col col-md-3 d-none d-md-block">
    </article>
  </div>`);
  });
  articles.innerHTML = str.join('');
  pagination(page, limit, start);
  const article = document.querySelectorAll('.article');
  article.forEach(item => {
    item.addEventListener('click', () => {
      data.forEach(work => {
        if (work.id === Number(item.dataset.id)) {
          work.scanNum++;
          axios.patch(`${baseUrl}/works/${item.dataset.id}`, {
            scanNum: work.scanNum
          })
            .then(() => {
              location.href = `/article/works/${item.dataset.id}`;
            });
        };
      });
    });
  });
};

// 篩選文章
function filterArticles (page, limit, start) {
  sortBTN.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target.textContent === '綜合') {
        sortBTN.forEach(item => item.classList.remove('active'));
        e.target.classList.add('active');
        data = data.sort((a, b) => a.id - b.id);
        articleInit(page, limit, start);
      } else if (e.target.textContent === '最新') {
        sortBTN.forEach(item => item.classList.remove('active'));
        e.target.classList.add('active');
        data = data.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
        articleInit(page, limit, start);
      } else if (e.target.textContent === '最熱') {
        sortBTN.forEach(item => item.classList.remove('active'));
        e.target.classList.add('active');
        data = data.sort((a, b) => b.scanNum - a.scanNum);
        articleInit(page, limit, start);
      };
    });
  });
};
// 文章分類
function typeArticles (total, page, limit, start) {
  tagList.forEach(li => {
    li.addEventListener('click', (e) => {
      if (e.target.textContent === '全部分類') {
        tagList.forEach(item => item.classList.remove('active'));
        e.target.classList.add('active');
        data = total.filter(item => item);
        articleInit(page, limit, start);
      } else if (e.target.textContent) {
        tagList.forEach(item => item.classList.remove('active'));
        e.target.classList.add('active');
        data = total.filter(item => item.tag === e.target.textContent);
        articleInit(page, limit, start);
      };
    });
  });
};
