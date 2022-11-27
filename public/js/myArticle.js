/**
 * 完成
 */
const myArticles = document.querySelector('.myArticles');
let data;
axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}?_embed=articles&_embed=works`, headers)
    .then(res=>{
        data = res.data;
        const {articles, works} = data;
        worksInit(works);
        articlesInit(articles);
        qaInit(works);
        //文章點擊跳轉
        const articleFont = document.querySelectorAll('.articleFont');
        const actionBTN = document.querySelectorAll('.actionBTN');
        articleFont.forEach(article => {
            const articleId = article.parentElement.parentElement.parentElement;
            article.addEventListener('click',(e) => {
                if( articleId.dataset.workid ){
                    location.href = `/article/works/${ articleId.dataset.workid }`;
                }else if( articleId.dataset.articleid ){
                    location.href = `/article/articles/${ articleId.dataset.articleid }`;
                };
            });
        });
        //文章編輯+刪除功能
        actionBTN.forEach(btn => {
            const articleId = btn.parentElement.parentElement;
            btn.addEventListener('click',(e) => {
                if(e.target.textContent === '編輯'){
                    if( articleId.dataset.workid ){
                        localData('works', articleId.dataset.workid);
                    }else if( articleId.dataset.articleid ){
                        localData('articles', articleId.dataset.articleid);
                    };
                }else if(e.target.textContent === '刪除'){
                    if( articleId.dataset.workid ){
                        axios.delete(`${baseUrl}/works/${ articleId.dataset.workid }`)
                            .then(res => location.reload() );
                    }else if( articleId.dataset.articleid ){
                        axios.delete(`${baseUrl}/articles/${ articleId.dataset.articleid }`)
                            .then(res => location.reload() );
                    };
                };
            });
        });
        textChange();
    })
    .catch(err => {
        if(err.request.status === 403){
            document.location.href = `/user/${ localStorage.getItem('userId') }`;
        }else if (err.request.status === 401){
            localStorage.clear();
            Swal.fire({
                icon : 'error',
                title : '登入過期!',
                text : '請重新登入'
            });
            setTimeout(() => {
                document.location.href = '/login';
            }, 2000);
        };
    });
//作品渲染
function worksInit(works){
    let text = '';
    works.forEach(work => {
        text += `<div class="myArticle my1" data-workId="${ work.id }">
        <div class="myArticleInfo py-2">
            <p class="d-flex flex-wrap"><span>收藏:${ work.saveNum }</span>　<span>瀏覽:${ work.scanNum }</span></p>
            <p class="text-end">${ timer(work.createDate) }</p>
        </div>
        <div class="d-flex justify-content-between px-3">
            <h1 class="textHidden h2Size">${ work.title }</h1>
            <div class="actionBTN">
                <button>編輯</button>
                <button>刪除</button>
            </div>
        </div>
        <article class="row justify-content-around py-3">
            <div class="col col-md-8 ">
                <div class="articleFont">
                    ${ work.content }
                </div>
            </div>
            <img src="${ work.cover }" alt="${ work.title }" class="articleImg col col-md-3 d-none d-md-block">
        </article>
        <div class="articleBTN">
            <button type="button" class="active" data-id="${work.id}">待回應( ${ needReply( work['q&a'] ).length } )</button>
            <button type="button" data-id="${work.id}">已回應( ${ replied( work['q&a'] ).length } )</button>
        </div>
        <ul class="myArticleQA">
        ${ renderQA(needReply( work['q&a'] )) }
        </ul>
    </div>`
    });
    myArticles.innerHTML = text;
};
//QA渲染
function renderQA(qaData){
    let qaText = '';
    if(qaData){
        qaData.forEach(item=>{
            // console.log(item);
            qaText += `<li>
            <p>Q: <span>${item.Q.content}</span></p>
            <div class="d-flex align-items-center justify-content-end my-2">
                <label for="answer" aria-label="answer">
                    <textarea name="answer" id="answer" rows="2" placeholder="請輸入回覆內容...">${item.A.content}</textarea>
                </label>
                <div class="myAvatar d-none d-sm-block">${ data.userName[0] }</div>
            </div>
        </li>`
        });
    };
return qaText;
};
//信息過濾
function needReply(qaData){
    const needReply = qaData.filter(item => item.A.content == '');
    return needReply;
};
function replied(qaData){
    const replied = qaData.filter(item => item.A.content !== '');
    return replied;
};
//QA回應切換
function qaInit(works){
    const articleBTN = document.querySelectorAll('.articleBTN');
    //回應狀態渲染
    articleBTN.forEach(btn => {
        btn.addEventListener('click',(e) => {
            if(e.target.textContent.trim()[0] === '待'){
                btn.children[0].classList.add('active');
                btn.children[1].classList.remove('active');
                btn.nextElementSibling.style.display = btn.children[0].textContent.includes('0') ? 'none' : 'block';
                works.forEach(work=>{
                    if(Number(e.target.dataset.id) === work.id){
                        btn.nextElementSibling.innerHTML = renderQA( needReply( work['q&a'] ));
                    };
                });
                textChange();
            }else if(e.target.textContent.trim()[0] === '已'){
                btn.children[0].classList.remove('active');
                btn.children[1].classList.add('active');
                btn.nextElementSibling.style.display = btn.children[1].textContent.includes('0') ? 'none' : 'block';
                works.forEach(work=>{
                    if(Number(e.target.dataset.id) === work.id){
                        btn.nextElementSibling.innerHTML = renderQA( replied( work['q&a'] ));
                    };
                });
                textChange();
            };
        });
    });
    
};
//文章渲染
function articlesInit(articles){
    let text = '';
    articles.forEach(article => {
        text += `<div class="myArticle my1" data-articleId="${ article.id }">
        <div class="myArticleInfo py-2">
            <p class="d-flex flex-wrap"><span>收藏:${ article.saveNum }</span>　<span>瀏覽:${ article.scanNum }</span></p>
            <p class="text-end">${ timer(article.createDate) }</p>
        </div>
        <div class="d-flex justify-content-between px-3">
            <h1 class="textHidden h2Size">${ article.title }</h1>
            <div class="actionBTN">
                <button>編輯</button>
                <button>刪除</button>
            </div>
        </div>
        <article class="row justify-content-around py-3">
            <div class="col col-md-8 ">
                <div class="articleFont">
                    ${ article.content }
                </div>
            </div>
            <img src="${ article.cover }" alt="${ article.title }" class="articleImg col col-md-3 d-none d-md-block">
        </article>
    </div>`
    });
    myArticles.innerHTML += text;
};
//留言
function textChange(){
    const answer = document.querySelectorAll('#answer');
    answer.forEach(textarea => {
        textarea.addEventListener('change',()=>{
            const articleId = textarea.parentElement.parentElement.parentElement.parentElement.parentElement;
            if( articleId.dataset.workid ){
                qaPatch( articleId.dataset.workid, textarea)
                .then(res=>{
                    return axios.patch(`${baseUrl}/works/${ articleId.dataset.workid }`,{
                        "q&a" : res
                    });
                })
                .then(res => location.reload() );
            };
        });
        if( textarea.value ){
            textarea.style.border = 'none';
            textarea.style.background = 'none';
        };
    });
};
async function localData(which,id){
    localStorage.removeItem('works');
    localStorage.removeItem('articles');
    const res = await axios.get(`${baseUrl}/${which}/${id}`);
    localStorage.setItem(which, res.data.id);
    location.href = `/addArticle`;
};
async function qaPatch(id,el){
    const res = await axios.get(`${baseUrl}/works/${id}`);
    const QAList = res.data['q&a'];
    let thisQA;
    QAList.forEach(item=>{
        if(item.Q.content === el.parentElement.parentElement.previousElementSibling.children[0].textContent){
            thisQA = item;
        }
    })
    const index = QAList.indexOf(thisQA);
    QAList[index].A.content = el.value;
    if(el.value === ''){
        QAList[index].A.timer = '等待作者回覆'
    }else{
        QAList[index].A.timer = new Date().getTime();
    }
    console.log(QAList);
    return QAList;
};

