var config     = require('../../config'),
    Classifier = require('../markov-navigator/classifier');

/**
 * A DOM classifier, exposing logic for identifying elements of interest on the page.
 *
 * Identifies search pages.
 *
 * @class   SearchClassifier
 * @param   {Casper}    casper
 * @constructor
 */
function SearchClassifier() {
    Classifier.apply(this, arguments);
}

SearchClassifier.prototype = Object.create(Classifier.prototype);
SearchClassifier.prototype.constructor = SearchClassifier;

/**
 * Determine whether the current state of the DOM is of interest.
 *
 * @method  classify
 * @return  {Boolean}
 */
SearchClassifier.prototype.classify = function() {
    return this.casper.exists(config.selectors.search);
};

/**
 * Navigate to the next state.
 *
 * @method  next
 * @return  {Boolean}   `true` if navigating to a new state, `false` to terminate navigation.
 */
SearchClassifier.prototype.next = function() {
    this.casper.echo('Clicking [search]');

    this.casper.click(config.selectors.search);

    return true;
};

module.exports = SearchClassifier;