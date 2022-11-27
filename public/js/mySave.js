/**
 * 畫面渲染+點擊跳轉
 * 待優化
 */
const myFavorites = document.querySelector('.myFavorites');
let userData;
axios.get(`${baseUrl}/600/users/${ localStorage.getItem('userId') }`, headers)
.then(res=>{
    userData = res.data;
    mySaveInit();
    
})
.catch(err=>{
    localStorage.clear();
    Swal.fire({
        icon: 'error',
        title: '登入過期!',
        text: '請重新登入'
    });
    setTimeout(() => {
        document.location.href = '/login';
    }, 2000);
});

function mySaveInit(){
    let text = '';
    axios.get(`${baseUrl}/works`)
    .then(res=>{
        userData.saveArticles.worksId.forEach(worksId=>{
            res.data.forEach(item=>{
                if(item.id == worksId){
                    text += `<div class="mySave my1" data-workId="${worksId}">
                        <div class="myArticleInfo py-2">
                            <p class="d-flex flex-wrap"><span>收藏:${ item.saveNum }</span>　<span>瀏覽:${ item.scanNum }</span></p>
                            <p class="text-center">${ timer(item.createDate) }</p>
                        </div>
                        <article class="row justify-content-around py-3">
                            <div class="col col-md-8 ">
                                <h1 class="textHidden h2Size pb-3">${ item.title }</h1>
                                <div class="articleFont">${ item.content }</div>
                            </div>
                            <img src="${ item.cover }" alt="${ item.cover.title }" class="articleImg col col-md-3 d-none d-md-block">
                        </article>
                    </div>`;
                }
            })
        });
        
        return axios.get(`${baseUrl}/articles`)
    })
    .then((res)=>{
        userData.saveArticles.articlesId.forEach(articlesId=>{
            res.data.forEach(item=>{
                if(item.id == articlesId){
                    text += `<div class="mySave my1" data-articleId="${articlesId}">
                        <div class="myArticleInfo py-2">
                            <p class="d-flex flex-wrap"><span>收藏:${ item.saveNum }</span>　<span>瀏覽:${ item.scanNum }</span></p>
                            <p class="text-center">${ timer(item.createDate) }</p>
                        </div>
                        <article class="row justify-content-around py-3">
                            <div class="col col-md-8 ">
                                <h1 class="textHidden h2Size pb-3">${ item.title }</h1>
                                <div class="articleFont">${ item.content }</div>
                            </div>
                            <img src="${ item.cover }" alt="${ item.cover.title }" class="articleImg col col-md-3 d-none d-md-block">
                        </article>
                    </div>`;
                }
            })
        myFavorites.innerHTML = text
        })
        const articleFont =document.querySelectorAll('.articleFont');
        articleFont.forEach(item=>{
            item.addEventListener('click',()=>{
                const parent = item.parentElement.parentElement.parentElement;
                if(parent.dataset.workid){
                    location.href = `/article/works/${parent.dataset.workid}`;
                }else if(parent.dataset.articleid){
                    location.href = `/article/articles/${parent.dataset.articleid}`;
                }
            })
        })
    })
};