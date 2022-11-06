const express = require ('express');
const  engine = require('ejs-locals');
const app = express();
app.use(express.static(__dirname + '/public/'));
app.engine('ejs', engine);
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
    //這裡放文章標題
    //這裡放文章標題
    //這裡放文章標題
    //這裡放文章標題
    //這裡放文章標題
    //這裡放文章標題
    res.render('layout', {title:'  這裡放文章標題   ',body:'article.ejs'});
});
app.get('/articleList', function (req, res) {
    res.render('layout', {title:'技巧文章',body:'articleList.ejs'});
});
app.get('/goodsList', function (req, res) {
    res.render('layout', {title:'購買商城',body:'goodsList.ejs'});
});
app.get('/login', function (req, res) {
    res.render('layout', {title:'登入/註冊',body:'login.ejs'});
});
app.get('/myOrder', function (req, res) {
    res.render('layout', {title:'我的訂單',body:'myOrder.ejs'});
});
app.get('/orderDerails', function (req, res) {
    res.render('layout', {title:'訂單詳情',body:'orderDerails.ejs'});
});
app.get('/shoppingCar', function (req, res) {
    res.render('layout', {title:'購買清單',body:'shoppingCar.ejs'});
});
app.get('/shoppingFinish', function (req, res) {
    res.render('layout', {title:'完成',body:'shoppingFinish.ejs'});
});
app.get('/shoppingPay', function (req, res) {
    res.render('layout', {title:'購買人資訊',body:'shoppingPay.ejs'});
});
app.get('/success', function (req, res) {
    res.render('layout', {title:'成功',body:'success.ejs'});
});
app.get('/userSell', function (req, res) {
    res.render('layout', {title:'材料包管理',body:'userSell.ejs'});
});
app.get('/worksList', function (req, res) {
    res.render('layout', {title:'作品列表',body:'worksList.ejs'});
});
app.get('/myArticle', function (req, res) {
    res.render('layout', {title:'我的文章',body:'myArticle.ejs'});
});
app.get('/myMessage', function (req, res) {
    res.render('layout', {title:'我的留言',body:'myMessage.ejs'});
});
app.get('/mySave', function (req, res) {
    res.render('layout', {title:'我的收藏',body:'mySave.ejs'});
});



app.listen(333);
console.log( `點擊這裡開始:http://localhost:333`);