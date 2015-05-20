define(function () {

    var Backbone = require('backbone');
    var _ = require('underscore');

    var challengeTemplate = require('text!/js/tpl/challenge-view.html');
    var pagetpl = require('text!/js/tpl/challenge.html');
    
    var L = require('leaflet');


    var ChallengeModel = Backbone.Model.extend({
        defaults: {
            id: null,
            type: 'challenge',
            step: null,
            point: null,
            clientId: null,
            group: (new Date()).getTime(),
            quest: 'puzzle',
            coupon: null
        },
        initialize: function (opts) {

            this.layer = opts.layer;
            this.marker = opts.marker;

            this.set('id', (new Date()).getTime());

        }
    });

    var ChallengeCollection = Backbone.Collection.extend({
        comparator: function (a, b) {
            return a.get('step') > b.get('step');
        },
        initialize: function () {
            this.on('remove', function (model) {
                console.log(model);
                model.layer.removeLayer(model.marker);
            });
        },
        toJSON: function() {
            
            var json = Backbone.Collection.prototype.toJSON.apply(this, arguments);
            
            _.forEach(json, function(el, i) {
                
                delete el.layer;
                delete el.marker;
                
//                el.latitude = el.position[0];
//                el.longitude = el.position[1];
                
//                delete el.position;
                
                json[i] = el;
            });
            
            return json;
        },
        model: ChallengeModel
    });

    var ChallengeFormView = Backbone.Marionette.ItemView.extend({
        template: _.template(challengeTemplate),
        templateHelpers: function () {
            
            var list = {
                item: this.model.toJSON(),
                isLast: this.isLast()
            };
            
            return list;
            
        },
        events: {
            'change .quest': 'showOptions',
            'click .moveUp': 'moveUp',
            'click .moveDown': 'moveDown',
            'click .remove': 'removeItem',
            'keypress .coupon': 'setCoupon',
        },
        isLast: function() {
            return (this.model.collection.last().get('id') === this.model.get('id'));
        }
        ,onRender: function () {
            
            this.$('.quest').find('option:eq(0)').attr('selected', 'selected');
            this.$('.quest').trigger('change');
            
            if(this.isLast()) {
                this.setCoupon();
            }
            else {
                this.model.set('coupon', null);
            }
            
        },
        setCoupon: function () {
            this.model.set('coupon', this.$('.coupon').val() || '20%');
        },
        removeItem: function () {
            this.model.collection.remove(this.model);
        },
        showOptions: function (e) {

            var sel = this.$(e.currentTarget).find('option:checked');

            this.$('.game-options').hide();
            this.$('.form-' + sel.val()).fadeIn();

        },
        moveDown: function () {

            console.log("moveUp");

            return this.move(+1);
        },
        moveUp: function () {

            console.log("moveDown");

            return this.move(-1);
        },
        move: function (mv) {
            
            return false;

            var me = this;

            var step = this.model.get('step');

            if (1 === step && mv < 0)
                return false;
            if (this.model.collection.length === step && mv > 0)
                return false;

            step += mv;

            console.log("set %s %s -> %s", this.model.id, this.model.get('step'), step);
            this.model.set('step', step);

            this.model.collection.forEach(function (model) {

                if (me.model.id === model.id)
                    return;

                if (model.get('step') === step + (mv * -1)) {
                    console.log("set %s %s -> %s", model.id, model.get('step'), step + 1);
                    model.set('step', step + (mv * -1));
                }

            });

            this.model.collection.sort({sort: true});

            return false;

        }
    });

    var ChallengeCollectionView = Backbone.Marionette.CollectionView.extend({
        childView: ChallengeFormView,
        initialize: function () {
            var me = this;
            this.collection.on('sort', function () {
                me.render();
            });
        }
    });

    var map;
    
    var PageView = Backbone.Marionette.ItemView.extend({
        template: _.template(pagetpl),
        events: {
            "click .save": "doSave"
        }
        , initialize: function() {
            
            this.challenges = new ChallengeCollection;
            
            this.listView = null;
            
        }
        , initmap: function () {
            
            var me = this;
            
            // set up the map
            map = new L.Map('map');

            // create the tile layer with correct attribution
            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

            var osm = new L.TileLayer(osmUrl, {
                minZoom: 8,
                maxZoom: 18,
                attribution: osmAttrib
            });

            // start the map in Bolzano
            map.setView(new L.LatLng(46.492247207208926, 11.338577270507812), 12);
            map.addLayer(osm);

            console.log("initmap");

            var layer = L.layerGroup().addTo(map);

            map.on('dblclick', function (e) {

//                console.log("Add point", e.latlng);

                var marker = L.marker(e.latlng, {
                    draggable: true
                });

                var pos = e.latlng;

                var challenge = new ChallengeModel({
                    position: [pos.lat, pos.lng],
                    step: me.challenges.length + 1,
                    marker: marker,
                    layer: layer
                });

                marker.on('dragend', function (e) {

//                    console.log("New pos", e.target.getLatLng());

                    var pos = e.target.getLatLng();
                    challenge.set('position', [pos.lat, pos.lng]);

                });

                layer.addLayer(marker);

                me.challenges.add(challenge);

            });

        }        
        
        , onDomRefresh: function() {
                        
            if(!this.listView) {
                
                this.initmap();
                
                this.listView = new ChallengeCollectionView({
                    el: '.challenge-list',
                    collection: this.challenges
                });
                
                this.listView.render();            
            }
            
        }
        , doSave: function() {
            
            if(!this.listView) return;

            var json = this.listView.collection.toJSON();
            console.log(json);

            Backbone.$.ajax({
                method: 'POST',
                url: "api/challenges",
                data: JSON.stringify(json),
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).complete(function(res, type) {
                
                if(type === 'error') {
                    console.warn(type, res);
                }

            });

            return false;            
            
        }
    });
    
    return PageView;
});