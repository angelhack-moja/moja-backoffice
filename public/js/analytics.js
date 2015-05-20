define(function () {

    var Backbone = require('backbone');
    var _ = require('underscore');

//    var challengeTemplate = require('text!/js/tpl/challenge-view.html');
    var pagetpl = require('text!/js/tpl/analytics.html');

    var PageView = Backbone.Marionette.ItemView.extend({
        template: _.template(pagetpl),
        
        ui: {
            "pie": "#graph-pie > canvas",
            "bars": "#graph-bars > canvas",
            "star": "#graph-star > canvas"
        }
        , events: {
            
            "click .save": "doSave",
            
        }
        
        , initialize: function() {
            
        }
        
        , onDomRefresh: function() {
            
            this.renderGraphs();
            
        }
        
        , renderGraphs: function() {
            
            
            var Chartjs = require('chartjs');
            
            
            var addPie = function(ctx) {

                var data = [
                    {
                        value: 460,
                        color: "#46BFBD",
                        highlight: "#5AD3D1",                        
                        label: "New users"
                    },
                    {
                        value: 50,
                        color:"#F7464A",
                        highlight: "#FF5A5E",                        
                        label: "Opt-out users"
                    },
                    {
                        value: 30,
                        color: "#FDB45C",
                        highlight: "#FFC870",
                        label: "Inactive"
                    }
                ]

                new Chart(ctx).Doughnut(data, {
                    animateScale: true
                });                
            
            };
            
            var addBars = function(ctx) {

                var data = {
                    labels: ["January", "February", "March", "April", "May"],
                    datasets: [
                        {
                            label: "Overall users",
                            fillColor: "rgba(220,220,220,0.5)",
                            strokeColor: "rgba(220,220,220,0.8)",
                            highlightFill: "rgba(220,220,220,0.75)",
                            highlightStroke: "rgba(220,220,220,1)",
                            data: [65, 59, 80, 81, 56]
                        },
                        {
                            label: "Average completion",
                            fillColor: "rgba(151,187,205,0.5)",
                            strokeColor: "rgba(151,187,205,0.8)",
                            highlightFill: "rgba(151,187,205,0.75)",
                            highlightStroke: "rgba(151,187,205,1)",
                            data: [28, 48, 40, 19, 86]
                        }
                    ]
                };
                
                new Chart(ctx).Bar(data, {
                    barShowStroke: false
                });
                
            };
            
            var addStar = function(ctx){
            
                var options = {};
            
                var data = {
                    labels: [
                        "Soccer", "Tennis", 
                        "Swimming", "Golf", 
                        "Skiing", "Hiking", 
                        "Running"
                    ],
                    datasets: [
                        {
                            label: "My First dataset",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: [65, 59, 90, 81, 56, 55, 70]
                        },
                        {
                            label: "My Second dataset",
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: [28, 48, 60, 35, 96, 27, 100]
                        }
                    ]
                };
                
                
                new Chart(ctx).Radar(data, {
                    pointDot: false
                });

            };

            var ctxbar = this.ui.bars[0].getContext("2d");
            addBars(ctxbar);
            
            var ctxpie = this.ui.pie[0].getContext("2d");            
            addPie(ctxpie);
            
            var ctxstar = this.ui.star[0].getContext("2d");                        
            addStar(ctxstar);
            
        }
        
    });
    
    return PageView;
});