function drawProgress(data) {
    var percent = data;
    
    var pie=d3.layout.pie()
            .value(function(d){return d})
            .sort(null);
    
    var w=300,h=300;
    
    var outerRadius=(w/2)-10;
    var innerRadius=110;
    
    
    var arc=d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(0)
            .endAngle(2*Math.PI);
    
    //The circle is following this
    var arcDummy=d3.svg.arc()
            .innerRadius(125)
            .outerRadius(125)
            .startAngle(0);
    
    
    var arcLine=d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .cornerRadius(20)
            .startAngle(-0.1);
    
    var svg=d3.select("#chart")
            .append("svg")
            .attr({
                width:w,
                height:h,
                class:'shadow'
            }).append('g')
            .attr({
                transform:'translate('+w/2+','+h/2+')'
            });
    
    var defs = svg.append("svg:defs");
    
    var inset_shadow = defs.append("svg:filter")
            .attr("id", "inset-shadow");
    
    inset_shadow.append("svg:feOffset")
            .attr({
                dx:0,
                dy:0
            });
    
    inset_shadow.append("svg:feGaussianBlur")
            .attr({
                stdDeviation:3,
                result:'offset-blur'
            });
    
    inset_shadow.append("svg:feComposite")
            .attr({
                operator:'out',
                in:'SourceGraphic',
                in2:'offset-blur',
                result:'inverse'
            });
    
    inset_shadow.append("svg:feFlood")
            .attr({
                'flood-color':'black',
                'flood-opacity':.1,
                result:'color'
            });
    
    inset_shadow.append("svg:feComposite")
            .attr({
                operator:'in',
                in:'color',
                in2:'inverse',
                result:'shadow'
            });
    
    inset_shadow.append("svg:feComposite")
            .attr({
                operator:'over',
                in:'shadow',
                in2:'SourceGraphic'
            });
    
    var red_gradient = defs.append("svg:linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "50%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");
    
    red_gradient.append("svg:stop")
            .attr("offset", "50%")
            .attr("stop-color", "#40a6f8")
            .attr("stop-opacity", 1);
    
    red_gradient.append("svg:stop")
            .attr("offset", "100%")
            .attr("stop-color", "#1a70e7")
            .attr("stop-opacity", 1);
    
    
    //background
    var pathBackground=svg.append('path')
            .attr({
                d:arc
            })
            .style({
                fill:'#f4f3f8',
                stroke:'#e2e7eb',
                'stroke-width':1
            });
    
    
    var pathForeground=svg.append('path')
            .datum({endAngle:0})
            .attr({
                d:arcLine
            })
            .style({
                fill:'url(#gradient)',
                filter:'url(#inset-shadow)',
                stroke:'#3285fb',
                'stroke-width':1
            });
    //line Arc for Circle
    var pathDummy=svg.append('path')
            .datum({endAngle:0})
            .attr({
                d:arcDummy
            }).style({
                fill:'#A92602'
            });
    
    var endCircle=svg.append('circle')
            .attr({
                r:6,
                transform:'translate(0,'+ (-outerRadius+15) +')'
            })
            .style({
                stroke:'#0751b7',
                'stroke-width':1.5,
                'stroke-opacity':.5,
                opacity:0,
                fill:'#fff',
                filter:'url(#inset-shadow)'
            });
    
    var startCircle=svg.append('circle')
            .attr({
                r:6,
                transform:'translate(0,'+ (-outerRadius+16) +')'
            })
            .style({
                stroke:'#0751b7',
                'stroke-width':1.5,
                'stroke-opacity':.2,
                fill:'#fff',
                filter:'url(#inset-shadow)'
            })
            ;
    
    var middleTextCount=svg.append('text')
            .datum(0)
            .text(function(d){
                return d+'%';
            })
    
            .attr({
                class:'middleText',
                'text-anchor':'middle',
                dy:25,
                dx:0
            })
            .style({
                fill:'url(#gradient)',
                'font-size':'80px'
    
            });
    
    
    var arcTween=function(transition,percent,oldValue) {
        transition.attrTween("d", function (d) {
    
            var newAngle=(percent/100)*(2*Math.PI);
    
            var interpolateForeground = d3.interpolate(d.endAngle, newAngle);
    
            var interpolateText = d3.interpolate(oldValue, percent);
    
            return function (t) {
                d.endAngle = interpolateForeground(t);
    
                middleTextCount.text(Math.floor(interpolateText(t))+'%');
    
                return arcLine(d);
            };
        });
    };
    
    var arcTweenDummy=function(transition,percent) {
        transition.attrTween("d", function (d) {
    
            var newAngle=(percent/100)*(2*Math.PI);
    
            var interpolateCircle = d3.interpolate(d.endAngle, newAngle -.13);
    
            return function (t) {
                 d.endAngle= interpolateCircle(t);
                 var pathDummyCircle = arcDummy(d);
    
                 var coordinate = pathDummyCircle.split("L")[1].split("A")[0];
    
                 if(d.endAngle>.25 && d.endAngle < (2*Math.PI-.14))
                    endCircle.style('opacity',1);
                 else
                    endCircle.style('opacity',0);
    
                 endCircle.attr('transform', 'translate(' + coordinate+ ')');
    
                return pathDummyCircle;
            };
        });
    };
    
    var oldValue=0;
    
    var animate=function(){
        pathForeground.transition()
                .duration(750)
                .ease('cubic')
                .call(arcTween,percent,oldValue);
    
        pathDummy.transition()
                .duration(750)
                .ease('cubic')
                .call(arcTweenDummy,percent);
    
    
        oldValue=percent;
        percent=(Math.random() * 60) + 20;
        setTimeout(animate,3000);
    };
    
    setTimeout(animate,0);
}
