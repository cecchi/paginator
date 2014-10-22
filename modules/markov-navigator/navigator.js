var require    = patchRequire(require),
    casper     = require('casper'),
    Classifier = require('./classifier');

/**
 * A "memory-less" algorithm for navigating complex websites linearly in a headless browser
 *      (as opposed to wide-breadth crawling based on URLs)
 *
 * @class   MarkovNavigator
 * @param   {Object}    options
 * @constructor
 */
function MarkovNavigator(options) {
    // Casper instance
    this.casper = casper.create(options.casper || {});

    // Classifiers
    this.classifiers = [];

    // Options
    if(options) {
        // Initial URL
        if(options.initialUrl) {
            this.seed(options.initialUrl);
        }

        // Classifiers
        if(Array.isArray(options.classifiers)) {
            options.classifiers.forEach(this.addClassifier.bind(this));
        }
    }
}

/**
 * Add a new page classifier
 *
 * @method  addClassifier
 * @return  {MarkovNavigator}
 */
MarkovNavigator.prototype.addClassifier = function(constructor) {
    try {
        var classifier = new constructor(this.casper);
    } catch(e) {
        throw new Error('Could not construct classifier');
    }

    if(!(classifier instanceof Classifier)) {
        throw new Error('Attempted to add an invalid classifier');
    }

    this.classifiers.push(classifier);

    return this;
};

/**
 * Set the initial URL for navigation
 *
 * @method  seed
 * @param   {String}     url     The initial URL to navigate from
 * @return  {MarkovNavigator}
 */
MarkovNavigator.prototype.seed = function(url) {
    this.initialUrl = url;

    return this;
};

/**
 * Take a step, repeat
 *
 * @method  walk
 * @return  {MarkovNavigator}
 */
MarkovNavigator.prototype.walk = function() {
    var self = this;

    self.casper.echo('\n\nWalking...');

    // Find the first matching classifier
    this.classifiers.some(function(classifier) {
        self.casper.echo('Applying ' + classifier.constructor.name + '');

        if(classifier.classify()) {
            self.casper.echo('... Matched!');

            // Navigate to next step and repeat
            self.casper
                .then(classifier.next.bind(classifier))
                .then(self.walk.bind(self));

            return true;
        }
    });

    return this;
};


/**
 * Begin generative navigation
 *
 * @method run
 * @return {MarkovNavigator}
 */
MarkovNavigator.prototype.run = function() {
    this.casper.start(this.initialUrl, this.walk.bind(this));

    this.casper.run();

    return this;
};

module.exports = MarkovNavigator;
module.exports.Classifier = Classifier;