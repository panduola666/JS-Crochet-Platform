const worksChange = document.querySelector('.worksChange');
const worksImgUrl = document.querySelector('.worksImgUrl');
const saveIcon = document.querySelector('.saveIcon');
const goodsChangeLeft = document.querySelector('.leftBTN');
const goodsChangeRight = document.querySelector('.rightBTN');
const goodsRecommend = document.querySelector('.goodsRecommend');
const articlesTitle = document.querySelectorAll('.articlesTitle>p');
const articlesList = document.querySelectorAll('.articlesList');
const like =
'M20 12.5769C25.2703 7.10248 38.4471 16.682 20 29C1.55287 16.6832 14.7297 7.10248 20 12.5769Z';
const normal =
'M29.3942 14.4444C29.08 13.717 28.627 13.0578 28.0606 12.5038C27.4937 11.9481 26.8253 11.5065 26.0918 11.203C25.3312 10.8871 24.5154 10.7254 23.6918 10.7273C22.5364 10.7273 21.409 11.0437 20.4293 11.6413C20.1949 11.7843 19.9723 11.9413 19.7614 12.1124C19.5504 11.9413 19.3278 11.7843 19.0934 11.6413C18.1137 11.0437 16.9864 10.7273 15.8309 10.7273C14.9989 10.7273 14.1926 10.8866 13.4309 11.203C12.6949 11.5077 12.0317 11.946 11.4621 12.5038C10.8949 13.0572 10.4418 13.7166 10.1285 14.4444C9.80276 15.2015 9.63635 16.0054 9.63635 16.8327C9.63635 17.6132 9.79573 18.4265 10.1121 19.2538C10.377 19.9452 10.7567 20.6624 11.2418 21.3866C12.0106 22.5327 13.0676 23.728 14.3801 24.9398C16.5551 26.9483 18.709 28.3358 18.8004 28.3921L19.3559 28.7483C19.602 28.9054 19.9184 28.9054 20.1645 28.7483L20.7199 28.3921C20.8114 28.3335 22.9629 26.9483 25.1403 24.9398C26.4528 23.728 27.5098 22.5327 28.2785 21.3866C28.7637 20.6624 29.1457 19.9452 29.4082 19.2538C29.7246 18.4265 29.884 17.6132 29.884 16.8327C29.8864 16.0054 29.7199 15.2015 29.3942 14.4444ZM19.7614 26.8944C19.7614 26.8944 11.4176 21.5483 11.4176 16.8327C11.4176 14.4444 13.3934 12.5085 15.8309 12.5085C17.5442 12.5085 19.0301 13.4648 19.7614 14.8616C20.4926 13.4648 21.9785 12.5085 23.6918 12.5085C26.1293 12.5085 28.1051 14.4444 28.1051 16.8327C28.1051 21.5483 19.7614 26.8944 19.7614 26.8944Z';
let top4WorksData;
let articlesData;
let recommendGoods;
let worksChangeLis;
let worksImg;
let count = 0;
axios.get(`${baseUrl}/works`)
  .then(res => {
    top4WorksData = res.data.sort((a, b) => b.saveNum - a.saveNum).slice(0, 4);
    worksInit();
    renderWorksImg();
    carousel();
    saveIconClick();
    changeHrefClick();
  });

axios.get(`${baseUrl}/articles`)
  .then(res => {
    articlesData = res.data;
    // 最新最熱切換+畫面渲染
    articlesTitle.forEach(title => {
      readerArticles(title);
      title.addEventListener('click', () => {
        articlesTitle.forEach(p => p.classList.remove('active'));
        title.classList.add('active');
        readerArticles(title);
      });
    });
    // 點擊數增加
    articlesList.forEach(article => {
      article.addEventListener('click',(e)=>{
        articlesData.forEach(item=>{
          if (item.title === article.children[1].children[0].textContent.trim()) {
            item.scanNum++;
            axios.patch(`${baseUrl}/articles/${item.id}`, {
              scanNum: item.scanNum
            });
            window.location.href = `article/articles/${item.id}`;
          };
        });
      });
    });
  });

axios.get(`${baseUrl}/goods`)
  .then(res => {
    recommendGoods = res.data.filter(item => item.isRecommend);
    goodsInit();
    // 推薦商品-左右切換
    const goodsRecommendLi = goodsRecommend.querySelectorAll('li');
    goodsRecommendLi.forEach(li => {
      li.addEventListener('click', () => {
        location.href = `/commodity/${li.dataset.id}`;
      });
    });
    goodsChangeLeft.addEventListener('click', () => {
      const first = recommendGoods.shift();
      recommendGoods.push(first);
      goodsInit();
    });
    goodsChangeRight.addEventListener('click', () => {
      const last = recommendGoods.pop();
      recommendGoods.unshift(last);
      goodsInit();
    });
  });

// 熱門作品-左側渲染
function worksInit () {
  const workStr = [];
  top4WorksData.forEach((item) => {
    workStr.push(`<li class="textHidden pointer" data-id="${item.id}">
    <h3>${item.title}</h3>`);
  });
  worksChange.innerHTML = workStr.join('');
  worksChangeLis = worksChange.querySelectorAll('li');
  worksImg = document.querySelector('.worksImg');
};

// 熱門作品-畫面完整渲染
function renderWorksImg () {
  // 左側切換
  worksChangeLis.forEach(li => li.classList.remove('active'));
  worksChangeLis[count % 4].classList.add('active');
  // 右側圖片
  worksChangeLis.forEach(li => {
    if (li.classList.contains('active')) {
      top4WorksData.forEach(data => {
        if (data.id === Number(li.dataset.id)) {
          // 圖片+標題切換
          worksImgUrl.src = data.cover;
          worksImgUrl.nextElementSibling.children[0].textContent = data.title;
          // icon渲染
          if (localStorage.getItem('userId')) {
            axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, headers)
              .then(res => {
                saveIcon.style.display = 'block';
                const userSave = res.data.saveArticles.worksId;
                if (userSave.includes(data.id)) {
                  saveIcon.children[0].setAttribute('d', like);
                } else {
                  saveIcon.children[0].setAttribute('d', normal);
                };
              })
              .catch((err) => {
                console.log(err);
                saveIcon.style.display = 'none';
                localStorage.clear();
              });
          };
        };
      });
    };
  });
  count++;
};

// 熱門作品-輪播邏輯
function carousel () {
  let worksCarousel = setInterval(renderWorksImg, 1500);
  worksChangeLis.forEach((li, index) => {
    li.addEventListener('mouseenter', () => {
      clearInterval(worksCarousel);
        worksChangeLis.forEach(item => item.classList.remove('active'));
        li.classList.add('active');
        count = index;
        renderWorksImg();
    });
    li.addEventListener('mouseleave', () => {
      worksCarousel = setInterval(renderWorksImg, 1500);
    });
  });
  worksImg.addEventListener('mouseenter', () => clearInterval(worksCarousel));
  worksImg.addEventListener('mouseleave', () => {
    worksCarousel = setInterval(renderWorksImg, 1500);
  });
};
// 熱門作品-點擊跳轉
function changeHrefClick () {
  worksChangeLis.forEach(li => {
    li.addEventListener('click', (e) => {
      top4WorksData.forEach(data => {
        if (data.id === Number(li.dataset.id)) {
          data.scanNum++;
          axios.patch(`${baseUrl}/works/${data.id}`, {
            scanNum: data.scanNum
          })
          .then(res => window.location.href = `/article/works/${data.id}`);
        };
      });
    });
  });
  worksImg.addEventListener('click', (e) => {
    top4WorksData.forEach(item => {
      if (item.title === worksImg.children[1].children[0].textContent.trim() && e.target.nodeName !== 'path' && e.target.nodeName !== 'svg' && e.target.nodeName !== 'rect') {
        item.scanNum++;
        axios.patch(`${baseUrl}/works/${item.id}`,{
          scanNum: item.scanNum
        })
        .then(res => window.location.href = `/article/works/${item.id}`);
      };
    });
  });
};

// 熱門作品-收藏數據變更
// 這邊很容易服務器崩潰
function saveIconClick () {
  worksImg.addEventListener('click', (e) => {
    if (e.target.nodeName === 'svg' || e.target.nodeName === 'path' || e.target.nodeName === 'rect') {
      axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, headers)
        .then(res => {
          if (saveIcon.children[0].getAttribute('d') == normal) {
            // 收藏
            saveIcon.children[0].setAttribute('d', like);
            // 文章收藏數
            top4WorksData.forEach(item => {
              if (item.title === worksImg.children[1].children[0].textContent) {
                item.saveNum++;
                axios.patch(`${baseUrl}/works/${item.id}`, {
                  saveNum: item.saveNum
                });
                // 用戶收藏更新
                const newSaveArticle = res.data.saveArticles;
                newSaveArticle.worksId.includes(item.id) ? newSaveArticle.worksId : newSaveArticle.worksId.push(item.id);
                axios.patch(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, {
                  saveArticles: newSaveArticle
                }, headers)
                  .then(() => {
                    Swal.fire({
                      icon: 'success',
                      title: '添加收藏成功'
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    clearLogin();
                  });
              };
            });
          } else {
          // 取消收藏
            saveIcon.children[0].setAttribute('d', normal);
            // 文章收藏數
            top4WorksData.forEach(item => {
              if (item.title === worksImg.children[1].children[0].textContent) {
                item.saveNum--;
                axios.patch(`${baseUrl}/works/${item.id}`, {
                  saveNum: item.saveNum
                });

                // 用戶收藏更新
                const newSaveArticle = res.data.saveArticles;
                const deleteIndex = newSaveArticle.worksId.indexOf(item.id);
                newSaveArticle.worksId.splice(deleteIndex, 1);
                axios.patch(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, {
                  saveArticles: newSaveArticle
                }, headers)
                  .then(() => {
                    Swal.fire({
                      icon: 'success',
                      title: '已取消收藏'
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    clearLogin();
                  });
              };
            });
          };
        })
        .catch((err) => {
          console.log(err);
          clearLogin();
        });
    };
  });
};

// 文章-畫面渲染
function readerArticles (item) {
  const top3Article = articlesData.sort((a, b) => b.saveNum - a.saveNum).slice(0, 3);
  const new3Article = articlesData.sort((a, b) => new Date(b.createDate) - new Date(a.createDate)).slice(0, 3);
  if (item.classList.contains('active')) {
    if (item.textContent === '最新文章') {
      for (let i = 0, j = 0; i < new3Article.length, j < articlesList.length; i++, j++) {
        articlesList[j].children[0].children[1].children[0].textContent = new3Article[i].title;
        articlesList[j].children[1].children[0].textContent = new3Article[i].title;
        articlesList[j].children[0].children[0].setAttribute('src', new3Article[i].cover);
        articlesList[j].children[1].children[1].innerHTML = new3Article[i].content;
      };
    } else if (item.textContent === '熱門文章') {
      for (let i = 0, j = 0; i < top3Article.length, j < articlesList.length; i++, j++) {
        articlesList[j].children[0].children[1].children[0].textContent = top3Article[i].title;
        articlesList[j].children[1].children[0].textContent = top3Article[i].title;
        articlesList[j].children[0].children[0].setAttribute('src', top3Article[i].cover);
        articlesList[j].children[1].children[1].innerHTML = top3Article[i].content;
      };
    };
  };
};

// 推薦商品-畫面渲染
function goodsInit () {
  const str = [];
  recommendGoods.forEach(item => {
    str.push(`<li data-id="${item.id}">
    <img src="${item.cover}" alt="${item.title}">
    <h3 class="h3Size">${item.title}</h3>
    </li>`);
  });
  if (screen.width > 768) {
    str.push(`
    <li class="d-flex align-items-center text-start">
    <p class="h3Size textHidden">現在還沒有其他商品<br><a href="/goodsList">來去逛逛 ></a></p>
    </li>`);
  } else if (recommendGoods.length < 1) {
    str.push(`
    <li class="d-flex align-items-center text-start">
    <p class="h3Size textHidden">現在還沒有其他商品<br><a href="/goodsList">來去逛逛 ></a></p>
    </li>`);
  }
  goodsRecommend.innerHTML = str.join('');
  if (screen.width < 768 && recommendGoods.length < 2) goodsRecommend.querySelectorAll('li').forEach(li => li.style.transform = 'translateX(25vw)');
  
};
