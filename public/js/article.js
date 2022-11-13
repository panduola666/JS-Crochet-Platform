const saveIcons = document.querySelector('.saveIcon');
const saveNum = document.querySelector('.saved');
const like = "M20 12.5769C25.2703 7.10248 38.4471 16.682 20 29C1.55287 16.6832 14.7297 7.10248 20 12.5769Z";
const normal = "M29.3942 14.4444C29.08 13.717 28.627 13.0578 28.0606 12.5038C27.4937 11.9481 26.8253 11.5065 26.0918 11.203C25.3312 10.8871 24.5154 10.7254 23.6918 10.7273C22.5364 10.7273 21.409 11.0437 20.4293 11.6413C20.1949 11.7843 19.9723 11.9413 19.7614 12.1124C19.5504 11.9413 19.3278 11.7843 19.0934 11.6413C18.1137 11.0437 16.9864 10.7273 15.8309 10.7273C14.9989 10.7273 14.1926 10.8866 13.4309 11.203C12.6949 11.5077 12.0317 11.946 11.4621 12.5038C10.8949 13.0572 10.4418 13.7166 10.1285 14.4444C9.80276 15.2015 9.63635 16.0054 9.63635 16.8327C9.63635 17.6132 9.79573 18.4265 10.1121 19.2538C10.377 19.9452 10.7567 20.6624 11.2418 21.3866C12.0106 22.5327 13.0676 23.728 14.3801 24.9398C16.5551 26.9483 18.709 28.3358 18.8004 28.3921L19.3559 28.7483C19.602 28.9054 19.9184 28.9054 20.1645 28.7483L20.7199 28.3921C20.8114 28.3335 22.9629 26.9483 25.1403 24.9398C26.4528 23.728 27.5098 22.5327 28.2785 21.3866C28.7637 20.6624 29.1457 19.9452 29.4082 19.2538C29.7246 18.4265 29.884 17.6132 29.884 16.8327C29.8864 16.0054 29.7199 15.2015 29.3942 14.4444ZM19.7614 26.8944C19.7614 26.8944 11.4176 21.5483 11.4176 16.8327C11.4176 14.4444 13.3934 12.5085 15.8309 12.5085C17.5442 12.5085 19.0301 13.4648 19.7614 14.8616C20.4926 13.4648 21.9785 12.5085 23.6918 12.5085C26.1293 12.5085 28.1051 14.4444 28.1051 16.8327C28.1051 21.5483 19.7614 26.8944 19.7614 26.8944Z";
const articleTitle = document.querySelector('.articleTitle>h1');
const articleCreate = document.querySelector('.createDate');
const articleBody = document.querySelector('.articleBody');
const savedNum = document.querySelector('.savedNum');
const articleSell = document.querySelector('.articleSell');
const baseURL = `http://localhost:3000`;
//僅完成當前頁面內容+材料包渲染
const nowHref = window.location.href.split('/');
axios.get(`${baseURL}/${nowHref[nowHref.length-2]}`)
.then(res=>{
    const data = res.data;
    data.forEach(item=>{
        if(nowHref[nowHref.length-1]==item.id&&nowHref[nowHref.length-2]=='works'){
            showDb(item);
            patchImg(baseURL,item,'works');
            //如果有材料包就顯示
            if(item.isSell.title!==''){
                const imgSrc =item.cover.replace(/["']/g,'');
                articleSell.children[0].setAttribute('src',imgSrc);
                articleSell.children[1].children[0].textContent=item.title;
                articleSell.children[1].children[1].textContent=`$${item.isSell.price}`;
            }else{
                articleSell.style.display = 'none';
            };
            optionSave(item,'works');
            
        }else if(nowHref[nowHref.length-1]==item.id&&nowHref[nowHref.length-2]=='articles'){
            showDb(item);
            articleSell.style.display = 'none';
            patchImg(baseURL,item,'articles');
            optionSave(item,'articles');
        }
        
    });
    
})
.catch(err=>localStorage.clear());

//點擊收藏變動
function optionSave(item,which){
    saveIcons.addEventListener('click',()=>{
        if (saveIcons.children[0].getAttribute('d')!=like) {
            saveIcons.children[0].setAttribute('d',like);
            savedNum.textContent++;
            // if()
            axios.patch(`${baseURL}/${which}/${item.id}`,{
                saveNum:savedNum.textContent
            });
            saveNum.textContent = `收藏: ${savedNum.textContent}`
        }else{
            saveIcons.children[0].setAttribute('d',normal);
            savedNum.textContent--;
            axios.patch(`${baseURL}/${which}/${item.id}`,{
                saveNum:savedNum.textContent
            });
            saveNum.textContent = `收藏: ${savedNum.textContent}`
        }
    });
}
function showDb(item){
    articleTitle.textContent = item.title;
    document.title = item.title;
    articleTitle.nextElementSibling.children[0].textContent = `收藏: ${item.saveNum}`;
    articleTitle.nextElementSibling.children[1].textContent = `人氣: ${item.scanNum}`;
    savedNum.textContent = item.saveNum;
    articleCreate.textContent = item.createDate;
    articleBody.innerHTML = item.content;
}
//把內容裡面的圖片新增到資料中
//可以考慮搬到發布新文章頁面
function patchImg(baseURL,item,which){
    const imgRegExp = /^http/g;
    const imgUrl = item.content.split('\"').filter(item=>imgRegExp.test(item));
    if(imgUrl.length != 0){
        const needUrl = [];
        imgUrl.forEach(item=>{
            needUrl.includes(item) ? item : needUrl.push(item)
        })
        axios.patch(`${baseURL}/${which}/${item.id}`,{
            img:needUrl,
            cover:needUrl[0]
        });
    }else{
        axios.patch(`${baseURL}/${which}/${item.id}`,{
            img:["https://upload.cc/i1/2022/11/06/4nbtyE.jpg"],
            cover:"https://upload.cc/i1/2022/11/06/4nbtyE.jpg"
        });
    }
}


//材料包購買




//問答區
const questionText = document.querySelector('.js-questionText');
const addQuestion = document.querySelector('.js-addQuestion');
const questionList = document.querySelector('.js-questionList');
addQuestion.addEventListener('click',()=>{
    if(questionText.value===''){
        questionText.style.borderColor = 'red'; 
    }else{
        questionText.style.borderColor = '#FFBEBA'; 
        const data = getQuestionTime();
        let questionStr = `<li>
        <p>Q: ${questionText.value}
            <span class="small">${data}</span>
        </p>
        <p>A: </p>
        </li>`
        questionList.innerHTML+=questionStr;
        questionText.value='';
    }
})
function getQuestionTime(){
    const timer = new Date()
    const month = timer.getMonth()+1;
    const year = timer.getFullYear()-1911;
    const date = timer.getDate();
    return `${month<10 ? `0${month}` : month}-${date<10 ? `0${date}` : date}`
}