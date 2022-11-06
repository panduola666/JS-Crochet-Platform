
//銷售分析 配置
var chart = document.querySelector('#myChart');
var myChart = new Chart(chart, {
    type: 'bar',
    data: {
        //標題
        labels: ['可愛蛋糕水桶包', '桃心小猴玩偶', '12生肖-豬', '兩用式圍脖', '桃心小猴玩偶', '12生肖-豬', '兩用式圍脖', '可愛蛋糕包', '桃心小猴玩偶', '12生肖-豬', '兩用式圍脖', '桃心小猴玩偶', '12生肖-豬', '兩用式圍脖'],
        datasets: [{
            label: '銷售數量',//標籤
            data: [10, 11, 12, 14, 7, 1, 1, 10, 11, 12, 14, 7, 33, 1],//資料
            backgroundColor: [//被景色
                'rgba(255, 99, 132, 0.2)'
            ],
            borderWidth: 1,//外框寬度
        }]
    },
    options: {
        indexAxis: 'y',
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each horizontal bar to be 2px wide
        elements: {
            bar: {
                borderWidth: 2,
            }
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: false,
                text: '材料包銷售分析'
            }
        }
    }
});