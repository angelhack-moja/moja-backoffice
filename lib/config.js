
var _ = require('lodash');

var config = null;
var defaults = {
    
};

module.exports.get = function() {
    
    if(!config) {
        
        try {
            config = _.merge(defaults, require('../config.json'));
        }
        catch(e){
            console.error("config.json not found");
                config = _.merge(defaults, {});
        }
    }
    
    return config;
};

