//熱門作品輪播切換- 完成
const worksChange = document.querySelector(".worksChange");
const worksImgUrl = document.querySelector(".worksImgUrl");
const saveIcon = document.querySelector(".saveIcon");
const like =
"M20 12.5769C25.2703 7.10248 38.4471 16.682 20 29C1.55287 16.6832 14.7297 7.10248 20 12.5769Z";
const normal =
"M29.3942 14.4444C29.08 13.717 28.627 13.0578 28.0606 12.5038C27.4937 11.9481 26.8253 11.5065 26.0918 11.203C25.3312 10.8871 24.5154 10.7254 23.6918 10.7273C22.5364 10.7273 21.409 11.0437 20.4293 11.6413C20.1949 11.7843 19.9723 11.9413 19.7614 12.1124C19.5504 11.9413 19.3278 11.7843 19.0934 11.6413C18.1137 11.0437 16.9864 10.7273 15.8309 10.7273C14.9989 10.7273 14.1926 10.8866 13.4309 11.203C12.6949 11.5077 12.0317 11.946 11.4621 12.5038C10.8949 13.0572 10.4418 13.7166 10.1285 14.4444C9.80276 15.2015 9.63635 16.0054 9.63635 16.8327C9.63635 17.6132 9.79573 18.4265 10.1121 19.2538C10.377 19.9452 10.7567 20.6624 11.2418 21.3866C12.0106 22.5327 13.0676 23.728 14.3801 24.9398C16.5551 26.9483 18.709 28.3358 18.8004 28.3921L19.3559 28.7483C19.602 28.9054 19.9184 28.9054 20.1645 28.7483L20.7199 28.3921C20.8114 28.3335 22.9629 26.9483 25.1403 24.9398C26.4528 23.728 27.5098 22.5327 28.2785 21.3866C28.7637 20.6624 29.1457 19.9452 29.4082 19.2538C29.7246 18.4265 29.884 17.6132 29.884 16.8327C29.8864 16.0054 29.7199 15.2015 29.3942 14.4444ZM19.7614 26.8944C19.7614 26.8944 11.4176 21.5483 11.4176 16.8327C11.4176 14.4444 13.3934 12.5085 15.8309 12.5085C17.5442 12.5085 19.0301 13.4648 19.7614 14.8616C20.4926 13.4648 21.9785 12.5085 23.6918 12.5085C26.1293 12.5085 28.1051 14.4444 28.1051 16.8327C28.1051 21.5483 19.7614 26.8944 19.7614 26.8944Z";
const baseUrl = "http://localhost:3000";
readerWorks();
function readerWorks() {
    axios
    .get(`${baseUrl}/works`)
    .then((res) => {
        //左側渲染
        const top4Works = res.data.sort((a, b) => b.saveNum - a.saveNum).slice(0, 4);
        worksInit();
        function worksInit(){
            let workStr = "";
            top4Works.forEach((item) => {
                workStr += `<li class="textHidden pointer">
                            <h3>${item.title}</h3>`;
                });
                worksChange.innerHTML = workStr;
                worksChange.children[0].classList.add("active");
        };
        
        //輪播動畫
        const worksChange_lis = worksChange.querySelectorAll("li");
        const worksImg = document.querySelector('.worksImg');
        let count = 0;
        renderWorksImg();
        carousel();
        saveIconClick();
        changeHrefClick();
        //輪播邏輯
        function carousel(){
            let worksCarousel = setInterval(renderWorksImg, 1500);
            worksChange_lis.forEach((li,index)=>{
                li.addEventListener('mouseenter',()=>{
                    clearInterval(worksCarousel);
                    worksChange_lis.forEach(item=>item.classList.remove('active'));
                    li.classList.add('active');
                    count=index;
                    renderWorksImg();
                })
                li.addEventListener('mouseleave',()=>{
                    worksCarousel = setInterval(renderWorksImg, 1500);
                })
            })
            worksImg.addEventListener('mouseenter',()=>clearInterval(worksCarousel));
            worksImg.addEventListener('mouseleave',()=>worksCarousel = setInterval(renderWorksImg, 1500));
        };
        //畫面完整渲染
        function renderWorksImg(){
            //左側切換
            worksChange_lis.forEach(li=>li.classList.remove('active'))
            worksChange_lis[count%4].classList.add('active');
            //右側圖片
            worksChange_lis.forEach(li=>{
                if(li.classList.contains('active')){
                    top4Works.forEach(data=>{
                        if(data.title===li.textContent.trim()){
                            //圖片+標題切換
                            worksImgUrl.src=data.cover;
                            worksImgUrl.nextElementSibling.children[0].textContent=data.title;
                            //icon渲染
                        }
                    })
                }
            })
            count++;
        };
        //點擊跳轉
        function changeHrefClick(){
            worksChange_lis.forEach(li=>{
                li.addEventListener('click',(e)=>{
                    const data = res.data;
                    data.forEach(item=>{
                        if(item.title===e.target.textContent.trim()){
                            item.scanNum++;
                            axios.patch(`${baseUrl}/works/${item.id}`,{
                                scanNum:item.scanNum
                            });
                            window.location.href=`http://127.0.0.1:333/article/works/${item.id}`;
                        };
                    });
                });
            });
            worksImg.addEventListener('click',(e)=>{
                top4Works.forEach(item=>{
                    if(item.title===worksImg.children[1].children[0].textContent.trim() && e.target.nodeName!=='path' && e.target.nodeName!=='svg' && e.target.nodeName!=='rect'){
                    item.scanNum++
                    axios.patch(`${baseUrl}/works/${item.id}`,{
                        scanNum:item.scanNum
                    })
                    window.location.href=`http://127.0.0.1:333/article/works/${item.id}`;
                };
                });
            });
        };
        
        //收藏數據變更
        function saveIconClick(){
            worksImg.addEventListener('click',(e)=>{
                if(e.target.nodeName=='path' || e.target.nodeName=='svg' || e.target.nodeName=='rect'){
                    if (saveIcon.children[0].getAttribute("d") == normal) {
                        top4Works.forEach(item=>{
                            if(item.title==worksImg.children[1].children[0].textContent){
                                item.saveNum++;
                                axios.patch(`${baseUrl}/works/${item.id}`,{
                                    saveNum:item.saveNum
                                });
                            };
                        });
                        saveIcon.children[0].setAttribute("d", like);
                    } else{
                        top4Works.forEach(item=>{
                            if(item.title==worksImg.children[1].children[0].textContent){
                                item.saveNum--;
                                axios.patch(`${baseUrl}/works/${item.id}`,{
                                    saveNum:item.saveNum
                                });
                            };
                        });
                    saveIcon.children[0].setAttribute("d", normal);
                    };
                };
            
        });
        };
    })
    .catch((err) => console.log(err));
};





//文章列表切換
const articlesTitle = document.querySelectorAll(".articlesTitle>p");
articlesTitle.forEach((title) => {
    title.addEventListener("click", () => {
    articlesTitle.forEach((p) => p.classList.remove("active"));
    title.classList.add("active");
    });
    if(title.classList.contains('active')){
        console.log(title.textContent);
    }
});

//推薦商品輪播
const goodsChangeLeft = document.querySelector(".leftBTN");
const goodsChangeRight = document.querySelector(".rightBTN");
const goodsList_lis = document.querySelectorAll(".goodsList>li");
const goodsListImgL = [
    { src: "images/yarn.webp", title: "五股牛奶棉-50g" },
    { src: "images/crochet.webp", title: "超值鉤針套裝" },
    { src: "images/cotton.jpg", title: "DIY手工玩偶填充棉" },
];
const goodsListImgR = goodsListImgL.reverse();
let chickCount = goodsListImgL.length * 1000 + 1;
goodsChangeLeft.addEventListener("click", () => {
    chickCount++;
    goodsList_lis.forEach((item, index) => {
    item.children[0].setAttribute(
        "src",
        goodsListImgL[Math.abs(index + chickCount) % goodsListImgL.length].src
    );
    item.children[1].textContent =
        goodsListImgL[Math.abs(index + chickCount) % goodsListImgL.length].title;
    });
});
goodsChangeRight.addEventListener("click", () => {
    chickCount--;
    goodsList_lis.forEach((item, index) => {
    item.children[0].setAttribute(
        "src",
        goodsListImgR[Math.abs(index + chickCount) % goodsListImgR.length].src
    );
    item.children[1].textContent =
        goodsListImgR[Math.abs(index + chickCount) % goodsListImgR.length].title;
    });
});
goodsChangeLeft.click();
