$(document).ready(function(){
    $("<span style='color:#999;font-size:14px;padding:15px;display:block;'>没有数据<br><small>（选择需要查询的信息可以查看需要的数据）</small></span>").appendTo("#table-tbody");
    //开始时间
    var start={
        elem:"#start",
        format:"YYYY-MM-DD hh:mm:ss",
        min: '1900-01-01 00:00:00', //最小日期
        max: '2099-12-31 23:59:59', //最大日期
        istime:true,
        istoday:false,
        choose:function(datas){
            end.min=datas;
            end.start=datas;
        }
    };
    //结束时间
    var end={
        elem:"#end",
        format:"YYYY-MM-DD hh:mm:ss",
        //min:laydate.now(),
        min: '1900-01-01 00:00:00', //最小日期
        max: '2099-12-31 23:59:59', //最大日期
        //max:"2099-06-16 23:59:59",
        istime:true,
        istoday:false,
        choose:function(datas){
            start.max=datas;
        }
    };
    laydate(start);
    laydate(end);
    //获取地区下拉列表
    $.ajax({
        url:'http://192.168.1.241:8080/calc/power/query/province',
        type:'POST',
        dataType:'json',
        contentType:"application/json; charset=utf-8",
        success:function(data){
            if(data.success){
                for(var i=0;i<data.datalist.length;i++){
                    var datas=data.datalist[i];
                    $("<option value="+datas.provinceId+">"+datas.name+"</option>").appendTo("#province")
                }
            }
        },
        error:function(data){
            layer.msg("服务获取失败["+data.errorCode+"]", {
                offset: 't',
                anim: 0
            });
        }
    });
    $(".oldSeek").click(function(){
        sift(this,'http://192.168.1.241:8080/calc/power/mysql/group')
    })
    $(".newSeek").click(function(){
        sift(this,'http://192.168.1.241:8080/calc/power/es/group')
    })
})
//新能指标
function SQLchart(obj,type){
    var type=$('body').attr("data-type",type);
    layerPop('性能指标',['80%', '90%'],'./SQLchart.html');
}
//拓扑
function oldDBTopo(obj,type){
    var type=$('body').attr("data-type",type);
    layerPop('旧框架DB拓扑',['60%', '72%'],'./DBTopo.html');
}
function newDBTopo(obj,type){
    var type=$('body').attr("data-type",type);
    layerPop('新框架DB拓扑',['60%', '72%'],'./DBTopo.html');
}
//small-logo弹框
function Pop(obj){
    var type=$(obj).attr("data-tar")
    $('body').attr("data-tar",type);
    if(type=='mark'){
        layerPop('慢SQL查询',['40%', '48%'],'./DBPop.html');
    }else if(type=='dataTotal'){
        layerPop('表数据总量',['30%', '40%'],'./DBPop.html');
    }else if(type=='formOrganization'){
        layerPop('表结构',['80%', '90%'],'./DBPop.html');
    }
}
//弹框调用函数
function layerPop(t,a,h){
    layer.open({
        type: 2,
        title: t,
        shadeClose: true,
        shade: 0.8,
        area: a,
        content:h //iframe的url
    });
}
//筛选
function sift(obj,url){
    var start=$("#start").val();
    var end=$("#end").val();
    var province=$("#province").val()==""?null:$("#province").val();
    var area=$("#province option:selected").text();
    var dataJson={
        'startDate':start,
        'endDate':end,
        'data':{
            'opSiteProvinceCode':province,
            'opSiteProvince':area
        }
    }
    var index = layer.load(2, {shade: false});
    $.ajax({
        url:url,
        type:'POST',
        dataType:'json',
        data:JSON.stringify(dataJson),
        contentType:"application/json; charset=utf-8",
        success:function(data){
            if(data.result.success){
                $("#table-tbody").empty();
                $("#table-tbody span").css({display:"none"});
                $(".table-time").text("耗时："+data.timeCost+"毫秒");
                var datar=data.result.datalist
                for(var i=0;i<datar.length;i++){
                    var datas=datar[i];
                    $("<tr><td>"+datas.id+"</td><td>"+datas.opSiteProvince+"</td></tr>").appendTo("#table-tbody");
                }
                layer.close(index);
            }
        },
        error:function(data){
            layer.msg("服务获取失败["+data.errorCode+"]", {
                offset: 't',
                anim: 0
            });
            layer.close(index);
        }
    })
}