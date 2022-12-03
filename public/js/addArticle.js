const articleType = document.querySelector('.articleType');
const tagType = document.querySelector('.tagType');
const tagTypeInput = tagType.querySelectorAll('input');
const isSell = document.querySelector('.isSell');
const addContent = document.querySelector('.addContent');
const choose = document.querySelectorAll('.choose');
const contentImg = document.querySelector('.contentImg');
const postArticleBtn = document.querySelector('.postArticle');
const material = document.querySelector('.material');
const materialColor = document.querySelector('.materialColor');
const addMaterial = document.querySelector('.addMaterial ');
const materialTable = document.querySelector('.materialTable');
const sellPrice = document.querySelector('.sellPrice input');
const contentTitle = document.querySelector('#contentTitle');
const worksList = document.querySelector('#worksList');
const articlesList = document.querySelector('#articlesList');
const sellBySelf = document.querySelector('#sellBySelf');
const needSell = document.querySelector('#needSell');
const sellSelfUrl = document.querySelector('#sellSelfUrl');
const sellByWeb = document.querySelector('#sellByWeb');
const noSell = document.querySelector('#noSell');
let newArticle = {};
const isSellInfo = {
  title: '',
  price: '',
  materials: [],
  canSell: '待審核',
  reason: '客服將在3~7個工作日審核完畢'
};

let goodsData;
let userData;
let postArticleDelay;

axios.get(`${baseUrl}/600/users/${localStorage.getItem('userId')}`, headers)
  .then(res => {
    userData = res.data;
    isSell.children[1].style.display = userData.isCreator ? 'block' : 'none';
    // 編輯原有文章
    if (localStorage.getItem('works')) {
      axios.get(`${baseUrl}/works/${localStorage.getItem('works')}`)
        .then(res => {
          worksList.click();
          newArticle = res.data;
          contentTitle.value = res.data.title;
          editor.setHtml(res.data.content);
          tagTypeInput.forEach(input => input.value === res.data.tag ? input.click() : '');
          if (res.data.isSell) {
            // 有販售內容
            needSell.click();
            if (typeof res.data.isSell === 'string') {
              sellBySelf.click();
              sellSelfUrl.value = res.data.isSell;
            } else if (typeof res.data.isSell === 'object') {
              sellByWeb.click();
              sellPrice.value = res.data.isSell.price;
              const text = [];
              res.data.isSell.materials.forEach((item, index) => {
                text.push(`<tr>
                <td>${item[0]} <span class="ms-3">(${item[1]})</span></td>
                <td>${item[2]}</td>
                <td class="delete" data-index="${index}">X</td>
                </tr>`);
                isSellInfo.materials.push([item[0], item[1], item[2]]);
              });
              materialTable.children[1].innerHTML = text.join('');
            }
          }
        })
        .catch(err => console.log(err));
    } else if (localStorage.getItem('articles')) {
      axios.get(`${baseUrl}/articles/${localStorage.getItem('articles')}`)
        .then(res => {
          articlesList.click();
          newArticle = res.data;
          contentTitle.value = res.data.title;
          editor.setHtml(res.data.content);
          tagTypeInput.forEach(input => input.value === res.data.tag ? input.click() : '');
        })
        .catch(err => console.log(err));
    } else {
      // 通用物件值
      newArticle.userId = parseInt(localStorage.getItem('userId'));
      newArticle.saveNum = 0;
      newArticle.scanNum = 0;
      newArticle.createDate = newArticle.createDate ? newArticle.createDate : new Date().getTime();
      newArticle.title = contentTitle.value;
      newArticle.tag = localStorage.getItem('tagType');
    }
    chooseConfig();
    workSell();
    tableOperate();
  })
  .catch(() => {
    clearLogin();
  });

// 頁面操作
function chooseConfig () {
  // 分類
  articleType.addEventListener('click', (e) => {
    articleType.previousElementSibling.style.color = '#1F0707';
    if (e.target.nodeName !== 'DIV') {
      localStorage.setItem('articleType', e.target.value);
      noSell.click();
    }
    localStorage.removeItem('tagType');
    tagTypeInput.forEach(input => {
      input.checked = false;
    });
    // 標籤篩選
    if (e.target.value === 'works') {
      tagTypeInput.forEach(input => {
        input.disabled = false;
      });
      for (let i = tagTypeInput.length - 1; i >= tagTypeInput.length - 3; i--) {
        tagTypeInput[i].disabled = true;
      }

      needSell.disabled = false;
    } else if (e.target.value === 'articles') {
      tagTypeInput.forEach(input => {
        input.disabled = false;
      });
      for (let i = 0; i < 6; i++) {
        tagTypeInput[i].disabled = true;
      }
      needSell.disabled = true;
    }
  });
  // 標籤
  tagType.addEventListener('click', (e) => {
    if (e.target.nodeName !== 'DIV') {
      tagType.previousElementSibling.style.color = '#1F0707';
      if (e.target.value === undefined) {
        return;
      }
      
      localStorage.setItem('tagType', e.target.value);
    }
  });
  // 販售選擇
  isSell.addEventListener('click', (e) => {
    if (e.target.nodeName !== 'DIV') {
      if (e.target.value === undefined) {
        return;
      }

      isSell.previousElementSibling.style.color = '#1F0707';
      localStorage.setItem('isSell', e.target.value);
    }
    if (e.target.value === '是,我要販售材料包:') {
      const sellByInput = document.querySelectorAll('.sellBy input[type=radio]');
      sellByInput.forEach(input => input.checked = false );
      addContent.style.display = 'block';

    } else {
      addContent.style.display = 'none';
    }
    if (e.target.value === '否') localStorage.removeItem('sellMethod');
  });
  addContent.addEventListener('click', (e) => {
    isSell.previousElementSibling.style.color = '#1F0707';
    if (e.target.getAttribute('name') === 'sellSelf') {
      localStorage.setItem('sellMethod', e.target.value);
    }
  });
  choose.forEach(label => {
    if (label.children[0].value === localStorage.getItem('articleType')) label.children[0].click();
    if (label.children[0].value === localStorage.getItem('tagType')) label.children[0].click();
    if (label.children[0].value === localStorage.getItem('isSell')) label.children[0].click();
    if (label.children[0].value === localStorage.getItem('sellMethod')) label.children[0].click();
  });
}

function workSell () {
  axios.get(`${baseUrl}/goods`)
    .then(res => {
      goodsData = res.data;
      // 材料選項渲染
      renderOption();
    });
}

function renderOption () {
  const materialStr = ['<option value="" selected hidden disabled>請選擇材料</option>'];
  goodsData.forEach(item => {
    if (item.type !== '材料包' && !item.title.includes('DIY手工玩偶填充棉') && !item.title.includes('記號扣') && !item.title.includes('2mm號簡易鉤針')) materialStr.push(`<option value="${item.title}">${item.title}</option>`);
  });
  material.addEventListener('change', () => {
    const materialColorStr = ['<option value="" selected hidden disabled>請選擇顏色</option>'];
    goodsData.forEach(item => {
      if (item.title === material.value) {
        item.styles.forEach(color => {
          materialColorStr.push(`<option value="${color.name}">${color.name}</option>`);
        });
      }
    });
    materialColor.innerHTML = materialColorStr.join('');
  });
  material.innerHTML = materialStr.join('');
}

// 未完成-編輯文章
postArticleBtn.addEventListener('click', () => {
// 判斷表單
  if (!contentTitle.value) {
    contentTitle.focus();
    Swal.fire({
      icon: 'info',
      title: '表單未確實填寫',
      text: '標題不可為空'
    });
    return;
  }
  if (!localStorage.getItem('articleType')) {
    worksList.focus();
    articleType.previousElementSibling.style.color = 'red';
    Swal.fire({
      icon: 'info',
      title: '表單未確實填寫',
      text: '請選擇分類'
    });
    return;
  }
  if (!localStorage.getItem('tagType')) {
    tagType.previousElementSibling.style.color = 'red';
    worksList.focus();
    Swal.fire({
      icon: 'info',
      title: '表單未確實填寫',
      text: '請選擇標籤'
    });
    return;
  }
  if (localStorage.getItem('isSell') !== '否' && !localStorage.getItem('sellMethod')) {
    isSell.previousElementSibling.style.color = 'red';
    sellBySelf.focus();
    Swal.fire({
      icon: 'info',
      title: '表單未確實填寫',
      text: '請選擇販售方式'
    });
    return;
  }
  if (newArticle.content === '<p><br></p>') {
    Swal.fire({
      icon: 'info',
      title: '內容不得為空'
    });
    return;
  }

  // 作品額外細項
  if (localStorage.getItem('articleType') === 'works') {
    newArticle['q&a'] = newArticle['q&a'] ? newArticle['q&a'] : [];
    if (localStorage.getItem('sellMethod') === '我有自己的販售平台:') {
      newArticle.isSell = sellSelfUrl.value;

    } else if (localStorage.getItem('sellMethod') === '我需要委託該平台販售:') {
      isSellInfo.title = contentTitle.value;
      isSellInfo.price = sellPrice.value;
      newArticle.isSell = isSellInfo;
    }
  }

  if (typeof newArticle.isSell === 'string' && newArticle.isSell === '') {
    Swal.fire({
      icon: 'info',
      title: '請添加販賣網址'
    });
    return;
  }

  if (typeof newArticle.isSell === 'object' && newArticle.isSell.materials.length === 0) {
    Swal.fire({
      icon: 'info',
      title: '請添加所需材料'
    });
    return;
  }

  if (localStorage.getItem('sellMethod') === '我需要委託該平台販售:' && (isSellInfo.price === '' || isSellInfo.price === '0')) {
    Swal.fire({
      icon: 'info',
      title: '請填寫販售金額'
    });
    return;
  };

  postArticleBtn.disabled = true;
  clearTimeout(postArticleDelay);
  if (localStorage.getItem('works')) {
    postArticleDelay = setTimeout(() => {
      postArticleBtn.disabled = false;
      axios.put(`${baseUrl}/works/${localStorage.getItem('works')}`, newArticle)
        .then(() => {
          localStorage.removeItem('works');
          localStorage.removeItem('tagType');
          localStorage.removeItem('isSell');
          localStorage.removeItem('articleType');
          if (localStorage.getItem('sellMethod')) localStorage.removeItem('sellMethod');
          location.href = '/success';
        });
    }, 500);
    return;
  } else if (localStorage.getItem('articles')) {
    postArticleDelay = setTimeout(() => {
      postArticleBtn.disabled = false;
      axios.put(`${baseUrl}/articles/${localStorage.getItem('articles')}`, newArticle)
        .then(() => {
          localStorage.removeItem('articles');
          localStorage.removeItem('tagType');
          localStorage.removeItem('isSell');
          localStorage.removeItem('articleType');
          if (localStorage.getItem('sellMethod')) localStorage.removeItem('sellMethod');
          location.href = '/success';
        });
    }, 500);
    return;
  } else {
    // 新文章
    postArticleDelay = setTimeout(() => {
      postArticleBtn.disabled = false;
      axios.post(`${baseUrl}/${localStorage.getItem('articleType')}`, newArticle)
        .then(() => {
          localStorage.removeItem('tagType');
          localStorage.removeItem('isSell');
          localStorage.removeItem('articleType');
          if (localStorage.getItem('sellMethod')) localStorage.removeItem('sellMethod');
          location.href = '/success';
        });
    }, 500);
    return;
  }
});

function tableOperate () {
  const materialNum = document.querySelector('.materialNum');
  // 新增材料
  let tableText = '';
  addMaterial.addEventListener('click', () => {
    if (material.value === '') return;
    tableText = `<tr>
        <td>${material.value} <span class="ms-3">${materialColor.value ? `(${materialColor.value})` : '(隨機)'}</span></td>
        <td>${materialNum.value}</td>
        <td class="delete" data-index="${isSellInfo.materials.length}">X</td>
        </tr>`;
    materialTable.children[1].innerHTML += tableText;
    isSellInfo.materials.push([material.value, materialColor.value, materialNum.value]);
  });

  // 刪除材料
  materialTable.addEventListener('click', (e) => {
    if (e.target.className === 'delete') {
      e.target.parentElement.remove();
      isSellInfo.materials.splice(e.target.dataset.index, 1);
    }
  });
}

// 富文本配置
// https://www.wangeditor.com/v5/getting-started.html 文黨
const { createEditor, createToolbar } = window.wangEditor;
const editorConfig = {
  placeholder: '請輸入內容...',
  onChange (editor) {
    const html = editor.getHtml().replace(/"/g, '\"');
    newArticle.content = html;
    const newCover = html.split('\"').filter(item => /^http/g.test(item) || /^data:/g.test(item));
    newArticle.img = [...newCover];
    // 封面獲取
    if (newArticle.img.length) {
      newArticle.cover = newArticle.img[0];
      contentImg.setAttribute('src', newArticle.img[0]);
    } else {
      newArticle.cover = 'https://github.com/panduola666/2022JS-/blob/main/public/images/cover.jpg?raw=true';
      contentImg.setAttribute('src', 'https://github.com/panduola666/2022JS-/blob/main/public/images/cover.jpg?raw=true');
    }
  }
};
const editor = createEditor({
  selector: '#editor-container',
  html: '<p><br></p>',
  config: editorConfig,
  mode: 'simple'
});
const toolbarConfig = {
  toolbarKeys: ['bold', 'italic', 'color', 'fontSize', '|', 'insertTable', 'insertImage', 'insertVideo']
};
const toolbar = createToolbar({
  editor,
  selector: '#toolbar-container',
  config: toolbarConfig,
  mode: 'simple'
});
