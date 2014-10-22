var config     = require('../../config'),
    Classifier = require('../markov-navigator/classifier');

/**
 * A DOM classifier, exposing logic for identifying elements of interest on the page.
 *
 * Identifies SERP pages.
 *
 * @class   SerpClassifier
 * @param   {Casper}    casper
 * @constructor
 */
function SerpClassifier() {
    Classifier.apply(this, arguments);
}

SerpClassifier.prototype = Object.create(Classifier.prototype);
SerpClassifier.prototype.constructor = SerpClassifier;

/**
 * Determine whether the current state of the DOM is of interest.
 *
 * @method  classify
 * @return  {Boolean}
 */
SerpClassifier.prototype.classify = function() {
    return this.casper.exists(config.selectors.result);
};

/**
 * Navigate to the next state.
 *
 * @method  next
 * @return  {Boolean}   `true` if navigating to a new state, `false` to terminate navigation.
 */
SerpClassifier.prototype.next = function() {
    this.casper.waitForSelector(config.selectors.next, function() {
        this.echo(this.getElementsInfo(config.selectors.result).length + ' results found.');

        this.echo('Clicking [next]');

        this.click(config.selectors.next);
    });

    return true;
};

module.exports = SerpClassifier;