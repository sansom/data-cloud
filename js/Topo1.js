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
//节点点击
// function nodetext(obj){
//     obj.addEventListener("click", function(){
//         $(".hiddenText").text(obj.text);
//         $(".T-charts").removeClass("go-left-show");
//         $(".T-chart-btn").find("em").removeClass("next-bg");
//         //点击节点让和它相关的线变色
//         for(var i = 0;i < nodeArr.length;i++){
//             if(nodeArr[i].nodeA == obj||nodeArr[i].nodeZ == obj){
//                 nodeArr[i].link.strokeColor="35,135,176";
//                 nodeArr[i].link.drawanimepic("./images/jiantouc.png",scene);
//                 nodeArr[i].link.fontColor = "35,135,176";
//                 nodeArr[i].nodeA.fontColor ="35,135,176";
//                 nodeArr[i].nodeZ.fontColor ="35,135,176";
//             }else{
//                 nodeArr[i].link.strokeColor="165,165,165";
//                 nodeArr[i].link.drawanimepic("./images/jiantou.png",scene);
//                 nodeArr[i].link.fontColor = "102,102,102";
//                 nodeArr[i].nodeA.fontColor ="102,102,102";
//                 nodeArr[i].nodeZ.fontColor ="102,102,102";
//             }
//         }
//     });
// }
//样式调整
document.getElementById("canvas").width=$(".dataTopo").width();
document.getElementById("canvas").height=$(".dataTopo").height();
$("body").attr("data-frame","CapacityAssessment");
var ws=$(".dataTopo").width();
var hs=$(".dataTopo").height();
capadityAjax();
setInterval(function(){
    $("#canvas").empty();
    capadityAjax();
},10000)
var isError=true;
function capadityAjax(){
    //创建画布
    var canvas = document.getElementById('canvas');
    var stage = new JTopo.Stage(canvas);
    var scene = new JTopo.Scene(stage);
    //放大缩小画布
    stage.wheelZoom = 0.95;

    //创建节点的样式
    function node(x, y,t,s){
        var node = new JTopo.Node(t);
        node.strokeColor="165,165,165";
        node.fontColor ="102,102,102";
        // nodetext(node);
        node.setLocation(x, y);
        node.setSize(80,83);
        scene.add(node);
        return node;
    }
    var newName={};
    var nodeArr=[];
    //数据去重
    function unique(arr){
        var tmp = new Array();
        for(var i=0;i<arr.length;i++){
            if(tmp.indexOf(arr[i])==-1){
                tmp.push(arr[i]);
            }
        }
        return tmp;
    }

    var dataArr=[];
    var newData=[];
    var start=false;
    var nArr=[];
    $.ajax({
        url: 'http://192.168.1.184:8081/capacity/getTopology',
        type: 'post',
        dataType: 'json',
        async:false,
        success: function (data) {
            if(data.success){
                //处理数据
                var map = new Array();
                var arr = new Array();
                for(var i=0;i<data.datalist.length;i++){
                    var datas=data.datalist[i];
                    dataArr.push(datas.from.name);
                    dataArr.push(datas.to.name);
                    arr[datas.from.name] = datas.from.tps;
                    arr[datas.to.name] = datas.to.tps;
                }
                var nodeAs=unique(dataArr);
                var nlen=nodeAs.length;
                //绘制节点
                for(var j=0;j<nlen;j++){
                    var n='n'+j
                    var nodeText=nodeAs[j]+"  TPS:"+arr[nodeAs[j]];
                    n=node(ws*(j+1)/(nlen+1)-50,hs/2-50,nodeText);
                    if(arr[nodeAs[j]]>20){
                        n.fontColor ="255,0,0";
                    }
                    nArr.push(n);
                    n.setImage('./images/app.png');
                    if(data.appHealth=="green"){
                        n.setImage('./images/app.png');
                        n.fontColor ="102,102,102";
                    }else if(data.appHealth=="red"){
                        n.setImage('./images/appc.png');
                        n.fontColor ="202,79,75";
                    }
                    map[nodeAs[j]] = n;
                }
                start=true;
                if(start){
                    linkAdd(data, map);
                }
            }
            isError=true;
        },
        error:function(){
            if(isError){
                layer.msg("数据获取异常", {
                    offset: 't',
                    anim: 0
                });
                isError=false;
            }
        }
    })
    //绘制链接线
    function linkAdd(data, map){
        for(var k=0;k<data.datalist.length;k++){
            var datas=data.datalist[k];
            var nfrom,nto;
            nfrom = map[datas.from.name];
            nto = map[datas.to.name];
            linkStyle(k,nfrom,nto)
        }

        start=false;
    }
    //绘制连接线的样式
    function linkStyle(k,f,t){
        var link='link'+k
        link = new JTopo.Link(f,t,'');
        var nodeJson={
            link:link,
            nodeA:f,
            nodeZ:t
        };
        nodeArr.push(nodeJson);
        // linktext(link);
        link.drawanimepic("./images/jiantou.png",scene);
        link.strokeColor="102,102,102";
        link.lineWidth = 1;
        link.arrowsRadius = 8;
        link.alarmColor = '255,0,0';
        link.direction = 'vertical';
        link.fontColor = "102,102,102";
        scene.add(link);
    }
}
//开始
$("#start").bind('click',function(){
    var Tps=$.trim($("#Tps").val());
    var ThreadCount=$.trim($("#ThreadCount").val());
    //是否为空
    if(Tps==""){
        layer.msg("请输入Tps", {
            offset: 't',
            anim: 0
        });
        return;
    }
    if(ThreadCount==""){
        layer.msg("请输入ThreadCount", {
            offset: 't',
            anim: 0
        });
        return;
    }
    $.ajax({
        url:'http://192.168.1.184:8081/capacity/startPressure?tps='+Tps+'&threadCount='+ThreadCount,
        type:"GET",
        dataType: 'json',
        success:function(data){
            if(data.success){
                layer.msg("已开始", {
                    offset: 't',
                    anim: 0
                });
            }

        },
        error:function(){
            layer.msg("数据获取异常", {
                offset: 't',
                anim: 0
            });
        }
    })
})
//暂停
$("#stop").bind('click',function(){
    $.ajax({
        url:'http://192.168.1.184:8081/capacity/stopPressure',
        type:"GET",
        dataType: 'json',
        success:function(){
            if(data.success){
                layer.msg("已暂停", {
                    offset: 't',
                    anim: 0
                });
            }
                        },
        error:function(){
            layer.msg("数据获取异常", {
                offset: 't',
                anim: 0
            });
        }
    })
})