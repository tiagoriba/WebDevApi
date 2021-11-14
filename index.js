const PORT = 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cloudscraper = require('cloudscraper');
 
const app = express();


app.get('/', (req, res) => {
    //res.json('Welcome');
    /* axios.get('https://www.pcdiga.com').then((response) => {
        const html = response.data;
        console.log(html);
    }) */

    cloudscraper.get('https://www.pccomponentes.pt/buscar/?query=monitor').then((body) => {
        res.json(body);
        const $ = cheerio.load(body);
        //console.log($.html());
        
        /* $('[data-list="search results"]').each(() => {
            console.log( 'dwqdqw');
        }) */
        $('a').each(() => {
            console.log( $(this).attr('href') );
        }) 
    }); 

})

app.listen(PORT , () => {
    
})