const success = document.querySelector('.js-success');
let num = 5;
setInterval(() => {
    num--;
    success.innerHTML = `成功!${num}秒後跳轉回首頁`;
    if(num<=0){
        success.nextElementSibling.click();
    }
}, 1000);
