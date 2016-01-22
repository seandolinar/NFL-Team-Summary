 	d3.selection.prototype.moveToFront = function() {
	  return this.each(function(){
	    this.parentNode.appendChild(this);
	  });
	};

 	var colorKey = {'passing_net_yards':'#1f78b4','rushing_net_yards':'orange','special_team_yards':'#606060', //'#90c070'
 		'interception_return_yards': 'purple', 'penalty_yards': 'brown'}
 	var teamKey = {'nfl_den': 'Broncos', 'nfl_ne': 'Patriots', 'nfl_ari': 'Cardinals', 'nfl_car': 'Panthers'}
 	var data = {};
 	var graph = 'gbg'
 	var flip = 1;
 	var chart, plotL, plotR, margin, width, height;
	var size = 4
	var multiplier = 1
	var byeObject = {}
	var weekSize = '25px'
	var weekFl = false
	var recordObj = {}
	var wl = {win: 'black', loss: 'white'}
   	var wlFont = {win: 'white', loss: 'black'}

   	var teamL = 'nfl_ne'
   	var teamR = 'nfl_den'

   	$('.legend-pass').css('background-color', colorKey['passing_net_yards'])
   	$('.legend-rush').css('background-color', colorKey['rushing_net_yards'])
   	$('.legend-spec').css('background-color', colorKey['special_team_yards'])

	function buildChart(){


		var order = ['passing_net_yards', 'rushing_net_yards', 'special_team_yards', 'penalty_yards']

		function sortOrder(a,b) {

      		return order.indexOf( a.key ) > order.indexOf( b.key );
		}


		d3.selectAll('svg').remove()
		d3.select('#d3-container').append('svg').attr('class','chart')

		windowWidth = document.getElementById("d3-container").clientWidth;
		plotWidth = 121
		margin = {top: 120, right: 0, bottom: 90, left: 10, middle: 68}
		if (windowWidth >= 400) {
			margin.middle = 125
			weekFl = true
			$('#viz-title').css('font-size', '26px')
		}
		else {
			$('#viz-title').css('font-size', '20px')
			weekFl = false
		}

		marginAllot = windowWidth - plotWidth*2 - margin.middle
		margin.left = margin.right = Math.max(marginAllot/2,0)

		
		width = Math.min(Math.max(308, windowWidth),600)
		height = Math.min(700) - margin.top - margin.bottom

		// d3.select('#viz-title').html('NFL Build').style('padding-left', (margin.left - margin.left/3) + 'px')
		console.log(margin.left)
		chart = d3.select(".chart")
        	.attr("width", width)// + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
    }

    function buildPlot(teamL, teamR) {

    	d3.selectAll('.plot').remove()

    	plot = chart.append('g')
    		.attr('class', 'plot')
    		.attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")


    	plotL = plot.append('g')
    		.attr('class','plot ' + teamL)
    		//.attr("transform", "translate(" + (margin.left-margin.middle/4) + "," + margin.top + ")")
    		.append('g')
    		.attr('class', 'waffle-' + teamL)

     	var teamName = plotL.append('text')
     		.attr('y', -70)
     		.attr('x', plotWidth-10)
     		.attr('text-anchor', 'end')
     		.text(teamKey[teamL])

     	plotL.append('text')
     		.attr('y', -50)
     		.attr('x', plotWidth-15)
     		.attr('text-anchor', 'end')
     		.text(recordObj[teamL])

     	 plotL.append('text')
     		.attr('y', -10)
     		.attr('x', plotWidth)
     		.attr('text-anchor', 'end')
     		.text('Yds')

     	plotL.append('text')
     		.attr('y', -10)
     		.attr('x', plotWidth+ 20)
     		.attr('text-anchor', 'middle')
     		.text('Pts')

     	if (weekFl) {
	     	plotL.append('text')
	     		.attr('y', -10)
	     		.attr('x', plotWidth+ margin.middle/2)
	     		.attr('text-anchor', 'middle')
	     		.text('Wk')
     	}


    	plotR = plot.append('g')
    		.attr('class','plot ' + teamR)
    		.attr("transform", "translate(" + (plotWidth + margin.middle) + "," + 0 + ")");

		plotR.append('text')
			.attr('y', -70)
			.attr('x', 10)
			.text(teamKey[teamR])

		plotR.append('text')
     		.attr('y', -50)
     		.attr('x', 15)
     		.text(recordObj[teamR])

     	plotR.append('text')
     		.attr('y', -10)
     		.attr('x', -18)
     		.attr('text-anchor', 'middle')
     		.text('Pts')


     	plotR.append('text')
     		.attr('y', -10)
     		.attr('x', 0)
     		.attr('text-anchor', 'start')
     		.text('Yds')
    }


    function buildSeries(teamL, teamR, anim) {

    	d3Data = data[teamL].reverse()
    	$('.block').text('1 block = 5 yds')

    	//left graph
       	var unit = plotL.selectAll('new')
        	.data(d3Data)
        	.enter()
        	.append('g')
        	.attr("transform", function(d,i) {

        		return "translate(" + 0 + "," + (18-d.week) * 30*multiplier + ")";
        	})
        	.attr('class', function(d,i) {return i})

       	if (weekFl) {

	       	var week = plotL.selectAll('new')
	        	.data([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,'Div'])
	        	.enter()
	        	.append('text')
	        	.attr("transform", function(d,i) {

	        		return "translate(" + 0+ "," + (18-i-1) * 30*multiplier + ")";
	        	})
	        	.attr('fill', '#D5D5D5')
	        	.attr('y', '20')
	        	.attr('x', plotWidth + margin.middle/2)
	        	.attr('text-anchor', 'middle')
	        	.style('font-size', function() {
	        		if (document.getElementById("d3-container").clientWidth <= 400) {
	        			return '16px';
	        		}
	        		else {
	        			return '25px'
	        		}
	        	})
	        	.text(function(d,i) {return d}) //add in playoff thing fix the bye week thing
       	}
       	else {
       		plotL.append('text')
       			.attr('x', plotWidth + margin.middle/2)
       			.attr('y', '45')
       			.attr("transform", "translate(" + 0+ "," + (18-0-1) * 30*multiplier + ")")
	        	.attr('text-anchor', 'middle')
	        	.style('font-size', function() {
	        		if (document.getElementById("d3-container").clientWidth <= 400) {
	        			return '16px';
	        		}
	        	})
	        	.attr('fill', '#A5A5A5')
	        	.text('Wk 1')

	        plotL.append('text')
       			.attr('x', plotWidth + margin.middle/2)
       			.attr('y', '0')
       			.attr("transform", "translate(" + 0+ "," + (18-18-1) * 30*multiplier + ")")
	        	.attr('text-anchor', 'middle')
	        	.style('font-size', function() {
	        		if (document.getElementById("d3-container").clientWidth <= 400) {
	        			return '16px';
	        		}
	        	})
	        	.attr('fill', '#A5A5A5')
	        	.text('Div Ply')
       	}


        var bye = plotL.append('text')
        	.attr('text-anchor', 'end')
        	.attr('transform', "translate(" + plotWidth + "," + (((18-byeObject[teamL]) * 30*multiplier) + 15) + ")")
        	.attr('fill', '#D5D5D5')
        	.attr('font-size', '20px')
        	.text('bye')


        unit.append('rect')
        	.attr('fill', function(d) {
        		return wl[d.team_outcome]
        	})
        	.attr('stroke', 'black')
        	.attr('stroke-width', '1px')
        	.attr('height',25)
        	.attr('width', 25)
        	.attr('y', '0')
        	.attr('x', plotWidth + 10)
        	.text(function(d,i) {return wl[d.team_outcome];})

        unit.append('text')
        	.attr('fill', function(d) {
    			return wlFont[d.team_outcome]
    		})
        	.attr('y', '18')
        	.attr('x', plotWidth + 30)
        	.attr('text-anchor', 'end')
        	.text(function(d,i) {return d.points_off;})

		     
		var waffle = unit.selectAll('g')
        	.data(function(d) {return d.waffle_array;})
        	.enter()
        	.append('rect')
        	.attr('y', function(d,i) { return (i%5) * (size+1) * multiplier })
        	.attr('x', function(d,i) { return ( plotWidth - Math.trunc(i/5) * (size+1) * multiplier)})


        	if (anim === true){
        		waffle.attr('width', 0)
		        	.attr('height', size * multiplier)
		        	.attr('fill', function(d) {
		        		return colorKey[d]
		        	})
		        	.transition() //transition onx
		        	.duration(20)
		    		.delay(function(d, i) { return i * 4; })
		    		.attr('width', size*multiplier)
        	}
        	else {
        		waffle.attr('width', size*multiplier)
		        	.attr('height', size*multiplier)
		        	.attr('fill', function(d) {
		        		return colorKey[d]
		        	})
        	}


    	unit.append('rect')
        	.attr('fill', 'white')
        	.attr('fill-opacity', 0)
        	.attr('height', (size+1)*5 +4 +'px')
        	.attr('y', '-2px')
        	.attr('x', function(d) {
        		return plotWidth - (d.passing_net_yards + d.rushing_net_yards + d.special_team_yards)/5
        	})
        	.attr('width', function(d) {
        		return (d.passing_net_yards + d.rushing_net_yards + d.special_team_yards)/5+5
        	})
        	.attr('class', 'interactive-test')


    	//right graph//
    	d3Data = data[teamR].reverse()
    	var unit = plotR.selectAll('new')
        	.data(d3Data)
        	.enter()
        	.append('g')
        	.attr("transform", function(d,i) {

        		return "translate(" + 0 + "," + (18-d.week) * 30*multiplier + ")";
        	})
		     
		var waffle = unit.selectAll('g')
        	.data(function(d) {return d.waffle_array;})
        	.enter()
        	.append('rect')
        	.attr('fill','orange')
        	.attr('y', function(d,i) { return (i%5) * (size+1) * multiplier })
        	.attr('x', function(d,i) { return  (Math.trunc(i/5) * (size+1) * multiplier)})

        if (anim === true) {
       		waffle.attr('width', 0)
	        	.attr('height', size * multiplier)
	        	.attr('fill', function(d) {
	        		return colorKey[d]
	        	})
	        	.transition() //transition onx
	        	.duration(20)
	    		.delay(function(d, i) { return i * 4; })
	    		.attr('width', size*multiplier)
    	}
    	else {
	       	waffle.attr('width', size*multiplier)
	        	.attr('height', size*multiplier)
	        	.attr('fill', function(d) {
	        		return colorKey[d]
	        	})
    	}


        unit.append('rect')
        	.attr('fill', function(d) {
        		return wl[d.team_outcome]
        	})
        	.attr('stroke', 'black')
        	.attr('stroke-width', '1px')
        	.attr('height',25)
        	.attr('width', 25)
        	.attr('y', '0')
        	.attr('x', -30)
        	.text(function(d,i) {return wl[d.team_outcome];})

       	unit.append('text')
	        	.attr('fill', function(d) {
        			return wlFont[d.team_outcome]
        		})
	        	.attr('y', '18')
	        	.attr('x', -10)
	        	.attr('text-anchor', 'end')
	        	.text(function(d,i) {return d.points_off;})

	    plotR.append('text')
        	.attr('text-anchor', 'start')
        	.attr('transform', "translate(" + 0 + "," + (((18-byeObject[teamR]) * 30*multiplier) + 18) + ")")
        	.attr('fill', '#D5D5D5')
        	.attr('font-size', '20px')
        	.text('bye')

        unit.append('rect')
        	.attr('fill', 'white')
        	.attr('fill-opacity', 0)
        	.attr('height', (size+1)*5 +4 +'px')
        	.attr('y', '-2px')
        	.attr('width', function(d) {
        		return (d.passing_net_yards + d.rushing_net_yards + d.special_team_yards)/5+5
        	})
        	.attr('class', 'interactive-test')

		function tooltipOn(point) {

			//var cx = d3.select(point).attr('x')
			//var cy = d3.select(point).attr('y')
			var tooltipVertical = 1
			var tooltipBox = 0
			var tooltipRight = 1
			var tooltipBoost = 0
			var tooltipRot = 90
			var triangleDownL = ['-10', '(plotWidth - ((d.passing_net_yards + d.rushing_net_yards + d.special_team_yards)/5/tooltipVertical+5))']
			var triangleDownR = ['10', '-(((d.passing_net_yards + d.rushing_net_yards + d.special_team_yards)/5/tooltipVertical+10))']

			var tooltipArrayNum = [0,1]

			if (margin.left < 70) {
				tooltipVertical = 2
				tooltipRight = -1
				tooltipRot = 0
				tooltipArrayNum = [1,0]
				tooltipBox = 45
				tooltipBoost = 75
			}

			var value = d3.select(point)[0]//.datum()
			var pass = d3.select(point).datum().passing_net_yards
			var rush = d3.select(point).datum().rushing_net_yards
			var spec = d3.select(point).datum().special_team_yards
			var total = pass + rush + spec

			tool_tip = d3.select(point)
				.append('g')
				.attr('class','tool-tip-text')

			tool_tip.append('g')
	        	.append("path")
	        	.attr('transform', function(d) {

	        		if (d.team_name == teamKey[teamL]) {

	        			return "rotate(" + -1 * tooltipRot + ") translate(" + eval(triangleDownL[tooltipArrayNum[0]]) + "," + eval(triangleDownL[tooltipArrayNum[1]]) + ")"
	        		
	        		}
	        		else {
	        			return "rotate(" + tooltipRot + ") translate(" + tooltipRight * eval(triangleDownR[tooltipArrayNum[0]]) + "," + tooltipRight *  eval(triangleDownR[tooltipArrayNum[1]]) + ")"	
	        		}
	            })
				.attr("class", "tool-tip-text")
				.attr("d", d3.svg.symbol().type("triangle-down"))
				.attr('fill','#303030')
				.attr('stroke', '#303030')

	        toolTipRect = tool_tip
	        	.append('rect')
	        	.attr('fill','#f0eee8')
	        	.attr('fill-opacity', .95)
	        	.attr('stroke', '#505050')
	            .attr('x', function(d) {
	            	if (d.team_name == teamKey[teamL]) {
	            		return plotWidth - (d.passing_net_yards + d.rushing_net_yards + d.special_team_yards)/5/tooltipVertical-0-100 + tooltipBox
	        		}
	        		else {
	        			return (d.passing_net_yards + d.rushing_net_yards + d.special_team_yards)/5/tooltipVertical+15 - tooltipBox

	        		}
	            })
	            .attr('y', -40 - tooltipBoost)
	            .attr('width', 90)
	            .attr('height',100)
	            .attr('rx','5px')


	        var tooltipObj = {total: "TOTAL: ", pass: "PASS:", rush: "RUSH: ", spec:"SPEC: "}

	        tx = tool_tip.append('g')
	            .attr('class', 'tool-tip-text')
	            .attr('opacity',1)
	            .attr('fill','black')
	           	.attr('transform', function(d) {
	            	if (d.team_name == teamKey[teamL]) {
	            		return 'translate(' + (plotWidth - (d.passing_net_yards + d.rushing_net_yards + d.special_team_yards)/5/tooltipVertical- 115 + tooltipBox) +', ' + (-1 - tooltipBoost) +')'
	        		}
	        		else {
	        			return 'translate(' + ((d.passing_net_yards + d.rushing_net_yards + d.special_team_yards)/5/tooltipVertical + 0 - tooltipBox) +', '+ (-1 -tooltipBoost)  + ')'
	        		}
	            })

	        tx.append('text')
				.attr('text-anchor', 'middle')
	            .attr('x', '62px')
	            .attr('y', -20 + 'px')
	            .text(function(d) {

	            	var topLine = d.team_outcome[0].toUpperCase()
	            	topLine += d.home ? ' vs ' : ' at '
	            	topLine +=  d.oppenent_name

	            	return topLine
	            })

	        $.each(['total','pass','rush','spec'], function(index, e) {
		            
		        tx.append('text')
		           	.attr('text-anchor', 'start')
		            .attr('x', '25px')
		            .text(tooltipObj[e])
		            .attr('y', 18*index + 'px')

		        tx.append('text')
		            .attr('text-anchor', 'end')
		            .attr('x', '97px')
		            .attr('y', 18*index + 'px')
		            .text(eval(e))
	        })

		}
		function tooltipOff() {
			d3.selectAll('.tool-tip-text').remove()
		}



        $('.interactive-test').mouseenter(function() {
        	var sel = d3.select(this.parentNode);
  			sel.moveToFront();
        	tooltipOn(this.parentNode)
        }).mouseleave(function() {
        		tooltipOff()
			})
    }

    function buildTeams(teamL, teamR, anim) {

    	$('.block').text('1 block = 10 yds')

    	// margin.top = 0
    	var size = 7
    	var dataTeam = {}


		function sumYards(team) {
			dataTeam = {}
			$.each(['passing_net_yards', 'rushing_net_yards', 'special_team_yards'], function(index, e) {

    		sum = data[team].reduce(function(pv,cv) {
    		 	return pv + cv[e]; }, 0)
 
    		dataTeam[e] = sum
			})

			dataTeam['waffle_array'] = $.map(dataTeam, function(d, index) {

	 		retArray = []
	 		for (i=0; i<d/10; i++) {
	 			retArray.push(index)
	 		}
	 		return retArray
		})
		}


		sumYards(teamL)
    	plotL.selectAll('*').remove()

		var waffle = plotL.selectAll('new')
        	.data(dataTeam.waffle_array)
        	.enter()
        	.append('rect')
        	.attr('fill','orange')
        	.attr('x', function(d,i) { return plotWidth - (i%10) * (size+1) * multiplier })
        	.attr('y', function(d,i) { return 525-( Math.trunc(i/10) * (size+1) * multiplier)})


        if (anim === true) {

        	waffle.attr('width', 0)
	        	.attr('height', size * multiplier)
	        	.attr('fill', function(d) {
	        		return colorKey[d]
	        	})        	
	        	.transition() //transition onx
	        	.duration(20)
	    		.delay(function(d, i) { return i * .8; })
	    		.attr('width', size*multiplier)
    	}
    	else {
    		waffle.attr('width', size*multiplier)
	        	.attr('height', size * multiplier)
	        	.attr('fill', function(d) {
	        		return colorKey[d]
	        	})        	
    	}

    	var bye = plotL.append('text')


    	labels = plotL.selectAll('new')
        	.data([dataTeam])
        	.enter()

        labels.append('text')
        	.attr('y', function(d,i) {
        		return 525-(d.passing_net_yards/100*(size+1)) + 16
        	})
        	.attr('x', plotWidth-80)
        	.attr('text-anchor', 'end')
        	.text(function(d,i) {
        		return d.passing_net_yards
        	})

        labels.append('text')
        	.attr('y', function(d,i) {
        		return (525-(d.passing_net_yards/100*(size+1)) - (d.rushing_net_yards/100*(size+1)) + 16)
        	})
        	.attr('x', plotWidth-80)
        	.attr('text-anchor', 'end')
        	.text(function(d,i) {
        		return d.rushing_net_yards
        	})

        labels.append('text')
        	.attr('y', function(d,i) {
        		return (525-(d.passing_net_yards/100*(size+1)) - (d.rushing_net_yards/100*(size+1)) - (d.special_team_yards/100*(size+1)) + 16)
        	})
        	.attr('x', plotWidth-80)
        	.attr('text-anchor', 'end')
        	.text(function(d,i) {
        		return d.special_team_yards
        	})

        var teamName= plotL.append('text')
     		.attr('y', 525 + 30)
     		.attr('x', plotWidth-68/2)
     		.attr('text-anchor', 'middle')
     		.text(teamKey[teamL])

     	var teamName= labels.append('text')
     		.attr('y', function(d) {
     			return (525-(d.passing_net_yards/100*(size+1)) - (d.rushing_net_yards/100*(size+1)) - (d.special_team_yards/100*(size+1)) + 16/100*(size+1)) -30
     		})
     		.attr('x', plotWidth-68/2)
     		.attr('text-anchor', 'middle')
     		.style('font-size', '30px')
     		.text(function(d) {
     			return d.passing_net_yards + d.rushing_net_yards + d.special_team_yards + ' yds'
     		})



        sumYards(teamR)
        plotR.selectAll('*').remove()

       	var waffle = plotR.append('g').selectAll('new')
        	.data(dataTeam.waffle_array)
        	.enter()
        	.append('rect')
        	.attr('fill','orange')
        	.attr('x', function(d,i) { return (i%10) * (size+1) * multiplier })
        	.attr('y', function(d,i) { return 525-( Math.trunc(i/10) * (size+1) * multiplier)})

        if (anim === true) {
        	waffle.attr('width', 0)
	        	.attr('height', size * multiplier)
	        	.attr('fill', function(d) {
	        		return colorKey[d]
	        	})
	        	.transition() //transition onx
	        	.duration(10)
	    		.delay(function(d, i) { return i * .8; })
	    		.attr('width', size*multiplier)
        }
        else {
        	waffle.attr('width', size*multiplier)
	        	.attr('height', size * multiplier)
	        	.attr('fill', function(d) {
	        		return colorKey[d]
	        	})
        }



        labels = plotR.selectAll('new')
        	.data([dataTeam])
        	.enter()

        labels.append('text')
        	.attr('y', function(d,i) {
        		return 525-(d.passing_net_yards/100*(size+1)) + 16
        	})
        	.attr('x', -7)
        	.attr('text-anchor', 'end')
        	.text(function(d,i) {
        		return d.passing_net_yards
        	})

        labels.append('text')
        	.attr('y', function(d,i) {
        		return (525-(d.passing_net_yards/100*(size+1)) - (d.rushing_net_yards/100*(size+1)) + 16)
        	})
        	.attr('x', -7)
        	.attr('text-anchor', 'end')
        	.text(function(d,i) {
        		return d.rushing_net_yards
        	})

        labels.append('text')
        	.attr('y', function(d,i) {
        		return (525-(d.passing_net_yards/100*(size+1)) - (d.rushing_net_yards/100*(size+1)) - (d.special_team_yards/100*(size+1)) + 16)
        	})
        	.attr('x', -7)
        	.attr('text-anchor', 'end')
        	.text(function(d,i) {
        		return d.special_team_yards
        	})

       	labels.append('text')
     		.attr('y', function(d) {
     			return (525-(d.passing_net_yards/100*(size+1)) - (d.rushing_net_yards/100*(size+1)) - (d.special_team_yards/100*(size+1)) + 16/100*(size+1)) -30
     		})
     		.attr('x', 78/2)
     		.attr('text-anchor', 'middle')
     		.style('font-size', '30px')
     		.text(function(d) {
     			return d.passing_net_yards + d.rushing_net_yards + d.special_team_yards + ' yds'
     		})

        var teamName= plotR.append('text')
     		.attr('y', 525 + 30)
     		.attr('x', 78/2)
     		.attr('text-anchor', 'middle')
     		.text(teamKey[teamR])

    }
	

	function joinJSON(array, property, value) {
		var retObj;
		$.each(array, function(index, e) {
			if (e[property] == value) {
				retObj = e;
			}
		})
		return retObj;
	}



	var dataPull = function() {

		d3.json("data.json", function(jsonArray) {

			console.log(jsonArray)

			$.each(jsonArray, function(index, teamArray) {

				var dataTeam = []

				$.each(teamArray, function(index, interval) {

					$.each(interval.team_game_logs, function(index, json) {

				  		var game = { }

				  		game.passing_net_yards = json.passing_net_yards
					   	game.rushing_net_yards = json.rushing_net_yards
					   	game.special_team_yards = json.punt_return_yards + (json.kick_return_yards || 0)

					   	game['waffle_array'] = $.map(game, function(d, index) {

					 		retArray = []
					 		for (i=0; i<d/5; i++) {
					 			retArray.push(index)
					 		}
					 		return retArray
					 	})

					   	var join = joinJSON(interval.games, 'id', json.game_id)
					   	var week = join.interval_number

					   	var oppenent = joinJSON(interval.opponents, 'id', json.opponent_id)



					   	game.week = week.length > 0 ? parseInt(week) : 18
					   	game.team_name = interval.teams[0].nickname
					 	game.team_outcome = json.team_outcome
				  		game.team_score = json.team_score
				  		game.oppenent_name = oppenent.nickname
				  		game.home = join.home_team_id === json.team_id ? true : false
				  		game.passing_touchdowns = json.passing_touchdowns || 0
				  		game.rushing_touchdowns = json.rushing_touchdowns || 0
				  		game.kick_return_touchdowns = json.kick_return_touchdowns || 0
				  		game.field_goals_succeeded = json.field_goals_succeeded || 0
				  		game.points_off = 7*(game.passing_touchdowns + game.rushing_touchdowns + game.kick_return_touchdowns) + 3 * game.field_goals_succeeded

					   	dataTeam.push(game)

					})



				})

				function sortGames(a,b) {

		      		return a.week - b.week;
				}

				dataTeam = dataTeam.sort(sortGames)

				weekArray = $.map(dataTeam, function(d, index) {
						return d.week
				})

				winArray = $.map(dataTeam, function(d, index) {
					if (d.team_outcome === 'win') {
						return d.team_outcome
					};		
				})
				var win = winArray.length
				var loss = weekArray.length - winArray.length

				var byeWeek = 0;
				for(var i = 1; i < weekArray.length; i++) {
				    if(weekArray[i] - weekArray[i-1] != 1) {				
				    	byeWeek = weekArray[i]-1
				    }
				}

				data[index] = dataTeam;
				byeObject[index] = byeWeek
				recordObj[index] = '(' + win + ' - ' + loss + ')'
			})
			console.log(data)
			buildPlot(teamL, teamR)
			buildSeries(teamL, teamR, true)

		$('#button-season').click(function() {

			$('.type').css('background-color','')
			$(this).css('background-color','#00abc6')
			graph = 'season'
			buildTeams(teamL, teamR, true)
		})

		$('#button-gbg').click(function() {

			$('.type').css('background-color','')
			$(this).css('background-color','#00abc6')
			graph = 'gbg'
			buildPlot(teamL, teamR)
			buildSeries(teamL, teamR, true)
		})

		$('#button-den').click(function() {

			$('.team').css('background-color','')
			$(this).css('background-color','#00abc6')
			teamL = 'nfl_ne'
			teamR = 'nfl_den'

			rebuild(true)
		})

		$('#button-car').click(function() {

			$('.team').css('background-color','')
			$(this).css('background-color','#00abc6')
			teamL = 'nfl_ari'
			teamR = 'nfl_car'

			rebuild(true)
		})

			})
	}


	function main() {
		$('#button-den').css('background-color','#00abc6')
		$('#button-gbg').css('background-color','#00abc6')

		buildChart()
		dataPull()
	}

	function rebuild(anim) {

		if (graph === 'gbg') {
			buildChart()
			buildPlot(teamL,teamR)
			buildSeries(teamL,teamR, anim)
		}
		else {
			buildChart()
			buildPlot(teamL,teamR)
			buildTeams(teamL, teamR, anim)
		}
	}


	$( window ).resize(function() { 

		rebuild(false)
	});






	main()
