const ticketName = document.querySelector('.ticketName');
const ticketImgURL = document.querySelector('.ticketImgURL');
const ticketArea = document.querySelector('#ticketArea');
const ticketPrice = document.querySelector('.ticketPrice');
const ticketNum = document.querySelector('.ticketNum');
const ticketLV = document.querySelector('.ticketLV');
const ticketDescribe = document.querySelector('.ticketDescribe');
const addBTN = document.querySelector('.addBTN>button');
const travelAreaSearch = document.querySelector('#travelAreaSearch');
const describeColor = document.querySelector('.describeColor');
const noFound = document.querySelector('.no_found');
const travelAreaList = document.querySelector('.travelAreaList');
const form = document.querySelector('form');
// const chart = document.querySelector('#chart');
axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
.then(res=>{
  const data = res.data.data;
  init(travelAreaSearch.value);
  //新增
  addBTN.addEventListener('click',(e)=>{
    e.preventDefault();
    if(ticketName.value===''||ticketImgURL.value===''||ticketArea.value===''||ticketDescribe.value===''
    ||ticketNum.value===''||ticketPrice.value===''||ticketLV.value===''){
      alert('請確實填寫表單!');
      return;
    }
    let obj={
      "id": data.length,
      "name": ticketName.value.trim(),
      "imgUrl": ticketImgURL.value.trim(),
      "area": ticketArea.value,
      "description": ticketDescribe.value.trim(),
      "group": ticketNum.value,
      "price": ticketPrice.value,
      "rate": ticketLV.value
    };
    data.push(obj);
    form.reset();
    init(travelAreaSearch.value);
  })
  //搜尋 資料渲染
  travelAreaSearch.addEventListener('change',()=>{
    init(travelAreaSearch.value);
  });
  function init(local){
    let str = '';
    const newData = data.filter(item=>{
      if(item.area===local){
        return item;
      }else if(local==='全部地區'||local===''){
        return item;
      };
    });
    noFound.style.display = newData.length===0? 'flex' : 'none';
    describeColor.textContent = `本次搜尋共 ${newData.length} 筆資料`;
    newData.forEach(item=>{
        str+=` 
        <li>
        <div class="tag h2Size">${item.area}</div>
        <div class="date">${item.rate}</div>
        <a href="#" class="travelImg">
            <img src=${item.imgUrl} alt="${item.name}">
        </a>
        <div class="travelDescribe">
        <div class="describeHeader">
            <h3 class="h1Size">${item.name}</h3>
            <p class="describeColor">${item.description}</p>
        </div>
            <div class="describeFooter">
                <p><i class="fi fi-sr-exclamation"></i>剩下最後 ${item.group} 組</p>
                <p>TWD<span class="priceSize">$${item.price}</span></p>
            </div>
        </div>
      </li>`;
      });
    travelAreaList.innerHTML=str;
    c3Donut();
  }
  //圓餅圖
  function c3Donut(){
    const areaTotal = {};
    data.forEach(item=>{
      areaTotal[item.area]?areaTotal[item.area]++:areaTotal[item.area]=1;
    });
    const newData = [];
    for (const key in areaTotal) {
      newData.push([key,areaTotal[key]])
    };
    
    const chart = c3.generate({
      bindto: '#chart',
      size:{
        height: 200,
        width: 200
      },
      data: {
        columns: newData,
        type:'donut',
        colors: {
          台北: '#26BFC7',
          台中: '#5151D3',
          高雄: '#E68619'
        }
      },
      donut: {
        title: "套票地區比重",
        width:'10',
        label: {
          format: function (value, ratio, id) {
              return '';
          }
        }
      }
    });
  };
});


