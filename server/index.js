const RequestTurtle = require('request-turtle');
const turtle = new RequestTurtle({ limit: 300 });
const cheerio = require('cheerio');
const Page = require('../models').Page;


const parseTitle = (string) => {
  let newStr = string.match(/<title>(.*?)<\/title>/g);
  newStr = newStr.slice(6, -7);
}

const webcrawl = (url) => {
  turtle.request({
    method: 'GET',
    uri: url
  })
  .then(results => {
    const $ = cheerio.load(results);
    const title = $('title').text();
    const linkArray = [];
    $('body').find('a').each(function(i, obj) {
      linkArray.push($(obj).attr('href'));
    });
    Page.create({
      title,
      url,
      textContent: results,
      status: 200
    })
    linkArray.slice(0, 5).forEach((url) => {
      Page.findOne({where: {
        url
      }})
      .then(results => console.log(results || url));
    });
  });
}

webcrawl('https://www.fullstackacademy.com');

