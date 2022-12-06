/**
 * 僅渲染+跳轉至作品
 * 待優化
 * 缺新增留言
 */
const myMessages = document.querySelector('.myMessages');
let userData;
axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, headers)
  .then(res => {
    userData = res.data;
    myMessagesInit();
  })
  .catch(err => {
    if (err.request.status === 403) {
      document.location.href = `/user/${localStorage.getItem('userId')}`;
    } else if (err.request.status === 401) {
      clearLogin();
    };
  });

function myMessagesInit () {
  const text = [];
  userData.boughtArticles.forEach(worksId => {
    axios.get(`${baseUrl}/works/${worksId}`)
      .then(res => {
        text.push(`<div class="myMessage my1" data-work="${worksId}">
        <div class="myArticleInfo py-2">
            <p class="d-flex flex-wrap"><span>收藏:${res.data.saveNum}</span>　<span>瀏覽:${res.data.scanNum}</span></p>
            <p class="text-end">${timer(res.data.createDate)}</p>
        </div>
        <article class="row justify-content-around py-3">
            <div class="col col-md-8 ">
                <h1 class="textHidden h2Size pb-3 px-3 px-md-2">${res.data.title}</h1>
                <div class="articleFont px-3 px-md-2">${res.data.content}</div>
            </div>
            <img src="${res.data.cover}" alt="${res.data.cover.title}" class="articleImg col col-md-3 d-none d-md-block">
        </article>
        <ul class="myMessageQA">
        <li class="addNewQA">
            <a href="/article/works/${worksId}" class="d-block text-center">前往新增留言 ></a>
        </li>
        ${getWorksQA(res.data)}
        </ul>
    </div>`);
        myMessages.innerHTML = text.join('');
      })
      .then(() => {
        const articleFont = document.querySelectorAll('.articleFont');
        articleFont.forEach(article => {
          const parent = article.parentElement.parentElement.parentElement;
          article.addEventListener('click', () => {
            location.href = `/article/works/${parent.dataset.work}`;
          });
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};
function getWorksQA (worksData) {
  const myQAText = [];
  worksData['q&a'].forEach(item => {
    if (userData.id === item.userId) {
      myQAText.push(`<li>
      <div class="d-flex align-items-center mt-2 mb-4">
          <div class="myAvatar d-none d-sm-block">${userData.userName[0]}</div>
          <p class="myQuestion">${item.Q.content}</p>
      </div>
      <div class="d-flex flex-column flex-sm-row mb-3">
          <p class="me-2 mb-2 mb-sm-0 flex-shrink-0">作者回復:</p>
          <p class="creatorReply">${item.A.content}</p>
      </div>
      </li>`);
    };
  });
  return myQAText.join('');
};
