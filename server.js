const express = require ('express');
const  engine = require('ejs-locals');
const app = express();
const PORT = process.env.PORT || 3030;
app.use(express.static(__dirname + '/public/'));
app.engine('ejs', engine);
var ejs = require('ejs')
app.set('views',__dirname+'/view');
app.set('view engine', 'ejs'); 



//載入網頁
app.get('/', function (req, res) {
    res.render('layout', {title:'鉤針手作平台',body:'index.ejs'});
});
app.get('/user/:id', function (req, res) {
    res.render('layout', {title:'會員專區',body:'user.ejs'});
});
app.get('/addArticle', function (req, res) {
    res.render('layout', {title:'發布',body:'addArticle.ejs'});
});
app.get('/article/:tag/:id', function (req, res) {
    res.render('layout', {title:'文章',body:'article.ejs'});
});
app.get('/articlesList', function (req, res) {
    res.render('layout', {title:'技巧文章',body:'articlesList.ejs'});
});
app.get('/goodsList', function (req, res) {
    res.render('layout', {title:'購買商城',body:'goodsList.ejs'});
});
app.get('/login', function (req, res) {
    res.render('layout', {title:'登入/註冊',body:'login.ejs'});
});
app.get('/myOrder/:id', function (req, res) {
    res.render('layout', {title:'我的訂單',body:'myOrder.ejs'});
});
app.get('/orderDerail/:id/:orderId', function (req, res) {
    res.render('layout', {title:'訂單詳情',body:'orderDerail.ejs'});
});
app.get('/shoppingCar/:id', function (req, res) {
    res.render('layout', {title:'購買清單',body:'shoppingCar.ejs'});
});
app.get('/shoppingFinish/:id', function (req, res) {
    res.render('layout', {title:'完成',body:'shoppingFinish.ejs'});
});
app.get('/shoppingPay/:id', function (req, res) {
    res.render('layout', {title:'購買人資訊',body:'shoppingPay.ejs'});
});
app.get('/success', function (req, res) {
    res.render('layout', {title:'成功',body:'success.ejs'});
});
app.get('/userSell/:id', function (req, res) {
    res.render('layout', {title:'材料包管理',body:'userSell.ejs'});
});
app.get('/worksList', function (req, res) {
    res.render('layout', {title:'作品列表',body:'worksList.ejs'});
});
app.get('/myArticle/:id', function (req, res) {
    res.render('layout', {title:'我的文章',body:'myArticle.ejs'});
});
app.get('/myMessage/:id', function (req, res) {
    res.render('layout', {title:'我的留言',body:'myMessage.ejs'});
});
app.get('/mySave/:id', function (req, res) {
    res.render('layout', {title:'我的收藏',body:'mySave.ejs'});
});
app.get('/commodity/:id', function (req, res) {
    res.render('layout', {title:'商品',body:'commodity.ejs'});
});
app.get('/admin', function (req, res) {
    res.render('layout', {title:'後台管理',body:'admin.ejs'});
});

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });