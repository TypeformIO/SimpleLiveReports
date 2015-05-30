var chart = null;
var uid = location.pathname.split('/')[2];

function requestData() {
  $.ajax({
        method: 'GET',
        url: 'http://'+location.host+'/results/' + uid,
        success: function(answers) {
          var old_answers_array = chart.series[0].data;
          var new_answers_array = [['IE', 100], ['Chrome', 0]];

					var answers = JSON.parse(answers);

					var answers_map = {};

					var answers_map = _.countBy(answers.answers, function(answer) {
						return answer.data.value
					});

					var answers_array = [];
					_.each(answers_map, function(item, key) {
						var new_array = [key, item];
						answers_array.push(new_array);
					});
        
          //setTimeout(function() {
					chart.series[0].setData(answers_array);            
          //}, 2000);
					setTimeout(requestData, 500);    
        },
				error: function() {
					setTimeout(requestData, 1000);    
				},
        cache: false
    });
}

    $(document).ready(function () {
        chart = new Highcharts.Chart({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                renderTo: 'container',
              events: {
                load: requestData
            }
            },
            title: {
                text: 'Answers to ' + uid
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: 'Percentage of answers',
                data: [
                    //['Firefox',   63],
                    //['IE',       37]
                ]
            }]
        });
    });
