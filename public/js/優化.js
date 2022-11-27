/**
 * 完成
 */

const contentTitle = document.querySelector('#contentTitle');
const articleType = document.querySelectorAll('.articleType label');
const tagType = document.querySelectorAll('.tagType label');
const isSell = document.querySelectorAll('.isSell label');
const sellContent = document.querySelector('.addContent');
const sellBy =document.querySelectorAll('.sellBy label')
const sellByWeb =document.querySelector('.sellByWeb')
const material = document.querySelector('.material');
const materialColor = document.querySelector('.materialColor');
const materialNum = document.querySelector('.materialNum');
const materialPrice = document.querySelector('.sellPrice');
const addMaterial = document.querySelector('.addMaterial');
const materialTable = document.querySelector('.materialTable tbody');
const postArticle = document.querySelector('.postArticle');
const contentImg = document.querySelector('.contentImg');
const sellPrice = document.querySelector('.sellPrice input');
let data;
const newArticle = {
    saveNum:0,
    scanNum:0,
    img:[]
};
const materials =[];
let workOrArticle;
axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, headers)
    .then(res=>{
        data = res.data;
        newArticle.userId = data.id;
        //修改原有文章
        if( !!localStorage.getItem('works') ){
            editorWorks();
        }else if( !!localStorage.getItem('articles') ){
            editorArticle();
        };
        //標題
        contentTitle.addEventListener('change',() => newArticle.title = contentTitle.value);
        //分類
        articleType.forEach(label => {
            label.addEventListener('click',() => {
                document.querySelector('.articleType').previousElementSibling.style.color = '#1F0707';
                if( label.children[0].checked ){
                    if( label.textContent === '作品列表' ){
                        workOrArticle = 'works';
                        tagType.forEach(label => {
                            label.children[0].disabled = false;
                            label.children[0].checked = false;
                            newArticle.tag = '';
                        });
                        for (let i = tagType.length-1; i >= tagType.length-3; i--) {
                            tagType[i].children[0].disabled = true;
                        };
                        isSell[1].children[0].disabled = false;
                    }else if( label.textContent === '技巧文章' ){
                        workOrArticle = 'articles';
                        tagType.forEach(label => {
                            label.children[0].disabled = false;
                            label.children[0].checked = false;
                            newArticle.tag = '';
                        });
                        for (let i = 0; i < 6; i++) {
                            tagType[i].children[0].disabled = true;
                        };
                        isSell[0].children[0].checked = true;
                        isSell[1].children[0].checked = false;
                        isSell[1].children[0].disabled = true;
                    };
                };  
            });
        });
        //標籤
        tagType.forEach(label => {
            label.addEventListener('click',() => {
                document.querySelector('.articleType').nextElementSibling.style.color = '#1F0707';
                if( label.children[0].checked ){
                    newArticle.tag = label.textContent;
                };
            });
        });
        //創建時間
        if(!newArticle.createDate){
            newArticle.createDate = createTime();
        }
        //販售平台判斷
        sellBy.forEach(label => {
            label.addEventListener('click',() => {
                if( label.children[0].checked ){
                    if( label.textContent === '我有自己的販售平台:' ){
                        console.log('11');
                        sellBy[1].children[0].addEventListener('change',()=>{
                            newArticle.isSell = sellBy[1].children[0].value;
                        });
                    }else if(label.textContent === '我需要委託該平台販售:'){
                        newArticle.isSell = {
                            title : newArticle.title,
                            price : sellPrice.value,
                            materials : materials,
                            canSell : '待審核',
                            reason : '客服將在3~7個工作日審核完畢'
                        };
                    };
                };
            });
        });
        //發布
        postArticle.addEventListener('click',() => {
            //表單簡易判斷
            if( !contentTitle.value ){
                contentTitle.focus();
                Swal.fire({
                    icon: 'info',
                    title: '表單未確實填寫',
                    text: '標題不可為空'
                });
                return;
            }else if( !workOrArticle || !newArticle.tag){
                document.querySelector('.articleType').previousElementSibling.style.color = 'red';
                document.querySelector('.articleType').nextElementSibling.style.color = 'red';
                tagType[0].children[0].focus();
                Swal.fire({
                    icon: 'info',
                    title: '表單未確實填寫',
                    text: '分類及標籤不可為空'
                });
                return;
            }else if( newArticle.content === '<p><br></p>' ){
                document.querySelector('#editor—wrapper').style.border = '2px solid red';
                document.querySelector('#w-e-textarea-1').addEventListener('click',() => {
                    document.querySelector('#editor—wrapper').style.border = '1px solid #ccc';
                });
                Swal.fire({
                    icon: 'info',
                    title: '請輸入內容',
                    text: '內容不可為空'
                });
            } else {
                if(workOrArticle ==='works'){
                    newArticle['q&a'] = [];
                    addNewArticle(workOrArticle, newArticle)
                }else{
                    addNewArticle(workOrArticle, newArticle)
                };
            };
        });
    })
    .catch(err=>{
        localStorage.clear();
        Swal.fire({
            icon : 'error',
            title : '登入過期!',
            text : '請重新登入'
        });
        setTimeout(() => {
            document.location.href = '/login';
        }, 2000);
    });

    
//販賣資訊
isSell.forEach(label => {
    label.addEventListener('click', () => {
        if( label.children[0].checked ) sellContent.style.display = label.textContent === '是,我要販售材料包:' ? 'block' : 'none' ;
    });
});
sellByWeb.style.display = 'none';
sellBy.forEach(label=>label.addEventListener('click', () => {
    if(label.children[0].checked) sellByWeb.style.display = label.textContent === '我需要委託該平台販售:' ? 'block' : 'none' ;
}));
//表格選項渲染
axios.get(`${baseUrl}/goods`)
.then(res => {
    let materialText = '';
    res.data.forEach(item => {
        materialText+=`<option value="${ item.title }">${ item.title }</option>`;
    });
    material.innerHTML = materialText;
    chooseColors(1);
    material.addEventListener('change', () => {
        res.data.forEach(item => {
            if(item.title == material.value){
                chooseColors(item.id);
            };
        });
    });
});

//表格增刪
addMaterial.addEventListener('click',(e)=>{
    e.preventDefault();
    //表格渲染
    let materialStr = `<tr class="materialDelete">
    <td>${material.value} <span class="ms-3">${ materialColor.value ? `(${ materialColor.value })` : '' }</span></td>
    <td>${materialNum.value}</td>
    <td class="delete">X</td>
    </tr>`
    materialTable.innerHTML += materialStr;
    deleteMaterial();
    materials.push( [material.value, materialColor.value, materialNum.value] );
});

//富文本配置
//https://www.wangeditor.com/v5/getting-started.html 文黨
const { createEditor, createToolbar } = window.wangEditor
const editorConfig = {
    placeholder: '請輸入內容...',
    onChange(editor) {
        const html = editor.getHtml().replace(/"/g,'\"');
        newArticle.content = html;
        const newCover = html.split('\"').filter(item=>/^http/g.test(item) || /^data:/g.test(item));
        newArticle.img = [...newCover];
        //封面獲取
        if(newArticle.img.length){
            newArticle.cover = newArticle.img[0];
            contentImg.setAttribute('src', newArticle.img[0] );
        }else{
            newArticle.cover = 'https://github.com/panduola666/2022JS-/blob/main/public/images/cover.jpg?raw=true';
            contentImg.setAttribute('src', 'https://github.com/panduola666/2022JS-/blob/main/public/images/cover.jpg?raw=true');
        };
    }
};
const editor = createEditor({
    selector: '#editor-container',
    html: '<p><br></p>',
    config: editorConfig,
    mode: 'simple',
})
const toolbarConfig = {
    toolbarKeys : ['bold', 'italic', 'color', 'fontSize', '|', 'insertTable', 'insertImage', 'insertVideo']
}
const toolbar = createToolbar({
    editor,
    selector: '#toolbar-container',
    config: toolbarConfig,
    mode: 'simple',
})

//表格刪除
function deleteMaterial(){
    const materialDelete = document.querySelectorAll('.materialDelete');
    materialDelete.forEach( (tr,index) => {
        tr.addEventListener('click',(e) => {
            if(e.target.className === 'delete'){
                materials.splice(index, 1);
                tr.remove();
            };
        });
    });
};
//發布日期
function createTime(){
    const timer = new Date();
    const y = timer.getFullYear();
    const m = timer.getMonth()+1 >10 ? timer.getMonth()+1 : '0' + timer.getMonth()+1;
    const d = timer.getDate() >10 ? timer.getDate() : '0' + timer.getDate();;
    const H = timer.getHours() >10 ? timer.getHours() : '0' + timer.getHours();;
    const M = timer.getMinutes() >10 ? timer.getMinutes() : '0' + timer.getMinutes();;
    const S = timer.getSeconds() >10 ? timer.getSeconds() : '0' + timer.getSeconds();;
    return `${y}-${m}-${d} ${H}:${M}:${S}`;
};
//不同材料的顏色選擇渲染
function chooseColors(id){
    axios(`${baseUrl}/goods/${id}`)
    .then(res=>{
        let materialColorText = '';
        res.data.styles.forEach(color => {
            materialColorText+=`<option value="${color.name}">${color.name}</option>`
        });
        materialColor.innerHTML = materialColorText;
    });
};
//編輯原有文章
async function editorArticle(){
    const res = await axios.get(`${baseUrl}/articles/${ localStorage.getItem('articles') }`);
        contentTitle.value = res.data.title;
        newArticle.title = contentTitle.value;
        newArticle.createDate = res.data.createDate;
        articleType[1].children[0].click();
        tagType.forEach(label => {
            if(res.data.tag === label.textContent.trim() ){
                label.children[0].click();
            };
        });
        editor.setHtml(res.data.content);
};
//編輯原有作品
async function editorWorks(){
    const res = await axios.get(`${baseUrl}/works/${ localStorage.getItem('works') }`);
    contentTitle.value = res.data.title;
    newArticle.title = contentTitle.value;
    newArticle.createDate = res.data.createDate;
    articleType[0].children[0].click();
    tagType.forEach(label => {
        if(res.data.tag === label.textContent.trim() ){
            label.children[0].click();
        };
    });
    //材料包種類判斷
    if(typeof res.data.isSell === 'string'){
        isSell[1].click();
        sellBy[0].children[0].click();
        sellBy[1].children[0].value = res.data.isSell;
        sellPrice.value = res.data.isSell.price;
    }else if(typeof res.data.isSell === 'object' && res.data.isSell.title !== ''){
        let sellMaterials = res.data.isSell.materials;
        isSell[1].click();
        sellBy[2].children[0].click();
        materials.push(...sellMaterials);
        let materialStr = '';
        sellMaterials.forEach(item => {
            materialStr += `<tr class="materialDelete">
            <td>${ item[0] } <span class="ms-3">${ item[1] ? `(${ item[1] })` : ''}</span></td>
            <td>${ item[2] }</td>
            <td class="delete">X</td>
            </tr>`
        });
        materialTable.innerHTML = materialStr;
        deleteMaterial();
        sellPrice.value = res.data.isSell.price;
    }else{
        isSell[0].click();
    };
    editor.setHtml(res.data.content);
};
//新增文章
function addNewArticle(workOrArticle,newArticle){
    if(!!localStorage.getItem(workOrArticle)){
        axios.put(`${baseUrl}/${workOrArticle}/${localStorage.getItem(workOrArticle)}`, newArticle)
        .then(res=>{
            localStorage.removeItem(workOrArticle);
            if(workOrArticle === 'works') location.href = '/worksList';
            if(workOrArticle === 'articles') location.href = '/articleList';
        });
    }else{
        axios.post(`${baseUrl}/${workOrArticle}`, newArticle)
        .then(res=>{
            if(workOrArticle === 'works') location.href = '/worksList';
            if(workOrArticle === 'articles') location.href = '/articleList';
        });
    };
    document.querySelector('.addArticle').reset();
}