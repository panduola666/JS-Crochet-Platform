import {tagList,sortBTN,addArticleBTN,changBTN} from './tag&sort.js';
tagList.forEach(li=>{
    li.addEventListener('click',changBTN(tagList))
})
sortBTN.forEach(btn=>{
    btn.addEventListener('click',changBTN(sortBTN))
})
addArticleBTN.addEventListener('click',()=>{window.location.href='/addArticle'})