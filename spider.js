var config = require('./config'),
    casper = require('casper'),
    utils  = require('utils'),
    uuid   = require('node-uuid');

/**
 * Represents a page to scrape
 *
 * @class PaginationSpider
 * @constructor
 * @param   {String}            url     The URL to scrape
 * @param   {Function}          isSerp  A function that returns whether the current URL is a SERP when evaluated in the page context
 * @param   {PaginationSpider}  parent  The parent
 */
function PaginationSpider(url, isSerp, parent) {
    // UUID
    this.uuid = uuid.v4();

    // Current URL
    this.url = url;

    // Serp classifier
    this.isSerp = isSerp;

    // Simple inheritence
    this.parent = parent;

    // Casper instance
    this.casper = casper.create({
        //verbose: true,
        //logLevel: "debug"
    });

    // Keep track of child spiders
    this.children = 0;

    // Increment children counter of parent spider
    if(parent) {
        parent.children++;
    }
}

/**
 * Echo a message with some formatting for readability & debugging
 *
 * @method echo
 */
PaginationSpider.prototype.echo = function(msg) {
    var depth  = this.getDepth(),
        prefix = new Array(depth + 2).join('...');

    this.casper.echo(this.uuid + ' ' + prefix + ' ' + msg);
};

/**
 * Fired by child processes when they have finished
 *
 * @method childCompleted
 */
PaginationSpider.prototype.childCompleted = function() {
    var children = this.children--;
};

/**
 * Determine how many nodes we have crawled from the root
 *
 * @method getDepth
 */
PaginationSpider.prototype.getDepth = function() {
    var depth = 0,
        node  = this;

    while(node = node.parent) {
        depth++;
    }

    return depth;
};

/**
 * Element of interest aggregation.
 * TODO: Handle Javascript/AJAX links and form submissions.
 *
 * @method identifyTargets
 */
PaginationSpider.prototype.identifyLinks = function() {
    return this.casper.evaluate(
        function(url) {
            var nodeList  = document.querySelectorAll('a[href]'),
                nodeArray = Array.prototype.slice.call(nodeList),
                hrefs     = nodeArray.map(function(a) { return a.href; }),
                current   = document.createElement('a');

            // Use dummy link to get current hostname (window.URL is not implemented)
            current.href = url;

            return nodeArray
                .filter(function(a, index, self) {
                    // Filter cross-domain and duplicate links
                    // TODO: Filter search result links
                    return (hrefs.indexOf(a.href) === index) && (a.hostname === current.hostname);
                })
                .map(function(a) {
                    return a.href;
                });
        },
        this.url
    );
};

/**
 * Process this page. Acculumates a list of requests to make and recursively process.
 *
 * @method crawl
 *
 */
PaginationSpider.prototype.crawl = function() {
    var spider = this;

    spider.echo('Crawling ' + spider.url);

    // Open the URL
    spider.casper.start(spider.url);

    // Then...
    spider.casper.then(function() {
        var isSerp = this.evaluate(spider.isSerp);

        if(isSerp) {
            spider.echo('[SERP] Identifying Links');

            // Identify targets
            var links = spider.identifyLinks();

            // Crawl
            this.each(links, function(self, link) {
                spider.echo('Spawning Child Spider: ' + link);

                var child = new PaginationSpider(link, spider.isSerp, spider);

                child.crawl();
            });
        } else {
            spider.echo('[NOISE] Terminating Branch');
        }
    });

    // Kickoff spider
    spider.casper.run(function() {
        spider.echo('[COMPLETE]');

        if(spider.parent) {
            var active = (--spider.parent.children);

            if(active === 0) {
                spider.echo('[TERMINATING] All children complete');
                this.exit();
            }
        }
    });
};

// Initialize
var spider = new PaginationSpider(config.seed_url, function() {
    return document.querySelector('table#searchresults') !== null;
});

//utils.dump(spider);

spider.crawl();

/*
casper
    .start(config.seed_url)
    .then(function() {
        var urls = this.evaluate(function() {
            var links = Array.prototype.slice.call(
                document.querySelectorAll('a[href]')
            )
            .filter(function(element) {
                var href = element.getAttribute('href'), // Attribute value
                    url  = new URL(element.href);        // Fully qualified URL

                return href.length > 1;
            })
            .map(function(element) {
                var target = element.href;

                return target;
            });

            return links;
        });

        utils.dump(urls);
    })
    .run();
*/