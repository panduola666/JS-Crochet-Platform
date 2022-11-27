//已完成!!!!!!!!!!
//帳號正則驗證
const account = document.querySelectorAll('.account');
const account_regex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
let testText;
account.forEach(accountText=>{
    accountText.addEventListener('change',()=>{
        clearTimeout(testText);
        testText = setTimeout(() => {
            accountText.style.borderBottom = account_regex.test(accountText.value) ? '2px solid #FFBEBA' : '2px solid red'; 
        }, 200);
    })
})

//密碼正則驗證
const password = document.querySelectorAll('.password');
const passwordCheck = document.querySelector('.passwordCheck');
const password_regex = /[a-zA-Z0-9]{6,}/;
password.forEach(passwordText=>{
    passwordText.addEventListener('change',()=>{
        clearTimeout(testText);
        testText = setTimeout(() => {
            passwordText.style.borderBottom = password_regex.test(passwordText.value) ? '2px solid #FFBEBA' : '2px solid red'
        }, 200);
    })
})
passwordCheck.addEventListener('change',()=>{
    clearTimeout(testText);
    testText = setTimeout(() => {
        passwordCheck.style.borderBottom = passwordCheck.value==password[0].value && password_regex.test(passwordCheck.value)?'2px solid #FFBEBA' : '2px solid red'
        console.log(passwordCheck.value);
    }, 200);
})

//驗證碼生成
const verifyImg = document.querySelector('.verifyImg');
const fontColor=["blue","yellow","red"];
const bgColor=["yellow","red","blue","black"];
const fLetterSpacing=["2px","8px","-2px","5px"];
createCode();
const verifyText = document.querySelector('.verifyText');
verifyImg.addEventListener('click',(e)=>{
    createCode();
    verifyCheck();
})
function createCode(){
    const iColor = Math.floor(Math.random()*(fontColor.length));
    verifyImg.style.color=fontColor[iColor];
    verifyImg.style.backgroundColor=bgColor[iColor];
    verifyImg.style.letterSpacing=fLetterSpacing[iColor];
    code = ""; 
    var codeLength = 6;//驗證碼的長度	
    var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');//隨機數 
    for(var i = 0; i < codeLength; i++  ) {//迴圈操作 
        var index = Math.floor(Math.random()*36);//取得隨機數的索引（0~35） 
        code  += random[index];//根據索引取得隨機數加到code上 
    } 
    verifyImg.innerHTML= code;//把code值賦給驗證碼
}
verifyText.addEventListener('change',verifyCheck);
//驗證碼驗證
function verifyCheck(){
    clearTimeout(testText);
    testText = setTimeout(() => {
        verifyText.style.borderBottom = verifyText.value.toUpperCase() === verifyImg.textContent.toUpperCase() ? '2px solid #FFBEBA' : '2px solid red'
    }, 200);
}



/* 註冊邏輯 */
const registerBtn = document.querySelector('.registerBtn');
registerBtn.addEventListener('click',()=>{
    if(account[0].style.borderBottomColor==='red'||passwordCheck.style.borderBottomColor==='red'||password[0].style.borderBottomColor==='red'||account[0].value.trim()===''||passwordCheck.value.trim()===''||password[0].value.trim()===''){
        Swal.fire({
            icon: 'error',
            title: '資料輸入錯誤!',
            text: '帳號需為Email格式,密碼不可使用特殊字元且不低於6位數'
        });
    }else{
        axios.post(`${baseUrl}/users`,  {
            email: account[0].value,
            password: password[0].value,
            userName: account[0].value.split('@')[0],
            isCreator: false,
            isAdmin: false,
            shoppingCar: [],
            saveArticle: []
        }).then(res=>{
            account[0].value='';
            password[0].value='';
            passwordCheck.value='';
            window.location.href = '/success';
        }).catch(err=>{
            localStorage.clear();
            Swal.fire({
                icon: 'error',
                title: '註冊失敗!',
                text: '此帳號已被使用'
            });
        })

    }
})

/* 登入邏輯 */
const loginBtn = document.querySelector('.loginBtn');
loginBtn.addEventListener('click',()=>{
    if(account[1].style.borderBottomColor=='red'|| password[1].style.borderBottomColor=='red'|| verifyText.value.toUpperCase() !== verifyImg.textContent.toUpperCase()){
        verifyImg.click();
        Swal.fire({
            icon: 'error',
            title: '資料輸入錯誤!',
            text: '請重新確認資料'
        });
    }else{
        axios.post(`${baseUrl}/login`,{
            "email": account[1].value,
            "password": password[1].value
        }).then(res=>{
            localStorage.setItem('accessToken',`Bearer ${res.data.accessToken}`);
            localStorage.setItem('userId',res.data.user.id);
            window.location.href = `/user/${res.data.user.id}`;
        }).catch(err=>{
            localStorage.clear();
            Swal.fire({
                icon: 'error',
                title: '登入失敗!',
                text: '請重新確認資料'
            });
            verifyImg.click();
        })
    }
});
window.addEventListener('change',(e)=>{
    if(e.key === 'Enter')loginBtn.focus();
});