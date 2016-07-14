var paused = [];//holds all the paused strokes

var stoped = true;//indicates the timeController status

var distancePassed = 0//holds the distance that the play button did on Y Axis
var timersData = [];






function start() {
    for (var i = 0; i < timersData.length; i++) {
        d3.select("#" + timersData[i].id + 0 + 0)
        .style("animation-play-state", "running");
    }

}

//Here we organize the chain reaction of each process
function popCircle(element, idName, index, radius, nextId) {
    return function() {

        d3.select("#" + idName + index + index)//selecting next line
        .style("animation-play-state", "unset");
        d3.select("#" + idName + index + index + index)//selecting current circle
    .style("filter", function(){return "url(#" + idName + index + ")"}).transition()//changing circle hover transition
    .duration(100).attr("r",  function(){return Math.floor(radius*1.7)})
        if (!nextId) {
            var next = index + 1;
            d3.select("#" + idName + next + next)//start animate the next line
            .style("animation-play-state", "running")
        }
    }
}



//
//    draw2: function(id, events, options) {
//        var cfg = {
//		width: 600,
//		height: 200,
//
//		radius: 10,
//		lineWidth: 4,
//		color: "#999",
//		background: "#FFF",
//		dateFormat: "%Y/%m/%d %H:%M:%S",
//		horizontalLayout: true,
//		showLabels: false,
//		addNow: false,
//		seriesColor: d3.scale.category20(),
//		dateDimension: false
//	 };
//
//
//	 //default configuration overrid
//	 if(options != undefined){
//		for(var i in options){
//		  cfg[i] = options[i];
//		}
//	 }
//	 if(cfg.addNow != false){
//		events.push({date: new Date(), name: cfg.addNowLabel || "Today"});
//	 }
//	 var svg = d3.select(id).select("svg");
//	 //Calculate value in terms of timestamps
//    var timestamps = events.map(function(d){return  d.value});
//    var maxValue = d3.max(timestamps);
//    var minValue = d3.min(timestamps);
//
//	 var margin = (d3.max(events.map(function(d){return d.radius})) || cfg.radius)*1.5+cfg.lineWidth;
//	 var step = (cfg.height-2*margin)/maxValue;
//	 var series = [];
//	 if(maxValue == minValue){step = 0;if(cfg.horizontalLayout){margin=cfg.width/2}else{margin=cfg.height/2}}
//
//	 linePrevious = {//the position of the circles
//		x1 : null,
//		x2 : null,
//		y1 : null,
//		y2 : null
//	 }
//
//
//	 svg.selectAll("circle")
//     .each(function(d, i) {
//         d3.select(this)
//         .style("filter", function(){return "url(#" + d.class + ")"}).transition()//changing circle hover transition
//		.duration(100).attr("r",  function(){return Math.floor(cfg.radius*1.7)})
//         .style("z-index", 999);
//     });
//
//
//
//
//    }

var timeKnots = {
   makeTimeController: function(id, data, options) {
    var svg = d3.select(id).append('svg').attr("width", options.width).attr("height", options.height);
    var margin = options.radius * 1.5;

    svg.append("line")
    .attr("id", options.id + 0)
    .attr("class", "timeline-line")
		.attr("x1", function(){
							 var ret = Math.floor(options.width/2)
							 ret
							 return ret
							 })
	 .attr("x2", function(){
							 return Math.floor(options.width/2)
							 })
	 .attr("y1", function(){
                            return margin;
                            })
	 .attr("y2", function(){
                            return options.height - margin;
							 })
	 .style("stroke", function(){
							 return options.color
                            })
     .style("stroke-width", 4);

    svg.append("filter")
    .attr("id",  options.id + 0 + 0)
      .append("feImage")
      .attr("xlink:href", "./playBtn.png")
      .attr("r", 17)
      .attr("preserveAspectRatio", "xMidYMid slice");

    var endPoint = options.height - margin;
    var step = (endPoint - margin)/(options.value*1000);

    var circle = svg.append("circle");
    circle.attr("id", options.id)
    .attr("class", "timeline-event")
    .style("filter", "url(#" + options.id + 0 + 0 + ")")
    .attr("cx", options.width/2)
    .attr("cy", margin)
    .attr("r", options.radius)
//    .attr("transform", "translate(20)")
//    .style("animation", "dash 2s linear forwards")
//    .attr("animation-duration", "running")
//    .on("click", function() {
//        stopAndResume(data);
//    })
//    .transition()
//    .duration(options.value*1000)
//    .ease("linear")
//    .attr("cy", endPoint)

    circle.on("click", function() {
        if (stoped) {//need to resume the timer
            var left = endPoint - distancePassed;
            console.log(left);
            console.log(Math.floor(left*step*1000));
            d3.select("#" + this.id)
            .transition().duration(Math.floor(left*step*1000))
            .ease("linear")
            .attr("cy", endPoint);
            timeKnots.stopAndResume();
            stoped = false;
        } else {//need to be stoped
            d3.select("#" + this.id)
            .transition().duration(0);
            distancePassed = this.cy.baseVal.valueAsString - margin;
            timeKnots.stopAndResume();
            stoped = true;
        }
    })
//    .append("animate")
//    .attr("attributeName", "cy")
//    .attr("from", margin)
//    .attr("to", options.height - margin)
//    .attr("dur", options.value)
//    .attr("begin", "click")
//    .attr("fill", "freeze")
//    .attr("animation-play-state", "paused")
},

draw: function(id, events, options){
	 var cfg = {
		width: 600,
		height: 200,
		radius: 10,
		lineWidth: 4,
		color: "#999",
        color2: "#123",
         class: "nothing",
		background: "#FFF",
		horizontalLayout: true,
		showLabels: false,
		addNow: false,
		dateDimension: false
	 };

    timersData.push({id: options.class, amount:  events.length});

    console.log(timersData);

	 //default configuration override
	 if(options != undefined){
		for(var i in options){

		  cfg[i] = options[i];
		}
	 }
	 if(cfg.addNow != false){
		events.push({date: new Date(), name: cfg.addNowLabel || "Today"});
	 }
	 var tip = d3.select(id)
	 .append('div')
	 .style("opacity", 0)
	 .style("position", "absolute")
	 .style("font-family", "Helvetica Neue")
	 .style("font-weight", "300")
	 .style("background","rgba(0,0,0,0.5)")
	 .style("color", "white")
	 .style("padding", "5px 10px 5px 10px")
	 .style("-moz-border-radius", "8px 8px")
	 .style("border-radius", "8px 8px");
	 var svg = d3.select(id).append('svg').attr("width", cfg.width).attr("height", cfg.height);
	 //Calculate value in terms of timestamps
    var timestamps = events.map(function(d){return  d.value});
    var maxValue = d3.max(timestamps);
    var minValue = 0;

	 var margin = (d3.max(events.map(function(d){return d.radius})) || cfg.radius)*1.5+cfg.lineWidth;
	 var step = (cfg.height-2*margin)/maxValue;
	 var series = [];
	 if(maxValue == minValue){step = 0;if(cfg.horizontalLayout){margin=cfg.width/2}else{margin=cfg.height/2}}

      var defs = svg.append("defs");
      defs.selectAll("filter")
      .data(events).enter().append("filter")
      .attr("id", function(d, i) {return cfg.class + i})
      .append("feImage")
      .attr("xlink:href", function(d) {
          return d.img;
      })
      .attr("r", 17)
      .attr("preserveAspectRatio", "xMidYMid slice");


	 linePrevious = {//the position of the circles
		x1 : null,
		x2 : null,
		y1 : null,
		y2 : null
	 }

	 svg.selectAll("line")
	 .data(events).enter().append("line")
	 .attr("class", "timeline-line")
		.attr("x1", function(d){
							 var ret = Math.floor(cfg.width/2)
							 linePrevious.x1 = ret
							 return ret
							 })
	 .attr("x2", function(d){
							 if (linePrevious.x1 != null){
								  return linePrevious.x1
							 }
							 return Math.floor(cfg.width/2)
							 })
	 .attr("y1", function(d, i){
         var datum;
         if (i == 0) {
             datum = 0;
         } else {
             datum = events[i-1].value;
         }

								var ret = Math.floor(step*(datum - minValue)) + margin
							 linePrevious.y1 = ret
							 return ret
							 })
	 .attr("y2", function(d, i){
//                            if (d.value == maxValue) {
//                                return cfg.height - margin;
//                            }
//                            else {
//                                var datum =  events[i].value;
//							 return Math.floor(step*(datum - minValue)) + margin
//                            }
                            var datum =  events[i].value;
							 return Math.floor(step*(datum - minValue)) + margin
							 })
	 .style("stroke", function(d){
							 if(d.color != undefined){
								return d.color
							 }
							 return cfg.color})
     .style("stroke-width", cfg.lineWidth)
     .style("z-index", -1);
//     .style("transition", "transform .1s ease-out")
//     .style("-webkit-transition", "-webkit-transform .6s ease-out")

           var y1, y2;
     for (var i = 0; i < events.length; i++) {
         svg.append("line")
         .attr("class", "timeline-line")
         .attr("id", cfg.class +i + i)
		.attr("x1", function(){
							 var ret = Math.floor(cfg.width/2)
							 linePrevious.x1 = ret
							 return ret
							 })
	 .attr("x2", function(){
							 if (linePrevious.x1 != null){
								  return linePrevious.x1
							 }
							 return Math.floor(cfg.width/2)
							 })
	 .attr("y1", function(){
             var datum;
             if (i == 0) {
                 datum = 0;
             } else {
                 datum = events[i - 1].value;
             }
								var ret = Math.floor(step*(datum - minValue)) + margin
							 linePrevious.y1 = ret
                             y1 = ret;
							 return ret
							 })
	 .attr("y2", function(){
                            var datum = events[i].value;
							 y2 = Math.floor(step*(datum - minValue))+ margin;
                            return y2;
							 })
    .style("stroke", function(){
         return cfg.color2})
         .style("z-index", -1)
        .style("stroke-width", cfg.lineWidth + 2 )
     .style("stroke-dasharray", y2 - y1)
     .style("stroke-dashoffset", y2 - y1)
     .style("animation", "dash " + events[i].value/2 + "s linear forwards")
         .style("animation-play-state", "paused");
     }


	 svg.selectAll("circle")
	 .data(events).enter()
	 .append("circle")
	 .attr("class", "timeline-event")
     .attr("id", function(d, i) {
         return cfg.class + i + i + i
     })
	 .attr("r", function(d){if(d.radius != undefined){return d.radius} return cfg.radius})
	 .style("stroke", function(d){
						  if(d.color != undefined){
							 return d.color
						  }
						  return cfg.color}
	 )
	 .style("stroke-width", function(d){if(d.lineWidth != undefined){return d.lineWidth} return cfg.lineWidth})
	 .style("fill", function(d){if(d.background != undefined){return d.background} return cfg.background})
     .style("z-index", -1)
	 .attr("cy", function(d, i){

		  var datum = d.value;
		  return Math.floor(step*(datum - minValue) + margin);
	 })
	 .attr("cx", function(d){
		  return Math.floor(cfg.width/2);
	 });

      var last = false;
      for (var i = 0; i < events.length; i++) {
          if (i+1 >= events.length) last = true;
          var elem = document.getElementById(cfg.class + i + i);
          elem.addEventListener("webkitAnimationEnd", popCircle(this, cfg.class, i, cfg.radius, last));
        }

  },

    stopAndResume: function() {//data holds an array of element id and amount
    if (timersData != undefined) {
        if (paused.length != 0) {//run all the paused ones and return
            var length = paused.length;
            for (var i = 0; i < length; i ++) {
                var elem = paused.pop();
                document.getElementById(elem).style.WebkitAnimationPlayState = "running";
            }
            return;
        }
        var someoneWasRunning = false;
        var size = timersData.length;
        for (var i = 0; i < size; i++) {
            var elementId = timersData[i].id;
            var amount = timersData[i].amount;
            for (var k = 0; k < amount; k++) {
                var elem = document.getElementById(elementId + k + k);
                var state = elem.style.WebkitAnimationPlayState;
                if (state == "running") {
                    someoneWasRunning = true;
                    elem.style.WebkitAnimationPlayState = "paused";
                    paused.push(elementId + k + k);
                    break;
                }
            }
        }
        if (!someoneWasRunning) {
            start();
        }
    }
}

}
