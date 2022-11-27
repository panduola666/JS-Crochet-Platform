const success = document.querySelector('.success');
let num = 5;
setInterval(() => {
    num--;
    success.innerHTML = `${num}秒後跳轉回首頁`;
    if(num<=0){
        success.nextElementSibling.click();
    };
}, 1000);
