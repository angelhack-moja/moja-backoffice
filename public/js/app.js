define(function () {

    var Backbone = require('backbone');
    var _ = require('underscore');

    var ChallengeView = require('js/challenge-create');
    var AnalyiticsView = require('js/analytics');
    var RatingsView = require('js/ratings');

    var App = Backbone.Marionette.Application.extend({
        initialize: function (options) {
            
            this.mc = Backbone.$('.main-container');
            this.menu = Backbone.$('#bs-example-navbar-collapse-1');
            
            this.router = this.setupRoutes();
            
            this.bindWindowResize();
            
        }
        , onStart: function() {
            Backbone.history.start();
        }
        , setupRoutes: function () {
            
            var me = this;
        
            var Router = Backbone.Marionette.AppRouter.extend({

//              appRoutes: {},

                routes: {
                    "analytics": "analyticsView",
                    "campaigns": "challengeAdd",
                    "ratings": "ratingsView",
                    "*all": "challengeAdd",                    
                }
                
                , challengeAdd: function () {
                    
                    me.setMenu('campaigns');
                    
                    var challengeView = new ChallengeView({
                        el: '.main-container'
                    });

                    challengeView.render();
                    challengeView.triggerMethod('dom:refresh');
                    
                }
                
                , analyticsView: function () {
                    
                    me.setMenu('analytics');
                    
                    var analyticsView = new AnalyiticsView({
                        el: '.main-container'
                    });

                    analyticsView.render();
                    analyticsView.triggerMethod('dom:refresh');
                    
                }
                
                , ratingsView: function () {
                    
                    me.setMenu('ratings');
                    
                    var ratingsView = new RatingsView({
                        el: '.main-container'
                    });

                    ratingsView.render();
                    ratingsView.triggerMethod('dom:refresh');
                    
                }
            });
            
            return new Router();
        }
        
        , setMenu: function(path) {

//            console.log(this.menu);

            this.menu
                .find('li').removeClass('active');
        
            this.menu
                .find('a[href="#'+path+'"]').parent().addClass('active');

        }        
        , bindWindowResize: function () {

            var me = this;

            Backbone.$(window).on('resize', function () {
                me.mc.height(Backbone.$(window).height() - (me.menu.height() + 25));
            }).trigger('resize');

        }
    });



    return (new App).start();

});