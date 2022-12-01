/**
 * 待優化
 */
const saveIcons = document.querySelector('.saveIcon');
const saved = document.querySelector('.saved');
const like = 'M20 12.5769C25.2703 7.10248 38.4471 16.682 20 29C1.55287 16.6832 14.7297 7.10248 20 12.5769Z';
const normal = 'M29.3942 14.4444C29.08 13.717 28.627 13.0578 28.0606 12.5038C27.4937 11.9481 26.8253 11.5065 26.0918 11.203C25.3312 10.8871 24.5154 10.7254 23.6918 10.7273C22.5364 10.7273 21.409 11.0437 20.4293 11.6413C20.1949 11.7843 19.9723 11.9413 19.7614 12.1124C19.5504 11.9413 19.3278 11.7843 19.0934 11.6413C18.1137 11.0437 16.9864 10.7273 15.8309 10.7273C14.9989 10.7273 14.1926 10.8866 13.4309 11.203C12.6949 11.5077 12.0317 11.946 11.4621 12.5038C10.8949 13.0572 10.4418 13.7166 10.1285 14.4444C9.80276 15.2015 9.63635 16.0054 9.63635 16.8327C9.63635 17.6132 9.79573 18.4265 10.1121 19.2538C10.377 19.9452 10.7567 20.6624 11.2418 21.3866C12.0106 22.5327 13.0676 23.728 14.3801 24.9398C16.5551 26.9483 18.709 28.3358 18.8004 28.3921L19.3559 28.7483C19.602 28.9054 19.9184 28.9054 20.1645 28.7483L20.7199 28.3921C20.8114 28.3335 22.9629 26.9483 25.1403 24.9398C26.4528 23.728 27.5098 22.5327 28.2785 21.3866C28.7637 20.6624 29.1457 19.9452 29.4082 19.2538C29.7246 18.4265 29.884 17.6132 29.884 16.8327C29.8864 16.0054 29.7199 15.2015 29.3942 14.4444ZM19.7614 26.8944C19.7614 26.8944 11.4176 21.5483 11.4176 16.8327C11.4176 14.4444 13.3934 12.5085 15.8309 12.5085C17.5442 12.5085 19.0301 13.4648 19.7614 14.8616C20.4926 13.4648 21.9785 12.5085 23.6918 12.5085C26.1293 12.5085 28.1051 14.4444 28.1051 16.8327C28.1051 21.5483 19.7614 26.8944 19.7614 26.8944Z';
const articleTitle = document.querySelector('.articleTitle>h1');
const articleCreate = document.querySelector('.createDate');
const articleBody = document.querySelector('.articleBody');
const savedNum = document.querySelector('.savedNum');
const articleSell = document.querySelector('.articleSell');
const questionText = document.querySelector('.js-questionText');
const addQuestion = document.querySelector('.js-addQuestion');
const questionList = document.querySelector('.js-questionList');
const authorAvatar = document.querySelector('.authorAvatar');
// 僅完成當前頁面內容+材料包渲染
const nowHref = window.location.href.split('/');
let data;

if (localStorage.getItem('userId')) {
  saveIcons.style.display = 'block';
  saveIcons.parentElement.style.display = 'flex';
  axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, headers)
    .then(res => {
      console.log(res.data);
      if (nowHref[nowHref.length - 2] === 'works') {
        if (res.data.saveArticles.worksId.includes(Number(nowHref[nowHref.length - 1]))) {
          console.log('作品有收藏');
          saveIcons.children[0].setAttribute('d',like);
        } else {
          console.log('作品沒有收藏');
          saveIcons.children[0].setAttribute('d',normal);
        };
      } else if (nowHref[nowHref.length - 2] === 'articles') {
        if (res.data.saveArticles.articlesId.includes(Number(nowHref[nowHref.length - 1]))) {
          console.log('有收藏');
          saveIcons.children[0].setAttribute('d', like);
        } else {
          console.log('沒有');
          saveIcons.children[0].setAttribute('d', normal);
        };
      };
    });
} else {
  saveIcons.parentElement.style.display = 'none';
};
axios.get(`${baseUrl}/${nowHref[nowHref.length - 2]}/${nowHref[nowHref.length - 1]}?_expand=user`)
  .then(res => {
    data = res.data;
    if (nowHref[nowHref.length - 2] === 'works') {
      showDb();
      // 如果材料包通過審核就顯示
      if (typeof data.isSell === 'object' && data.isSell.canSell === '通過') {
        articleSell.children[0].setAttribute('src', data.cover);
        articleSell.children[1].children[0].textContent = data.title;
        articleSell.children[1].children[1].textContent = `$${data.isSell.price}`;
      } else if (typeof data.isSell === 'string') {
        articleSell.style.display = 'none';
        articleBody.innerHTML += `<span>購買鏈結:<a href="${data.isSell}">${data.isSell}</a></span>`;
      } else {
        articleSell.style.display = 'none';
      };
      optionSave('works');
      renderQA();
      // 材料包購買
      articleSell.addEventListener('click', (e) => {
        if (e.target.nodeName === 'BUTTON') {
          axios.get(`${baseUrl}/goods`)
            .then(res => {
              res.data.forEach(work => {
                if (work.workId === parseInt(nowHref[nowHref.length - 1])) {
                  location.href = `/commodity/${work.id}`;
                };
              });
            });
        };
      });
    } else if (nowHref[nowHref.length - 2] === 'articles') {
      showDb();
      articleSell.style.display = 'none';
      optionSave('articles');
    };

    // 問答區
    if (localStorage.getItem('userId')) {
      axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, headers)
        .then(res => {
          if (res.data.boughtArticles.includes(data.id) || res.data.id === data.userId) {
          // 有購買該材料包或該文作者
            questionList.classList.remove('qaMask');
            // 新增留言
            addQuestion.addEventListener('click', () => {
              if (questionText.value === '') {
                questionText.style.borderColor = 'red';
                return;
              };
              questionText.style.borderColor = '#FFBEBA';
              const questionStr = `<li>
                <p>Q: ${questionText.value}
                    <span class="small">${new Date().toLocaleDateString()}</span>
                </p>
                <p class="creatorReply">A: <span class="small"></span></p>
                </li>`;
              questionList.innerHTML += questionStr;
              const newQA = data['q&a'];
              newQA.push({
                userId: parseInt(localStorage.getItem('userId')),
                Q: {
                  content: questionText.value,
                  timer: new Date().getTime()
                },
                A: {
                  content: '',
                  timer: '等待作者回覆'
                }
              });
              axios.patch(`${baseUrl}/${nowHref[nowHref.length - 2]}/${data.id}`, {
                'q&a': newQA
              })
                .then(res => {
                  questionText.value = '';
                  return axios.get(`${baseUrl}/${nowHref[nowHref.length - 2]}/${data.id}`);
                })
                .then(res => {
                  data = res.data;
                  renderQA();
                })
                .catch(err => {
                  console.log(err);
                });
            });
          } else {
            // 沒有購買材料包也不是作者
            questionList.classList.add('qaMask');
            addQuestion.addEventListener('click', () => {
              Swal.fire({
                icon: 'error',
                title: '發送錯誤!',
                text: '僅購買材料包用戶可以留言'
              });
            });
          };
        });
    };
  })
  .catch(() => localStorage.clear());

// 問答區渲染
function renderQA () {
  const text = [];
  data['q&a'].forEach(item => {
    text.push(`<li>
        <p>Q: ${item.Q.content} <span>${new Date(item.Q.timer).toLocaleDateString()}</span></p>
        <p class="creatorReply">A: ${item.A.content}<span>${typeof item.A.timer === 'string' ? item.A.timer : new Date(item.A.timer).toLocaleDateString()}</span></p>
    </li>`);
  });
  questionList.innerHTML = text.join('');
};

// 點擊收藏變動
function optionSave (which) {
  saveIcons.addEventListener('click', () => {
    if (saveIcons.children[0].getAttribute('d') !== like) {
      saveIcons.children[0].setAttribute('d', like);
      savedNum.textContent++;
      axios.patch(`${baseUrl}/${which}/${data.id}`, {
        saveNum: savedNum.textContent
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '添加收藏成功'
        });
      });

      saved.textContent = `收藏: ${savedNum.textContent}`;
      axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, headers)
        .then(res => {
          console.log(res.data);
          const newSaveArticle = res.data.saveArticles;
          if (nowHref[nowHref.length - 2] === 'works') {
            newSaveArticle.worksId.includes(data.id) ? newSaveArticle.worksId : newSaveArticle.worksId.push(data.id);
          } else if (nowHref[nowHref.length - 2] === 'articles') {
            newSaveArticle.articlesId.includes(data.id) ? newSaveArticle.articlesId : newSaveArticle.articlesId.push(data.id);
          };
          axios.patch(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, {
            saveArticles: newSaveArticle
          }, headers)
          .then(res=>console.log(res))
            .catch(() => clearLogin());
        });
    } else {
      saveIcons.children[0].setAttribute('d', normal);
      savedNum.textContent--;
      axios.patch(`${baseUrl}/${which}/${data.id}`, {
        saveNum: savedNum.textContent
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '已取消收藏'
        });
      });

      saved.textContent = `收藏: ${savedNum.textContent}`;
      axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, headers)
        .then(res => {
          const newSaveArticle = res.data.saveArticles;
          if (nowHref[nowHref.length - 2] === 'works') {
            const deleteIndex = newSaveArticle.worksId.indexOf(data.id);
            newSaveArticle.worksId.splice(deleteIndex, 1);
          } else if (nowHref[nowHref.length - 2] === 'articles') {
            const deleteIndex = newSaveArticle.articlesId.indexOf(data.id);
            newSaveArticle.articlesId.splice(deleteIndex, 1);
          }
          axios.patch(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, {
            saveArticles: newSaveArticle
          }, headers)
            .catch(() => clearLogin());
        });
    }
  });
}

// 文章資料渲染
function showDb () {
  authorAvatar.textContent = data.user.userName.split('')[0];
  authorAvatar.nextElementSibling.textContent = data.user.userName;
  articleTitle.textContent = data.title;
  document.title = data.title;
  saved.textContent = `收藏: ${data.saveNum}`;
  saved.nextElementSibling.textContent = `人氣: ${data.scanNum}`;
  savedNum.textContent = data.saveNum;
  articleCreate.textContent = data.createDate;
  articleBody.innerHTML = data.content;
}
// 登入超過1小時
function clearLogin () {
  localStorage.clear();
  Swal.fire({
    icon: 'error',
    title: '登入過期!',
    text: '請重新登入'
  });
  setTimeout(() => {
    document.location.href = '/login';
  }, 2000);
};
