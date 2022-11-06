const moreHref = document.querySelectorAll('.js-moreHref>li');
const toTop = document.querySelector('.js-toTop');
const searchChange = document.querySelector('.js-searchChange');
const shoppingCarIcon = document.querySelector('.js-shoppingCarIcon');
const userIcon = document.querySelector('.js-userIcon');

moreHref.forEach(item=>{
    item.addEventListener('click',function(){
        // console.log(this.textContent);
        if(this.textContent=='作品列表'){
            window.location.href='/worksList';
        }else if(this.textContent=='技巧文章'){
            window.location.href='/articleList';
        }else if(this.textContent=='購買商城'){
            window.location.href='/goodsList';
        }
        ////欠一個常見問題
    })
})

//返回頂部
window.addEventListener('scroll',()=>{
    // console.log(window.pageYOffset);
    if(window.pageYOffset<750){
        toTop.style.display = 'none';
    }else if(window.pageYOffset>=750){
        toTop.style.display = 'block';
    }
})
toTop.addEventListener('click',()=>{
    // setTimeout(()=>{
        let num = window.pageYOffset;
        setTimeout(() => {
            while(num>=0){
                num-=1;
                window.scrollTo(0,num);
            }
        }, 200);
        
        
        
    // },300)
})

//搜尋切換
searchChange.addEventListener('click',function(){
    this.textContent == '作品名　>'? this.textContent = '文章名　>' : this.textContent = '作品名　>';
})

//header Icon
shoppingCarIcon.addEventListener('click',()=>{
    window.location.href='/shoppingCar';
})
/**
 * 
 * 判斷登入
 */
userIcon.addEventListener('click',()=>{

})