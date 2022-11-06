//收件人信息
const buyerInfo = document.querySelectorAll('.js-buyerInfo label');
buyerInfo.forEach(label=>{
    label.children[0].addEventListener('keyup',()=>{
        if(label.textContent == '收件人姓名:'){
            label.children[0].style.border = label.children[0].value==''?'2px solid red':'1px solid #1F0707';
        }else if(label.textContent == '手機號碼:'){
            label.children[0].style.border = label.children[0].value.length < 10 ? '2px solid red':'1px solid #1F0707';
        }
    })
})

//寄送方式 選擇門市 點擊切換
const shoreAddress = document.querySelectorAll('.js-areaChoose input');
const cityChoose = document.querySelector('.js-cityBNT');
const cityBTN = cityChoose.querySelectorAll('button');
const areaChoose = document.querySelector('.js-areaBTN');
const areaBTN = areaChoose.querySelectorAll('button');
const streetChoose = document.querySelector('.js-streetBTN');
const streetBTN = streetChoose.querySelectorAll('button');
const shopChoose = document.querySelector('.js-shopBTN');
const shopBTN = shopChoose.querySelectorAll('button');
cityBTN.forEach(btn=>{
    btn.addEventListener('click',function(){
        cityBTN.forEach(item=>item.classList.remove('active'));
        this.classList.add('active');
        cityChoose.style.display = 'none';
        shoreAddress[1].disabled = false;
        shoreAddress[1].nextElementSibling.style.display = 'block';
    })
})
areaBTN.forEach(btn=>{
    btn.addEventListener('click',function(){
        areaBTN.forEach(item=>item.classList.remove('active'));
        this.classList.add('active');
        areaChoose.style.display = 'none';
        shoreAddress[2].disabled = false;
        shoreAddress[2].nextElementSibling.style.display = 'block';
    })
})
streetBTN.forEach(btn=>{
    btn.addEventListener('click',function(){
        streetBTN.forEach(item=>item.classList.remove('active'));
        this.classList.add('active');
        streetChoose.style.display = 'none';
        shoreAddress[3].disabled = false;
        shoreAddress[3].nextElementSibling.style.display = 'block';
    })
})
shopBTN.forEach(btn=>{
    btn.addEventListener('click',function(){
        shopBTN.forEach(item=>item.classList.remove('active'));
        this.classList.add('active');
    })
})
shoreAddress.forEach(input=>{
    input.addEventListener('click',()=>{
        shoreAddress.forEach(item=>item.nextElementSibling.style.display = 'none')
        input.nextElementSibling.style.display = 'block';
    })
})


//付款方式新增
const payMethod = document.querySelectorAll('.js-payMethod label');
const payCardInfo = document.querySelector('.js-payCardInfo');
payMethod.forEach(label=>{
    label.addEventListener('click',()=>{
        payCardInfo.style.display = label.children[0].checked && label.textContent=='信用卡'?'flex':'none';
    })
})

//金額計算

