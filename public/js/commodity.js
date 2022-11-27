const goodImg = document.querySelector('.goodImg');
const goodTitle = document.querySelector('.goodTitle');
const shoppingNum = document.querySelector('.shoppingNum');
const goodPrice = document.querySelector('.goodPrice');
const colors = document.querySelector('.colors');
const addShoppingCar = document.querySelector('.addShoppingCar');
let data;
const obj = {};
axios.get(`${baseUrl}/goods/${location.href.split('/').pop()}`)
.then(res=>{
    data = res.data;
    goodImg.setAttribute('src',data.cover)
    goodTitle.textContent = data.title;
    goodTitle.nextElementSibling.textContent = `銷量:${data.sellNum}`;
    goodPrice.textContent = `$${data.price}`;
    colorsInit();
    //加入購物車
    addShoppingCar.addEventListener('click',()=>{
        axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}`,headers)
        .then(res=>{
            obj.goodId = data.id;
            obj.num = shoppingNum.children[1].value;
            if(!obj.style){
                obj.style = '隨機';
            };
            const newShoppingCar = res.data.shoppingCar;
            newShoppingCar.push(obj);
            axios.patch(`${baseUrl}/600/users/${localStorage.getItem('userId')}`,{
                shoppingCar:newShoppingCar
            },headers)
            .then(res=>{
                const shoppingCarLength = res.data.shoppingCar.length;
                shoppingCarIcon.nextElementSibling.textContent = shoppingCarLength > 9 ? '9+' : shoppingCarLength;
            });
            Swal.fire({
                icon : 'success',
                title : '商品添加成功'
            });
            document.querySelector('.swal2-confirm').addEventListener('click', () => location.reload() );
        })
        .catch(err=>{
        localStorage.clear();
        Swal.fire({
            icon : 'warning',
            title : '登入過期!',
            text : '請重新登入'
        });
        setTimeout(() => {
            document.location.href = '/login';
        }, 2000);
        });
    });
});

shoppingNum.children[0].addEventListener('click',()=>{
    if(shoppingNum.children[1].value>1){
        shoppingNum.children[1].value--;
    };
    goodPrice.textContent = '$' + shoppingNum.children[1].value * data.price;
});
shoppingNum.children[2].addEventListener('click',()=>{
        shoppingNum.children[1].value++;
        goodPrice.textContent = '$' + shoppingNum.children[1].value * data.price;
});

function colorsInit(){
    let text = '';
    data.styles.forEach(styles=>{
        text += `<li class="goodColor col-4">
        <p class="text-center mb-2">${styles.name}</p>
        <input type="button" value="${styles.name}" style="background-color:${styles.code};color:${styles.code};">
    </li>`;
    });
    colors.innerHTML = text;
    chooseColor();
};

function chooseColor(){
    const goodColor = colors.querySelectorAll('.goodColor');
    goodColor.forEach(li=>{
        li.children[1].addEventListener('click',function(){
            goodColor.forEach(li=>{
                li.children[1].classList.remove('active');
                li.children[1].style.border = '1px solid gray';
            });
            li.children[1].classList.add('active');
            li.children[1].style.border = '2px solid #FC7F79';
            obj.style = li.children[1].previousElementSibling.textContent;
        });
    });
};