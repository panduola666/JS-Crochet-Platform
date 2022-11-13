//分類獲取
const articleType = document.querySelectorAll('.js-articleType label');
articleType.forEach(label=>{
    label.addEventListener('click',()=>{
        if(label.children[0].checked){
            console.log(label.textContent);
        }
    })
})

//標籤獲取
const tagType = document.querySelectorAll('.js-tagType label');
tagType.forEach(label=>{
    label.addEventListener('click',()=>{
        if(label.children[0].checked){
            console.log(label.textContent);
        }
    })
})
//販賣資訊
const isSell = document.querySelectorAll('.js-isSell label');
const sellContent = document.querySelector('.js-sellContent');
isSell.forEach(label=>{
    label.addEventListener('click',()=>{
        if(label.children[0].checked)sellContent.style.display = label.textContent=== '是,我要販售材料包:'?'block':'none';
    })
})
const sellBy =document.querySelectorAll('.js-sellBy label')
const sellByWeb =document.querySelector('.js-sellByWeb')
sellByWeb.style.display = 'none';
sellBy.forEach(label=>label.addEventListener('click',()=>{
    if(label.children[0].checked)sellByWeb.style.display = label.textContent=== '我需要委託該平台販售:'?'block':'none';
}))

//表格增刪
const material = document.querySelector('.js-material');
const materialColor = document.querySelector('.js-materialColor');
const materialNum = document.querySelector('.js-materialNum');
const materialPrice = document.querySelector('.js-materialPrice');
const addMaterial = document.querySelector('.js-addMaterial');
const materialTable = document.querySelector('.js-materialTable tbody');
addMaterial.addEventListener('click',()=>{
    //表格渲染
    let materialStr=`<tr class="js-materialDelete">
    <td>${material.value}-${materialColor.value}</td>
    <td>${materialNum.value}</td>
    <td>X</td>
    </tr>`
    id++;
    materialTable.innerHTML+=materialStr;
    //表格刪除
    const materialDelete = document.querySelectorAll('.js-materialDelete td');
    materialDelete.forEach((deleteIcon,index)=>{
        if(index%3==2){
            deleteIcon.addEventListener('click',()=>{
                materialTable.removeChild(deleteIcon.parentNode)
                console.log(deleteIcon.parentNode);
            })
        }
    })
})




//富文本配置
//https://www.wangeditor.com/v5/getting-started.html 文黨
const { createEditor, createToolbar } = window.wangEditor
const editorConfig = {
    placeholder: '請輸入內容...',
    onChange(editor) {
        const html = editor.getHtml().replace(/"/g,'\\"')
        console.log('editor content', html)
    }
}
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