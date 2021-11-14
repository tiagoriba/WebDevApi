const PORT = process.env.PORT || 8000;
const envIsHeroku = PORT != 8000 ? true :false
const puppeteer = require('puppeteer');
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
//const cloudscraper = require('cloudscraper');
 
const app = express();

const pcdiga = 'https://www.pcdiga.com/#/embedded/query=';
const pccomponentes = 'https://www.pccomponentes.pt/buscar/?query=';
const chipsite = 'https://www.chipsite.pt/procurar?controller=search&s=';

async function configureBrowser( url) {
    const browser = await puppeteer.launch({
        headless: envIsHeroku ? true : false,
        defaultViewport: null,
        args : [
            '--no-sandbox',
            '--disable-setuid-sandbox'
          ]
      });
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle0',
    });
    return page;

}

const searchResults = [];

async function getAllFromPcComp(search){
    let page = await configureBrowser(pccomponentes + search);

    let html = await page.evaluate(() => document.body.innerHTML);
    const $ = cheerio.load(html);
    $('a[data-list="search results"]',html).each(function (index, element) {
        var title = $(this).data('name');
        searchResults.push({
            title: $(this).data('name'),
            price: $(this).data('price'),
            link:$(this).attr('href')
        });
        
    }) 
}

async function getAllFromChipSite(search){
    let page = await configureBrowser(chipsite + search);
    let html = await page.evaluate(() => document.body.innerHTML);
    const $ = cheerio.load(html);
    $('article',html).each(function (index, element) {
        var ehref = $(this).find('.product-name > a');
        searchResults.push(
            {
                title: ehref.text(),
                price: ehref.attr('href'),
                link:$(this).find('[class="price product-price"]').text()
            }
            );
        
    }) 
}
app.get('/', async (req, res) => {
    res.json({
        comousar: 'Para procurar por um componente basta no url adicionar o que deseja procurar Ex. https://webdevapi30000100.herokuapp.com/Monitor Asus',
        help: 'Para aparecer de mais sites como por ex. pccomponentes, usar no computador git: https://github.com/tiagoriba/WebDevApi'
    });
});
app.get('/:search', async (req, res) => {
    let search = req.params.search;
    await getAllFromChipSite(search);
    if (!envIsHeroku) {
        await getAllFromPcComp(search);
    }
    res.json(searchResults);
    
})

app.listen(PORT)