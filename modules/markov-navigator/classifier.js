/**
 * A DOM classifier, exposing logic for identifying elements of interest on the page.
 *
 * @class   MarkovNavigatorClassifier
 * @param   {Casper}    casper
 * @constructor
 */
function MarkovNavigatorClassifier(casper) {
    this.casper = casper;
}

/**
 * Determine whether the current state of the DOM is of interest.
 *
 * @method  classify
 * @return  {Boolean}
 */
MarkovNavigatorClassifier.prototype.classify = function() {
    throw new Error('MarkovNavigatorClassifier.prototype.classify is not implemented correctly');
};

/**
 * Navigate to the next state.
 *
 * @method  next
 * @return  {MarkovNavigatorClassifier}
 */
MarkovNavigatorClassifier.prototype.next = function() {
    throw new Error('MarkovNavigatorClassifier.prototype.next is not implemented correctly');
};


module.exports = MarkovNavigatorClassifier;