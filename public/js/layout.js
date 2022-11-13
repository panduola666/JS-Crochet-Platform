
const moreBtn = document.querySelector('.moreBtn');
const moreHref = document.querySelectorAll('.moreHref>li');
const toTop = document.querySelector('.backTop');
const searchChange = document.querySelector('.searchList');
const shoppingCarIcon = document.querySelector('.shoppingCarIcon');
const userIcon = document.querySelector('.userIcon');
const goToAdmin = document.querySelector('.goToAdmin');
//返回頂部
window.addEventListener('scroll',()=>{
    if(window.pageYOffset<750){
        toTop.style.display = 'none';
    }else if(window.pageYOffset>=750){
        toTop.style.display = 'block';
    };
    if(window.pageYOffset>searchChange.parentElement.offsetHeight){
        searchChange.parentElement.style.position = 'fixed';
        searchChange.parentElement.style.opacity = '.3';
        searchChange.parentElement.addEventListener('mouseenter',()=>{
            searchChange.parentElement.style.opacity = '1';
        })
        searchChange.parentElement.addEventListener('mouseleave',()=>{
            searchChange.parentElement.style.opacity = '.3';
        })
    }else{
        searchChange.parentElement.style.position = 'static';
        searchChange.parentElement.style.opacity = '1';
        searchChange.parentElement.addEventListener('mouseleave',()=>{
            searchChange.parentElement.style.opacity = '1';
        })
    }
});
toTop.addEventListener('click',()=>{
        let num = window.pageYOffset;
        setTimeout(() => {
            while(num>=0){
                num-=1;
                window.scrollTo(0,num);
            };
        }, 200);
});

//搜尋切換
searchChange.addEventListener('click',function(){
    this.textContent == '作品名　>'? this.textContent = '文章名　>' : this.textContent = '作品名　>';
})

//header Icon
shoppingCarIcon.addEventListener('click',()=>{
    const baseUrl = "http://localhost:3000";
    const headers = {
        headers:{
            Authorization : localStorage.getItem('accessToken')
        }
    };
    axios(`${baseUrl}/600/users/${localStorage.getItem('userId')}`,headers)
    .then(res=>{
        window.location.href=`/shoppingCar/${res.data.id}`;
    }).catch(err=>{
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
});

//判斷登入
if(localStorage.getItem('userId')){
    const baseUrl = "http://localhost:3000";
    const headers = {
        headers:{
            Authorization : localStorage.getItem('accessToken')
        }
    };
    userIcon.addEventListener('click',()=>{
        axios(`${baseUrl}/600/users/${localStorage.getItem('userId')}`,headers)
        .then(res=>{
            window.location.href=`/user/${res.data.id}`;
        }).catch(err=>{
            localStorage.clear();
            document.location.href = '/login';
        });
    });
    axios(`${baseUrl}/600/users/${localStorage.getItem('userId')}`,headers)
    .then(res=>{
        moreHref[moreHref.length-1].innerHTML = `<a href="javascript:;">會員登出</a>`;
        if(!!res.data.isAdmin){
            goToAdmin.style.display = 'block';
            moreHref[0].style.display = 'block';
            goToAdmin.addEventListener('click',()=>{
                window.location.href= '/admin';
            })
        }else{
            goToAdmin.style.display = 'none';
            moreHref[0].style.display = 'none';
        };
    })
    .catch(err=>localStorage.clear());
}else{
    userIcon.addEventListener('click',()=>document.location.href = '/login')
}

////欠一個常見問題
moreHref.forEach(item=>{
    item.addEventListener('click',(e)=>{
        console.log(e.target.textContent);
        if( e.target.textContent == '後台管理' ){
            window.location.href='/admin';
        }else if ( e.target.textContent == '作品列表' ){
            window.location.href='/worksList';
        }else if ( e.target.textContent == '技巧文章' ){
            window.location.href='/articleList';
        }else if ( e.target.textContent == '購買商城' ){
            window.location.href='/goodsList';
        }else if ( e.target.textContent == '常見問題' ){
            // window.location.href='/admin';
        }else if ( e.target.textContent == '會員登入/註冊' ){
            window.location.href='/login';
        }else if ( e.target.textContent == '會員登出' ){
            window.location.href='/';
            localStorage.clear();
        }
    });
});