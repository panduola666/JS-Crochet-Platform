/**
 * 僅渲染+跳轉至作品
 * 待優化
 * 缺新增留言
 */
const myMessages = document.querySelector('.myMessages');
let userData;
axios.get(`${baseUrl}/600/users/${ localStorage.getItem('userId') }`, headers)
.then(res=>{
    userData = res.data;
    myMessagesInit();
    
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

function myMessagesInit(){
    let text = '';
    userData.boughtArticles.forEach(worksId=>{
        axios.get(`${baseUrl}/works/${worksId}`)
        .then(res=>{
            text += `<div class="myMessage my1" data-workId="${worksId}">
        <div class="myArticleInfo py-2">
            <p class="d-flex flex-wrap"><span>收藏:${ res.data.saveNum }</span>　<span>瀏覽:${ res.data.scanNum }</span></p>
            <p class="text-end">${ timer(res.data.createDate) }</p>
        </div>
        <article class="row justify-content-around py-3">
            <div class="col col-md-8 ">
                <h1 class="textHidden h2Size pb-3">${ res.data.title }</h1>
                <div class="articleFont">${ res.data.content }</div>
            </div>
            <img src="${ res.data.cover }" alt="${ res.data.cover.title }" class="articleImg col col-md-3 d-none d-md-block">
        </article>
        <ul class="myMessageQA">
        <li class="addNewQA">
            <a href="/article/works/${worksId}" class="d-block text-center">前往新增留言 ></a>
        </li>
        ${ getWorksQA(res.data)}
        </ul>
    </div>`;
    myMessages.innerHTML = text;
    })
    .then(()=>{
        const articleFont =document.querySelectorAll('.articleFont');
        articleFont.forEach(article=>{
            const parent = article.parentElement.parentElement.parentElement;
            article.addEventListener('click',()=>{
                location.href = `/article/works/${parent.dataset.workid}`;
            })
        })
    })
    .catch(res=>{
        console.log(err);
    })
    });
};
function getWorksQA(worksData){
    let myQAText = '';
    worksData['q&a'].forEach(item=>{
        console.log(item);
        if(userData.id == item.userId){
            
            myQAText += `<li>
            <div class="d-flex align-items-center mt-2 mb-4">
                <div class="myAvatar d-none d-sm-block">${userData.userName[0]}</div>
                <p class="myQuestion">${item.Q.content}</p>
            </div>
            <div class="d-flex flex-column flex-sm-row mb-3">
                <p class="me-2 mb-2 mb-sm-0 flex-shrink-0">作者回復:</p>
                <p class="creatorReply">${item.A.content}</p>
            </div>
        </li>`
        }
    });
    return myQAText;
};