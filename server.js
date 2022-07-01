const express = require('express');
const app = express();
const puppeteer = require('puppeteer')
const fs = require('fs');

app.listen(3000, ()=> {
  console.log ('servidor subiu com sussessinhos!');
});


const realizarLeitura = async function(req, res) {
  const browser = await puppeteer.launch({product: 'firefox', headless: true,
  args: ['--disable-blink-features=AutomationControlled']});
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36");
  await page.goto('http://tviron.com/result.php');

  const pageData = await page.evaluate(() => {
    return {
      title: document.getElementById("container").querySelector('#container > table').innerHTML,
    };
  });

  await browser.close();
  fs.writeFileSync("example.html", pageData.title);
  res.send({
    "id": 33082,
    "result": pageData.title,
  })
}
  
app.get('/', async (req, res) => { 
  setInterval(async () => {
    await realizarLeitura(req, res);
  }, 60000);
});