var config           = require('./config'),
    MarkovNavigator  = require('./modules/markov-navigator/navigator'),
    SerpClassifier   = require('./modules/classifiers/serp-classifier'),
    SearchClassifier = require('./modules/classifiers/search-classifier');

var markov = new MarkovNavigator({
        'casper' : {
            'logLevel' : config.debug ? 'debug' : 'info',
            'verbose'  : config.debug ? true    : false,
            'ignoreSslErrors' : true
        },
        'classifiers' : [
            SerpClassifier,
            SearchClassifier
        ]
    })
    .seed(config.seed)
    .run();