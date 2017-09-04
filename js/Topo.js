//箭头动态
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
JTopo.Link.prototype.drawanimepic=function(imgurl,scene,width,height){
    var imgnode=new JTopo.Node();

    imgnode.setSize(width?width:16,height?height:16)
    imgnode.setImage(imgurl);
    imgnode.zIndex=2.5;
    var thislink=this;
    this.isremove=false;
    function b(a, b) {
        var c = [];
        if (null == a || null == b) return c;
        if (a && b && a.outLinks && b.inLinks) for (var d = 0; d < a.outLinks.length; d++) for (var e = a.outLinks[d], f = 0; f < b.inLinks.length; f++) {
            var g = b.inLinks[f];
            e === g && c.push(g)
        }
        return c
    }
    function c(a, c) {
        var d = b(a, c),
            e = b(c, a),
            f = d.concat(e);
        return f
    }
    function d(a) {
        var b = c(a.nodeA, a.nodeZ);
        return b = b.filter(function(b) {
            return a !== b
        })
    }
    thislink.removeHandler = function() {
        this.isremove=true;
        var a = this;
        this.nodeA && this.nodeA.outLinks && (this.nodeA.outLinks = this.nodeA.outLinks.filter(function(b) {
            return b !== a
        })),
        this.nodeZ && this.nodeZ.inLinks && (this.nodeZ.inLinks = this.nodeZ.inLinks.filter(function(b) {
            return b !== a
        }));
        var b = d(this);
        b.forEach(function(a, b) {
            a.nodeIndex = b
        })
    };
    function imgnodeanime(){
        if(!thislink.isremove){
            if(thislink.nodeA.outLinks){
                var xs=thislink.nodeA.cx- thislink.nodeZ.cx,
                    xy=thislink.nodeA.cy- thislink.nodeZ.cy,
                    l = Math.floor(Math.sqrt(xs * xs + xy * xy)),
                    j=l;
                xl=xs/ l, yl=xy/l;
                var animespeed=(new Date()/33);
                var colorpoint=parseInt(animespeed%l);
                imgnode.rotate=(Math.atan(xy/xs))+(xs>0?Math.PI:0);
                imgnode.cx=thislink.nodeA.cx-colorpoint*xl;
                imgnode.cy=thislink.nodeA.cy-colorpoint*yl;
                window.requestAnimationFrame(imgnodeanime);
            }
        }else{
            scene.remove(imgnode)
        }
    }
    window.requestAnimationFrame(imgnodeanime);
    scene.add(imgnode);
    return imgnode;
};

//动态虚线
/*CanvasRenderingContext2D.prototype.JTopoDashedLineTo = function(a, b, c, d, e) {
    var animespeed=(new Date())/100;
    "undefined" == typeof e && (e = 5);
    var f = c - a,//x轴差
        g = d - b,//y轴差
        h = Math.floor(Math.sqrt(f * f + g * g)),//勾股定理,直线长度
        i = 0 >= e ? h: h / e,//虚线段数
        j = g / h * e,
        k = f / h * e;
    this.beginPath();
    animespeed=animespeed%(e*2);
    var txs=-f/h*animespeed;
    var tys=-g/h*animespeed;
    for (var l = 0; i > l; l++) {
        l % 2 ? this.lineTo(a + l * k-txs, b + l * j-tys) : this.moveTo((a + l * k-txs)>(a+i*k)?(a + l * k):(a + l * k-txs), (b + l * j-tys)>(b + i * j)?(b + l * j):(b + l * j-tys))
    };
    this.stroke()
};
CanvasRenderingContext2D.prototype.JtopoDrawPointPath=function(a,b,c,d,e,f){
    var animespeed=(new Date())/10;
    var xs=c- a,
        xy=d- b,
        l = Math.floor(Math.sqrt(xs * xs + xy * xy)),
        colorlength=50,
        j=l;
    xl=xs/ l,
        yl=xy/l;
    var colorpoint=animespeed%(l+colorlength)-colorlength;

    for(var i=0;i<j;i++){
        if(((i)>colorpoint)&&((i)<(colorpoint+colorlength))){
            this.beginPath();
            this.strokeStyle=e;
            this.moveTo(a+(i-1)*xl,b+(i-1)*yl);
            this.lineTo(a+i*xl,b+i*yl);
            this.stroke();
        }else{
            this.beginPath();
            this.strokeStyle=f;
            this.moveTo(a+(i-1)*xl,b+(i-1)*yl);
            this.lineTo(a+i*xl,b+i*yl)
            this.stroke();
        }
    }
};*/
//弹出浮框
/*function alarmStyle(obj){
    obj.paintAlarmText = function(a) {
        if (null != this.alarm && "" != this.alarm) {
            var b = this.alarmColor || "255,0,0",
                c = this.alarmAlpha || .5;
            a.beginPath(),
                a.font = this.alarmFont || "10px 微软雅黑";
            var textArray = this.alarm.split('\n');
            var rowCnt = textArray.length;
            var i = 0,imax  = rowCnt,maxLength = 0;maxText = textArray[0];
            for(;i<imax;i++){
                var nowText = textArray[i],textLength = nowText.length;
                if(textLength >=maxLength){
                    maxLength = textLength;
                    maxText = nowText;
                }
            }
            var maxWidth = a.measureText(maxText).width;
            var lineHeight = a.measureText("元").width;
            //算出alarm的最大的宽度
            var d =((a.measureText(this.alarm).width/rowCnt +6)>maxWidth?(a.measureText(this.alarm).width/rowCnt +6):maxWidth+6);
            var e = a.measureText("田").width ,
                f = this.width / 2 - d / 2,
                g = (-this.height / 2 - e*rowCnt ) -8;
            e=(e)*rowCnt;
            //绘制alarm的边框
            a.strokeStyle = "rgba(" + b + ", " + c + ")",
                a.fillStyle = "rgba(" + b + ", " + c + ")",
                a.lineCap = "round",
                a.lineWidth = 1,
                a.moveTo(f, g),
                a.lineTo(f + d, g),
                a.lineTo(f + d, g + e),
                a.lineTo(f + d / 2 + 6, g + e),
                a.lineTo(f + d / 2, g + e + 8),
                a.lineTo(f + d / 2 - 6, g + e),
                a.lineTo(f, g + e),
                a.lineTo(f, g),
                a.fill(),
                a.stroke(),
                a.closePath(),
                a.beginPath(),
                a.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")",
                a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")",
                (function(a,b,x,y,textArray){
                    for(var j= 0;j<textArray.length;j++){
                        var words = textArray[j];
                        a.fillText(words,x,y);
                        y+= lineHeight;
                    }
                })(a,this,f,g+8,textArray),
                a.closePath()
        }
    }
}*/
// 二次折线
 // function newFlexionalLink(nodeA, nodeZ, text, direction, dashedPattern){
 //     var link = new JTopo.FlexionalLink(nodeA, nodeZ, text);
 //     link.direction = direction || 'horizontal';
 //     link.arrowsRadius = 10;
 //     link.lineWidth = 3; // 线宽
 //     link.offsetGap = 76;
 //     link.bundleGap = 15; // 线条之间的间隔
 //     link.textOffsetY = 10; // 文本偏移量（向下15个像素）
 //     link.strokeColor = '0,250,0';
 //     link.dashedPattern = dashedPattern;
 //     scene.add(link);
 //     return link;
 // }

//节点点击
function nodetext(obj){
    obj.addEventListener("click", function(){
        $(".hiddenText").text(obj.text);
        $(".T-charts").removeClass("go-left-show");
        $(".T-chart-btn").find("em").removeClass("next-bg");
        //点击节点让和它相关的线变色
        for(var i = 0;i < nodeArr.length;i++){
            if(nodeArr[i].nodeA == obj||nodeArr[i].nodeZ == obj){
                nodeArr[i].link.strokeColor="35,135,176";
                nodeArr[i].link.drawanimepic("./images/jiantouc.png",scene);
                nodeArr[i].link.fontColor = "35,135,176";
                nodeArr[i].nodeA.fontColor ="35,135,176";
                nodeArr[i].nodeZ.fontColor ="35,135,176";
            }else{
                nodeArr[i].link.strokeColor="165,165,165";
                nodeArr[i].link.drawanimepic("./images/jiantou.png",scene);
                nodeArr[i].link.fontColor = "102,102,102";
                nodeArr[i].nodeA.fontColor ="102,102,102";
                nodeArr[i].nodeZ.fontColor ="102,102,102";
            }
        }
        //数据交互
        // ajaxGit()
    });
}



//线上的alarm
/*function linkAlarm(link,t){
     link.alarm = t;
     setInterval(function(){
         if(link.alarm == img){
             link.alarm = null;
         }else{
             link.alarm = img;
         }
     }, 600);
     // alarmStyle(link);
}*/

//线双击
/*function linktext(obj){
     obj.addEventListener("click", function(){
         $(".hiddenText").text(obj.text);
         //点击线获取到和它相关的线
         var ax=obj.nodeA.x;
         var ay=obj.nodeA.y;
         var zx=obj.nodeZ.x;
         var zy=obj.nodeZ.y;
         var newx=(ax+zx)/2+50;
         var newy=(ay+zy)/2-50;
         console.log(newx,ay,zy);
         $(".linkDetailUl").css({display:"block"});
         $(".linkDetail").css({top:newy,left:newx,display:"block"}).html($("linkDetailUl"));
         //数据交互
         // ajaxGit()
     });
     obj.addEventListener("mouseout", function(){
         $(".linkDetail").css({display:"none"});
         $(".linkDetailUl").css({display:"none"});
     })
}*/

var ws=$(".dataTopo").width();
var hs=$(".dataTopo").height();

//创建画布
var canvas = document.getElementById('canvas');
var stage = new JTopo.Stage(canvas);
var scene = new JTopo.Scene(stage);
//放大缩小画布
stage.wheelZoom = 0.95;

//创建节点
function node(x, y,t,s){
    var node = new JTopo.Node(t);
    node.strokeColor="165,165,165";
    node.fontColor ="102,102,102";
    nodetext(node);
    node.setLocation(x, y);
    node.setSize(40,43)
    scene.add(node);
    return node;
}
//创建连接线
var nodeArr=[];
function linkNode(nodeA,nodeZ,t){
    var link;
    link = new JTopo.Link(nodeA,nodeZ,t);
    var nodeJson={
        link:link,
        nodeA:link.nodeA,
        nodeZ:link.nodeZ
    };
    nodeArr.push(nodeJson);
    // linktext(link);
    link.lineWidth = 1;
    link.arrowsRadius = 8;
    link.alarmColor = '255,0,0';
    link.direction = 'vertical';
    link.fontColor = "102,102,102";
    scene.add(link);
    return link;
}
var nodearr=[];
var index=[];
var linkText=[];
var linkColor=[false,false,false,false,false]
$.ajax({
    url: 'http://192.168.1.241:8080/status/health',
    type: 'post',
    dataType: 'json',
    async:false,
    success: function (data) {
        var db=node(ws/2-50,hs/2,data.dbName);
        db.textOffsetX = 20
        if(data.dbHealth=="green"){
            db.setImage('./images/db.png');
            db.fontColor ="102,102,102";
        }else{
            db.setImage('./images/dbc.png');
            db.fontColor ="202,79,75";
        }
        nodearr.push(db);
        var n=node(ws/4-50,5*hs/6,'对账');
        if(data.appHealth=="green"){
            n.setImage('./images/app.png');
            n.fontColor ="102,102,102";
            linkColor[0]=false;
        }else{
            n.setImage('./images/appc.png');
            n.fontColor ="202,79,75";
            linkColor[0]=true;
        }
        nodearr.push(n);
        linkText.push(''+data.appTimeConsuming + " 毫秒");
    }
});
function nodeAjax(url,text,w,h,i){
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        async:false,
        success: function (data) {
            var n=node(w,h,text);
            if(data.appHealth=="green"){
                n.setImage('./images/app.png');
                n.fontColor ="102,102,102";
                linkColor[i]=false;
            }else{
                n.setImage('./images/appc.png');
                n.fontColor ="202,79,75";
                linkColor[i]=true;
            }
            nodearr.push(n);
            linkText.push(''+data.appTimeConsuming + " 毫秒")
        }
    });
}
nodeAjax('http://192.168.1.241:8081/status/health','运单创建',ws/4-50,hs/6,1);
nodeAjax('http://192.168.1.241:8082/status/health','网点',ws/4-50,2*hs/6,2);
nodeAjax('http://192.168.1.241:8083/status/health','轨迹推送',ws/4-50,3*hs/6+0.1,3);
nodeAjax('http://192.168.1.241:8084/status/health','运单计算',ws/4-50,4*hs/6,4);
var linkarr=[];
var link1 = linkNode(nodearr[1],nodearr[0],linkText[0]);
linkCheck(linkColor[0],link1);
var link2 = linkNode(nodearr[2],nodearr[0],linkText[1]);
linkCheck(linkColor[1],link2);
var link3 = linkNode(nodearr[3],nodearr[0],linkText[2]);
linkCheck(linkColor[2],link3);
var link4 = linkNode(nodearr[4],nodearr[0],linkText[3]);
linkCheck(linkColor[3],link4);
var link5 = linkNode(nodearr[5],nodearr[0],linkText[4]);
linkCheck(linkColor[4],link5);
linkarr.push(link1);
linkarr.push(link2);
linkarr.push(link3);
linkarr.push(link4);
linkarr.push(link5);

function linkCheck(obj,link){
    if(obj){
        link.drawanimepic("./images/jiantoucheck.png",scene);
        link.strokeColor="202,79,75";
        link.fontColor = "202,79,75";
    }else{
        link.drawanimepic("./images/jiantou.png",scene);
        link.strokeColor="102,102,102";
        link.fontColor = "102,102,102";
    }
}
if($("body").attr("data-frame")=="newFrame"){
    var node7 = node(3*ws/4,hs/2,"");
    node7.setImage('./images/text.png');
    node7.setSize(100,40);
    var node8 = node((3*ws/4+30.1),3*hs/4,"DBss");
    node8.setImage('./images/app.png');
    var link6 = linkNode(nodearr[0],node7,'',false);
    link6.dashedPattern=10;
    link6.arrowsRadius=0;
    link6.strokeColor="102,102,102";
    var link8 = linkNode(nodearr[0],node7,'',false);
    link8.strokeColor="102,102,102";
    var link9 = linkNode(nodearr[0],node7,'666',false);
    link9.dashedPattern=10;
    link9.arrowsRadius=0;
    link9.drawanimepic("./images/jiantou.png",scene);
    link9.strokeColor="102,102,102";
    var link7 = linkNode(node8,node7,'777',false);
    link7.drawanimepic("./images/jiantou.png",scene);
    link7.strokeColor="102,102,102";
}