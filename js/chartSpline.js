function times(str){
    var d,h,m,s,ms,dd=1000*1000*60*60*24,hh=1000*1000*60*60,mm=1000*1000*60,ss=1000*1000,mss=1000;
    d=Math.floor(str/dd);
    h=Math.floor((str-d*dd)/hh);
    m=Math.floor((str-d*dd-h*hh)/mm);
    s=Math.floor((str-d*dd-h*hh-m*mm)/ss);
    ms=Math.floor((str-d*dd-h*hh-m*mm-s*ss)/mss);
    us=str-d*dd-h*hh-m*mm-s*ss-ms*mss;
    if(d>0){
        return (d+"天"+h+"小时"+m+"分钟"+s+"秒"+ms+"毫秒"+us+"微秒");
    }else{
        if(h>0){
            return (h+"小时"+m+"分钟"+s+"秒"+ms+"毫秒"+us+"微秒");
        }else{
            if(m>0){
                return (m+"分钟"+s+"秒"+ms+"毫秒"+us+"微秒");
            }else{
                if(s>0){
                    return (s+"秒"+ms+"毫秒"+us+"微秒");

                }else {
                    if(ms>0){
                        return (ms+"毫秒"+us+"微秒");
                    }else{
                        return (us+"微秒");
                    }
                }
            }
        }
    }
}
function chartSpline1(el,scale,dataJson,dates){
    Highcharts.setOptions({
        global: {
            useUTC: false//获取实时时间
        },
        credits: {
            enabled:false//去掉官方链接标识
        },
    });
    var title = {//大标;
        text: $(el).attr("data-title"),
        align:'left',
        style:{fontSize:"14px"}
    };
     /*var subtitle = {//小标
        text: 'Source: runoob.com'
    };*/
    var xAxis = {
        title: {//x轴名称
            text: $(el).attr("data-x")//'Temperature (\xB0C)',
        },
        tickPixelInterval:10,
        tickInterval: 1,
        tickmarkPlacement: 'on',
        categories: scale,
        //gridLineWidth: 1//显示竖行网格线;
        //gridLineColor:'red',//设置网格线的颜色
        //lineColor:'red',//轴的颜色
        //tickColor:'red',//刻度颜色
        //tickWidth:0//x轴刻度不显示
    };
    var yAxis = [
        {
            title: {
                text: $(el).attr("data-y"),
                x:-10
            },
            lineWidth: 1,
            labels: {
                enabled: true
            }
            //lineColor:'red',//轴的颜色
            //gridLineColor:'red',//设置网格线的颜色
            //tickColor:'red',//刻度颜色
            //tickWidth:1//y轴刻度显示
        }
    ];
    // var yAxis = [{
    //     title: {
    //         text: '',

    //     },
    //     lineWidth: 1,
    //     labels: {
    //         enabled: true
    //     }
    // },{
    //     opposite: true,
    //     title: {
    //         text: ''
    //     },
    //     lineWidth: 1,
    //     labels: {
    //         enabled: true
    //     }
    // }
    // ];
    //缩放  曲线'spline'
    var chart = {
        type: $(el).attr("chart-type"),
        zoomType: 'x',
    //  inverted: true  //旋转
    };
    var tooltip = {
        valueSuffix:null,// $(el).attr("data-unit"),
        shared: true,//去掉或false显示单个数据,不去显示整列数据。
        crosshairs: [{  //true-&#45;&#45;是鼠标划上,在所在的区域显示一个背景;
            width: 1,
            color: '#ddd'
        }],//鼠标划上,在所在的区域显示一条线;
        formatter: function() {
            var s
            $.each(this.points, function(i, point) {
                s = '<b style="color:' + point.series.color + '">' + this.x + '</b>';
                var name = point.series.name;
                var qps = Math.round(point.y * 1000 / point.series.options.pointInterval);
                if(name==('数据库耗时 ('+dates+')')){
                    s += '<br/><span style="color:' + point.series.color + '">'
                        + "数据库耗时 ("+dates+")" + ': </span>'+times(this.y);
                }else if (name == ('活跃线程 ('+dates+')')) {
                    s += '<br/><span style="color:' + point.series.color + '">'
                        + "活跃线程 ("+dates+")" + ': </span>'+this.y ;
                }else if (name == ('QPS ('+dates+')')) {
                    s += '<br/><span style="color:' + point.series.color + '">'
                        + "QPS ("+dates+")" + ': </span>'+this.y ;
                }else {
                    s += '<br/><span style="color:' + this.series.color + '">'
                        + this.series.name + ': </span>' + this.y;
                }
            });
            return s;
        }
    };
    var plotOptions = {
        spline: {//设置数据的线
            lineWidth:3,//大小
            fillOpacity: 0.1,
            marker: {//设置数据的点
                enabled: true,//划上前是否显示;
                states: {
                    hover: {
                        enabled: true,//划上后是否显示;
                        radius: 6//大小
                    }
                }
            },
            shadow: false
        }
    };
    var legend = {//设置颜色指示标签的样式
        align: 'center',
        verticalAlign: 'bottom',
        y: 20,
        floating: true,
        borderWidth: 0
    };
    var series =  dataJson

    var json = {};

    json.title = title;//title
    json.subtitle = null;//subtitle
    json.xAxis = xAxis;
    json.yAxis = yAxis;
    json.tooltip = tooltip;
    json.legend = legend;
    json.series = series;
    json.chart = chart;
    json.plotOptions = plotOptions;
    $(el).highcharts(json);
}
function columnS(el,dataJ){
    $(el).highcharts({
        chart: {
            type: $(el).attr("chart-type")
        },
        credits: {
            enabled:false//去掉官方链接标识
        },
        title: {
            text: ''
        },
        xAxis: {
            title: {//x轴名称
                text: $(el).attr("data-x")//'Temperature (\xB0C)',
            },
            type: 'category',
            tickmarkPlacement: 'on',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '12px'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: $(el).attr("data-y")
            },
            lineWidth:1
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat:'<b>耗时：</b><b>{point.y}</b>',
        },
        series: dataJ
    });
}