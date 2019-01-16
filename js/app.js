/**
 * https://www.w3schools.com/colors/colors_crayola.asp
 */


$(() =>
{
    let myChart = echarts.init(document.getElementById('chart'));

    let data = [];

    //generate data
    for (let i = 0; i < 3000; i++)
    {
        let value = Number((Math.random() * 100).toFixed(2));
        let date = moment().add(i, 'd');
        let item = {
            value: value,
            date: date.format('YYYY-MM-DD'),
            l: value - Number((Math.random() * 40).toFixed(2)),
            u: value + Number((Math.random() * 20).toFixed(2))
        };

        data.push(item);
    }

    let base = -data.reduce(function (min, val)
    {
        return Math.floor(Math.min(min, val.l));
    }, Infinity);

// specify chart configuration item and data
    let option = {
        title: {
            text: 'Sensors data',
            subtext: 'Random data powered graph with min, max and average',
            left: 'center'
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: true,
                label: {
                    backgroundColor: '#ccc',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    textStyle: {
                        color: '#222'
                    }
                }
            },
            formatter: function (params)
            {
                return params[2].name + '<br />' + params[2].value;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.map(function (item)
            {
                return item.date;
            }),
            axisLine: {onZero: false},
            axisLabel: {
                formatter: function (value, idx)
                {
                    let date = new Date(value);
                    //return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                    return value;
                }
            },
            splitLine: {
                show: false
            },
            boundaryGap: false
        },
        yAxis: {
            axisLabel: {
                formatter: function (val)
                {
                    //return (val - base) * 100 + '%';
                    return val;
                }
            },
            axisPointer: {
                label: {
                    formatter: function (params)
                    {
                        return ((params.value - base) * 100).toFixed(1) + '%';
                    }
                }
            },
            splitNumber: 3,
            splitLine: {
                show: false
            }
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 65,
                end: 85
            },
            {
                type: 'inside',
                realtime: true,
                start: 65,
                end: 85
            }
        ],
        series: [{
            name: 'L',
            type: 'line',
            data: data.map(function (item)
            {
                return item.l + base;
            }),
            lineStyle: {
                normal: {
                    opacity: 0
                }
            },
            stack: 'confidence-band',
            symbol: 'none'
        }, {
            name: 'U',
            type: 'line',
            data: data.map(function (item)
            {
                return item.u - item.l;
            }),
            lineStyle: {
                normal: {
                    opacity: 0
                }
            },
            areaStyle: {
                normal: {
                    color: '#AAF0D1'
                }
            },
            stack: 'confidence-band',
            symbol: 'none'
        }, {
            type: 'line',
            data: data.map(function (item)
            {
                return item.value + base;
            }),
            hoverAnimation: true,
            symbolSize: 6,
            itemStyle: {
                normal: {
                    color: '#50BFE6'
                }
            },
            showSymbol: false
        }]
    };

// use configuration item and data specified to show chart
    myChart.setOption(option);
});

