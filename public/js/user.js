const token = document.cookie.split(';').map(item=> item.split('=')).filter(item=>item[0].trim()=='accessToken')[0][1];
const baseUrl = `http://127.0.0.1:3000`;
const href = window.location.href.split('/');
const userId = href[href.length-1];
//卡在這裡!!!!!
axios.get({},`${baseUrl}/600/users/${userId}`)
.then(res=>{
    console.log(res);
})
.catch(err=>{
    console.log(err);
})

//原創申請
//之後再作補充內容!
const application = document.querySelector('.js-application');
const baseDBList = document.querySelectorAll('.js-baseDBList li');
const applicationAgree = document.querySelector('.js-agree');
applicationAgree.addEventListener('click',()=>{
    document.querySelector('#exampleModal').classList.remove('show');
    document.querySelector('div.modal-backdrop').classList.remove('show');
    application.style.display = 'none';
    baseDBList[3].style.display = 'flex';
})
//管理文章
baseDBList.forEach(li=>{
    li.addEventListener('click',(e)=>{
        console.log(li.textContent.includes('我的文章'));
        if(li.textContent.includes('我的文章')){
            document.location.href = '/myArticle';
        }else if(li.textContent.includes('我的留言')){
            document.location.href = '/myMessage';
        }else if(li.textContent.includes('我的收藏')){
            document.location.href = '/mySave';
        }else if(li.textContent.includes('材料包管理')){
            console.log(li);
            document.location.href = '/userSell';
        }
    })
})

//會員資料
const userDBChange = document.querySelector('.js-userDBChange');
const userDBInput = document.querySelectorAll('.js-userDB input');
const addCreditCard = document.querySelector('.js-addCreditCard');
const creditCardInfo = document.querySelector('.js-creditCardInfo');
const myCreditCard = document.querySelector('.js-myCreditCard');
userDBChange.addEventListener('click',()=>{
    if(userDBChange.textContent=='編輯'){
        userDBInput.forEach(input=>input.disabled = false);
        addCreditCard.disabled = false;
        userDBChange.textContent = '確認';
    }else if(userDBChange.textContent=='確認'){
        userDBInput.forEach(input=>input.disabled = true);
        addCreditCard.disabled = true;
        myCreditCard.textContent = creditCardInfo.children[0].children[0].value
        creditCardInfo.style.display = 'none';
        userDBChange.textContent = '編輯';
    }
})
addCreditCard.addEventListener('click',()=>{
    creditCardInfo.style.display = 'block';
})

//修改密碼
const passwordDB = document.querySelector('.passwordDB');
const pwInput = document.querySelectorAll('.passwordDB input');
const passwordChange = passwordDB.querySelector('button');
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
            //驗證成功
            passwordChange.textContent='編輯';
            pwInput.forEach(input=>{
                input.disabled = true;
                input.style.borderBottom = 'none';
                input.value='';
            });
        }
    }
    
})


