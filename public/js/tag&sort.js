const tagList = document.querySelectorAll('.js-tagChange>li');
const sortBTN = document.querySelectorAll('.js-sortArticle>button');
const addArticleBTN = document.querySelector('.js-addArticle')
function changBTN(array){
    array.forEach(todo=>{
        todo.addEventListener('click',()=>{
            array.forEach(item=>item.classList.remove('active'));
            todo.classList.add('active');
        })
    })
}
export {tagList,sortBTN,addArticleBTN,changBTN}