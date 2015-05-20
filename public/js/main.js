

require.config({
    
    baseUrl: "/",
    
    paths: {
        
        "text": "assets/requirejs-text/text",
        "css": "assets/require-css/css",
        
        "marionette": "assets/marionette/lib/backbone.marionette",
        "backbone.babysitter": "assets/backbone.babysitter/lib/backbone.babysitter",
        "backbone.wreqr": "assets/backbone.wreqr/lib/backbone.wreqr",

        "backbone": "assets/backbone/backbone",
        "underscore": "assets/underscore/underscore",
        "jquery": "assets/jquery/dist/jquery",
        "leaflet": "assets/leaflet/dist/leaflet-src",
        
        "chartjs": "assets/Chart.js/Chart",
        
        
    },
    shim: {
        
        "js/app": [ 
            
            "marionette", "leaflet",
            "css!/css/style.css",
            
            "css!assets/bootstrap/dist/css/bootstrap.css",
            "css!assets/bootstrap/dist/css/bootstrap-theme.css",
            
            "text!/js/tpl/challenge-view.html",
            
            "js/challenge-create",
            "js/analytics",
            "js/ratings"            
        ],
        
        "js/challenge-create": [
            "marionette",
            "text!/js/tpl/challenge.html"
        ],
        
        "js/analytics": [
            "marionette",
            "text!/js/tpl/analytics.html",
            "chartjs"
        ],
        
        "js/ratings": [
            "marionette",
            "text!/js/tpl/ratings.html",
            "chartjs"
        ],
        
        "leaflet": [
            "css!assets/leaflet/dist/leaflet"
        ],
        
        "marionette": [ "backbone", "backbone.babysitter", "backbone.wreqr" ],
        
        "backbone": {
            deps: [ "underscore", "jquery" ]
        }
        
    }
    
});

require([ "js/app" ], function() {
    
});