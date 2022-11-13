const baseUrl = `http://127.0.0.1:3000`;
const headers = {
    headers:{
        Authorization:localStorage.getItem('accessToken')
    }};
const goodsTable = document.querySelector('.goodsTable');
const filterGoods = document.querySelector('.filterGoods');
let data;
let checkedNum = 0;

axios.get(`${baseUrl}/users/${localStorage.getItem('userId')}`,headers)
.then(res=>{
    if(res.data.isAdmin){
        axios.get(`${baseUrl}/goods`)
        .then(res=>{
            data = res.data;
            checkedNum = data.filter(item=>item.isRecommend).length;
            filterGoods.addEventListener('change',()=>{
                const filterList = data.filter(item=> filterGoods.value === '全部分類' ? item : item.type === filterGoods.value);
                goodsInit(filterList);
                recommendChange();
            });
            const recommendGoods = data.sort((a,b)=>b.isRecommend-a.isRecommend);
            goodsInit(recommendGoods);
        })
        .catch(err=>{
            console.log(err);
        })
    }else{
        document.location.href = '/';
    };
})
.catch(err=>{
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

//商品表格
function goodsInit(list){
    let str = '';
    list.forEach(item=>{
        str += `<tr data-id="${item.id}">
        <td>${item.title.split('-')[0]}</td>
        <td>${item.title.split('-')[1] ? item.title.split('-')[1] : ''}</td>
        <td>${item.type}</td>
        <td>${item.price}</td>
        <td class="small">${item.colors.map(item=>item.name).join('、')}</td>
        <td><input type="checkbox" name="" id="recommend" ${!!item.isRecommend?'checked':''}></td>
        <td><img src="/images/Vector.png" alt="修改" class="pointer"></td>
        <td><span class="pointer">X</span></td>
    </tr>`;
    });
    goodsTable.innerHTML = str;
    recommendChange();
};
//點擊推薦最多5個+排序
function recommendChange(){
    const recommend = document.querySelectorAll('#recommend');
    recommend.forEach(input=>{
        input.addEventListener('click',()=>{
            input.checked ? checkedNum++ : checkedNum--;
            if(checkedNum<=5){
                axios.patch(`${baseUrl}/goods/${input.parentElement.parentElement.dataset.id}`,{
                    isRecommend : input.checked
                })  
                .then(res=>{
                    axios.get(`${baseUrl}/goods`)
                    .then(res=>{
                        goodsInit(res.data.sort((a,b)=>b.isRecommend-a.isRecommend));
                    })
                });
            }else{
                Swal.fire({
                    icon: 'warning',
                    title: '超出最大推薦數!',
                    text: '最多推薦5件商品'
                });
                input.checked = false;
            }
        });
    });
};