//缺修改密碼未完成 - 如何解碼?
const baseUrl = `http://127.0.0.1:3000`;
const headers = {
    headers:{
        Authorization:localStorage.getItem('accessToken')
    }};
//頭像
const avatar = document.querySelector('.avatar');
//會員資料
const application = document.querySelector('.application');
const baseDBList = document.querySelectorAll('.baseDBList li');
const applicationAgree = document.querySelector('.agree');
const userDBInput = document.querySelectorAll('.userDB input');
const userDBChange = document.querySelector('.userDBChange');
const userAccount = document.querySelector('.userAccount');
const addCreditCard = document.querySelector('.creditCardBTN');
const creditCardInfo = document.querySelector('.creditCardNum');
const myCreditCard = document.querySelector('.myCreditCard');
//密碼
const passwordDB = document.querySelector('.passwordDB');
const pwInput = document.querySelectorAll('.passwordDB input');
const passwordChange = passwordDB.querySelector('button');
axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}?_embed=works&_embed=articles`,headers)
.then(res=>{
    const userDb = res.data;
    userDbInit();
    applyCreator(userDb.isCreator);
    userDbChange();
    //畫面渲染
    function userDbInit(){
        avatar.textContent = userDb.userName[0];
        userAccount.textContent = `帳號: ${userDb.email}`;
        userDBInput[0].value = userDb.userName;
        userDBInput[1].value = userDb.phoneNumber;
        userDBInput[2].value = userDb.barcode;
        userDBInput[3].value = userDb.creditCard.cardNumber;
        userDBInput[4].value = userDb.creditCard.expiryDate.split('/')[0];
        userDBInput[5].value = userDb.creditCard.expiryDate.split('/')[1];
        userDBInput[6].value = userDb.creditCard.securityCode;
        myCreditCard.textContent = userDb.creditCard.cardNumber.replace(userDb.creditCard.cardNumber.slice(3,-3),'*'.repeat(userDb.creditCard.cardNumber.slice(3,-3).length));
        baseDBList[0].children[1].textContent = `${userDb.articles.length + userDb.works.length}篇`;
        baseDBList[1].children[1].textContent = `${userDb.boughtArticles.length}篇`;
        baseDBList[2].children[1].textContent = `${userDb.saveArticles.length}篇`;
        
    };
    //會員資料變更
    function userDbChange(){
        userDBChange.addEventListener('click',()=>{
            if(userDBChange.textContent=='編輯'){
                userDBInput.forEach(input=>input.disabled = false);
                addCreditCard.disabled = false;
                userDBChange.textContent = '確認';
            }else if(userDBChange.textContent=='確認'){
                userDBInput.forEach(input=>input.disabled = true);
                addCreditCard.disabled = true;
                avatar.textContent = userDBInput[0].value[0];
                let creditCardNum = creditCardInfo.children[0].children[0].value;
                const needChang = creditCardNum.slice(3,-3);
                myCreditCard.textContent = creditCardNum.replace(needChang,'*'.repeat(needChang.length));
                creditCardInfo.style.display = 'none';
                userDBChange.textContent = '編輯';
                axios.patch(`${baseUrl}/600/users/${userDb.id}`,{
                    userName:userDBInput[0].value,
                    phoneNumber:userDBInput[1].value,
                    barcode:userDBInput[2].value,
                    creditCard:{
                        cardNumber:userDBInput[3].value,
                        expiryDate:`${userDBInput[4].value}/${userDBInput[5].value}`,
                        securityCode:userDBInput[6].value
                    }
                },headers);
            };
        });

        //新增帳戶
        addCreditCard.addEventListener('click',()=>{
            creditCardInfo.style.display =  creditCardInfo.style.display == 'block' ? 'none' : 'block';
        });
    };
    
    //判斷是否為原創者以及申請原創者
    function applyCreator(isCreator){
        if(isCreator){
            application.style.display = 'none';
            baseDBList[3].style.display = 'flex';
        }else{
            applicationAgree.addEventListener('click',()=>{
                document.querySelector('#exampleModal').classList.remove('show');
                document.querySelector('div.modal-backdrop').classList.remove('show');
                application.style.display = 'none';
                baseDBList[3].style.display = 'flex';
                axios.patch(`${baseUrl}/600/users/${userDb.id}`,{
                    isCreator:true
                },headers);
            });
        };
    };
})
.catch(err=>{
    console.log(err);
    if(err.request.status==403){
        document.location.href = `/user/${localStorage.getItem('userId')}`;
    }else if (err.request.status==401){
        localStorage.clear();
        Swal.fire({
            icon: 'error',
            title: '帳號過期!',
            text: '請重新登入'
        });
        setTimeout(() => {
            document.location.href = '/login';
        }, 2000);
    }
    
})


//管理文章
baseDBList.forEach(li=>{
    li.addEventListener('click',(e)=>{
        console.log(li.textContent.includes('我的文章'));
        if(li.textContent.includes('我的文章')){
            document.location.href = `/myArticle/${localStorage.getItem('userId')}`;
        }else if(li.textContent.includes('我的留言')){
            document.location.href = `/myMessage/${localStorage.getItem('userId')}`;
        }else if(li.textContent.includes('我的收藏')){
            document.location.href = `/mySave/${localStorage.getItem('userId')}`;
        }else if(li.textContent.includes('材料包管理')){
            console.log(li);
            document.location.href = `/userSell/${localStorage.getItem('userId')}`;
        }
    })
})



//修改密碼

passwordChange.addEventListener('click',()=>{
    const password_regex = /[a-zA-Z0-9]{6,}/;
    if(passwordChange.textContent=='編輯'){
        passwordChange.textContent='確認';
        pwInput.forEach(input=>{
            input.disabled = false;
            input.style.borderBottomColor = 'red';
            //密碼驗證
            pwInput.forEach(input=>{
                input.addEventListener('keyup',()=>{input.style.borderBottom = password_regex.test(input.value) ? '2px solid #1F0707' : '2px solid red'});
            })
            pwInput[2].addEventListener('keyup',()=>pwInput[2].style.borderBottom = pwInput[2].value == pwInput[1].value ? '2px solid #1F0707' : '2px solid red');
        });
    }else{
        if(pwInput[0].style.borderBottomColor=='red'||pwInput[1].style.borderBottomColor=='red'||pwInput[2].style.borderBottomColor=='red'){
            //驗證失敗
        }else{
            //驗證成功\
            passwordChange.textContent='編輯';
            pwInput.forEach(input=>{
                input.disabled = true;
                input.style.borderBottom = 'none';
                input.value='';
            });
        }
    }
    
})


