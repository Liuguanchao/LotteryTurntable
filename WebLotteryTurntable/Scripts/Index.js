/// <reference path="_references.js" />
$(document).ready(function () {
    //开始抽奖事件
    $('#start').click(function () {
        //生成随机数据 
        var Randomnum = getRandom();

        //先转5圈,因转盘的(0,0)是3点的位置，设置为5*360-90=1710
        var num = 1710 + Randomnum;

        //计算第几个奖品数据被选中
        var count = Math.ceil(Randomnum / (360 / datacount)) - 1;



        //转盘旋转
        $("#myCanvas").rotate({
            angle: 0,
            animateTo: num,
            duration: 5000,
            easing: $.easing.easeOutQuart,
            callback: function () {
                alert(dataObj[count].name);
            }
        });
    });
});
//生成1~359之间的随机数
function getRandom() {
    var num = Math.floor(Math.random() * 360);
    if (num === 0) {
        num = 1;
    }
    return num;
};
//页面加载后渲染转盘
window.onload = function () {

    //读取抽奖数据
    $.ajax({
        type: "Get",
        url: "Data/data.json",
        data: "json",
        success: function (data) {
            if (data.length <= 0) {
                alert("没有抽奖数据!");
                return;
            }
            dataObj = data;
            drawRoule();
        },
        error: function (errorThrown) {
            alert(errorThrown);
        }
    });
};
var dataObj = [];
var datacount = 0;
function drawRoule() {
    var canvas = document.getElementById("myCanvas");
    if (canvas.getContext) {

        //抽奖数据个数
        datacount = dataObj.length;
        //根据抽奖数据个数计算，每个抽奖数据所占整个圆的弧度。2 * Math.PI表示整个圆的弧度
        var arc = 2 * Math.PI / datacount;

        //绘画元素声明
        var ctx = canvas.getContext("2d");
        //在给定矩形内清空一个矩形
        ctx.clearRect(0, 0, 421, 421);
        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
        ctx.strokeStyle = "#FFBE04";

        //font 设置或返回文本内容的当前字体属性
        ctx.font = '16px Microsoft YaHei';

        for (var i = 0; i < datacount; i++) {

            var angle = i * arc;//每个抽奖数据的开始角度

            ctx.fillStyle = dataObj[i].color;

            ctx.beginPath();

            //x 圆的中心的 x 坐标。
            //y	圆的中心的 y 坐标。
            //r	圆的半径。
            //sAngle	起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。
            //eAngle	结束角，以弧度计。
            //counterclockwise	可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针。
            ctx.arc(211, 211, 70, angle, angle + arc, false);
            //ctx.arc(211, 211, 190, angle, angle + arc, false);
            ctx.arc(211, 211, 190, angle + arc, angle, true);

            //绘制已定义的路径
            ctx.stroke();

            //填充当前绘图（路径）
            ctx.fill();

            //保存当前环境的状态
            ctx.save();

            //设置或返回用于填充绘画的颜色、渐变或模式
            ctx.fillStyle = "#E5302F";
            var text = dataObj[i].name;

            //translate重新映射画布上的 (0,0) 位置 
            //将奖品名称设置到需要显示的位置上。
            ctx.translate(211 + Math.cos(angle + arc / 2) * 155, 211 + Math.sin(angle + arc / 2) * 155);

            //rotate方法旋转当前绘图
            //将奖品名称按照角度旋转
            ctx.rotate(angle + arc / 2 + Math.PI / 2);

            //将奖品
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);


            ////添加对应图标
            //if (text.indexOf("闪币") > 0) {
            //    var img = document.getElementById("shan-img");
            //    img.onload = function () {
            //        ctx.drawImage(img, -15, 10);
            //    };
            //    ctx.drawImage(img, -15, 10);
            //} else if (text.indexOf("谢谢参与") >= 0) {
            //    var img = document.getElementById("sorry-img");
            //    img.onload = function () {
            //        ctx.drawImage(img, -15, 10);
            //    };
            //    ctx.drawImage(img, -15, 10);
            //}
            ctx.restore();

        }
        //因转盘数据顺时针旋转，而转盘块也是顺势针生成的。
        //将数据翻转用于弹出框显示
        dataObj.reverse();
    }

}



