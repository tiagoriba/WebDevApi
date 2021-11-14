const PORT = 8000;
const puppeteer = require('puppeteer');
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
//const cloudscraper = require('cloudscraper');
 
const app = express();

async function configureBrowser() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args : [
            '--no-sandbox',
            '--disable-setuid-sandbox'
          ]
      });
    const page = await browser.newPage();
    await page.goto('https://www.pcdiga.com/#/embedded/query=asus', {
        waitUntil: 'networkidle0',
      });
    return page;
}

const searchResults = [];

app.get('/', async (req, res) => {
    let page = await configureBrowser();

    let html = await page.evaluate(() => document.body.innerHTML);
    
    const $ = cheerio.load(html);
    $('div[class="df-card"]',html).each(function (index, element) {
        console.log($(element).html());
        var title = $(this).find('.df-card__title').text();
        searchResults.push(title);
    }) 
    res.json(searchResults);
    //res.json('Welcome');
    /* axios.get('https://www.pcdiga.com').then((response) => {
        const html = response.data;
        console.log(html);
    }) */
    /* cloudscraper.get('https://www.pccomponentes.pt/buscar/?query=monitor').then((body) => {
        res.json(body);
        const $ = cheerio.load(body);
        //console.log($.html());
        
        /* $('[data-list="search results"]').each(() => {
            console.log( 'dwqdqw');
        }) 
       
    }); 
 */
})

app.listen(process.env.PORT || 8000)