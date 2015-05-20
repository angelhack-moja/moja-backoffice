define(function () {

    var Backbone = require('backbone');
    var _ = require('underscore');

//    var challengeTemplate = require('text!/js/tpl/challenge-view.html');
    var pagetpl = require('text!/js/tpl/ratings.html');

    var PageView = Backbone.Marionette.ItemView.extend({
        template: _.template(pagetpl),
        
        ui: {
        }
        , events: {
        }
        
        , initialize: function() {
            
        }
        
        , onDomRefresh: function() {
            
            var addPie = function(ctx) {

                var data = [
                    {
                        value: 65,
                        color: "#5cb85c",
                        highlight: "#5cb85c",
                        label: "5 stars"
                    },
                    
                    {
                        value: 13,
                        color: "#337ab7",
                        highlight: "#337ab7",
                        label: "4 stars"
                    },
                    
                    {
                        value: 7,
                        color: "#5bc0de",
                        highlight: "#5bc0de",
                        label: "3 stars"
                    },
                    
                    {
                        value: 10,
                        color: "#f0ad4e",
                        highlight: "#f0ad4e",
                        label: "2 stars"
                    },
                    
                    {
                        value: 5,
                        color: "#d9534f",
                        highlight: "#d9534f",
                        label: "1 star"
                    }
                    
                ]
                
                var myPieChart = new Chart(ctx).Pie(data, {
                    animateScale: true
                });
            
            };
            
            var ctx = this.$('#graph-feedback')[0].getContext("2d");
            addPie(ctx);
            
        }
        
    });
    
    return PageView;
});