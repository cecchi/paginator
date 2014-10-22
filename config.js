module.exports = {
    'debug' : false,
    'seed'  : 'https://sjobs.brassring.com/TGWebHost/searchopenings.aspx?partnerid=25545&siteid=5086',
    'selectors' : {
        'search' : 'button[type="submit"]',
        'result' : 'a[href^="jobdetails.aspx"]',
        'next'   : 'a.yui-pg-next'
    }
}

/*
module.exports = {
    'debug' : false,
    'seed'  : 'http://jobs.hasbro.com/',
    'selectors' : {
        'search' : 'input[type="submit"]',
        'result' : '.jobTitle a',
        'next'   : '.pagination-links a'
    }
}
*/