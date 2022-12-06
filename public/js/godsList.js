/**
 * 作品畫面渲染-完成
 */

const tagList = document.querySelectorAll('.tagList>li');
const sortBTN = document.querySelectorAll('.sortBTN>button');
const pageList = document.querySelector('.pageList');
const goods = document.querySelector('.goods');

let data;
axios.get(`${baseUrl}/goods`)
  .then(res => {
    data = res.data;
    const page = 1;// 頁數
    const limit = 6;// 一頁幾個
    const start = 0;
    articleInit(page, limit, start);
    filterArticles(page, limit, start);
    typeArticles(res.data, page, limit, start);
    // 分頁
    pagination(page, limit, start);
  });
function pagination (page, limit, start) {
  const newData = data.filter(item => !item.isClose);
  pageList.children[0].addEventListener('click', () => {
    if (page > 1) {
      page--;
      start -= limit;
      articleInit(page, limit, start);
      pageList.children[1].textContent = `第${page}/${Math.ceil(newData.length / limit)}頁`;
    }
  });
  pageList.children[2].addEventListener('click', () => {
    if (page < Math.ceil(newData.length / limit)) {
      page++;
      start += limit;
      articleInit(page, limit, start);
      pageList.children[1].textContent = `第${page}/${Math.ceil(newData.length / limit)}頁`;
    }
  });
  pageList.children[1].textContent = `第${page}/${Math.ceil(newData.length / limit)}頁`;
}

function articleInit (page, limit, start) {
  const newData = data.filter(item => !item.isClose);
  const sliceData = newData.slice(start, limit * page);
  const str = [];
  sliceData.forEach(item => {
    str.push(` <li class="card col-6 col-md-4" data-id="${item.id}">
    <img src="${item.cover}" class="card-img-top pointer" alt="${item.title}">
    <div class="card-body">
      <h1 class="textHidden-2">${item.title}</h1>
    </div>
  </li>`);
  });
  goods.innerHTML = str.join('');
  pagination(page, limit, start);
  // 跳轉頁面
  const good = goods.querySelectorAll('li');
  good.forEach(li => {
    li.addEventListener('click', () => {
      location.href = `/commodity/${li.dataset.id}`;
    });
  });
}

// 篩選
function filterArticles (page, limit, start) {
  sortBTN.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target.textContent === '綜合') {
        sortBTN.forEach(item => item.classList.remove('active'));
        e.target.classList.add('active');
        data = data.sort((a, b) => a.id - b.id);
        articleInit(page, limit, start);
      };

      if (e.target.textContent === '推薦') {
        sortBTN.forEach(item => item.classList.remove('active'));
        e.target.classList.add('active');
        data = data.sort((a, b) => b.isRecommend - a.isRecommend);
        articleInit(page, limit, start);
      };

      if (e.target.textContent === '熱門') {
        sortBTN.forEach(item => item.classList.remove('active'));
        e.target.classList.add('active');
        data = data.sort((a, b) => b.sellNum - a.sellNum);
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
        data = total.filter(item => item.type === e.target.textContent);
        articleInit(page, limit, start);
      }
    });
  });
}
