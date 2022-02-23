const {Crawler} = require('./crawler');
const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');
async function main(){
    const urls = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), {encoding:'utf-8'}));
    const result = {};
    let resultUrls = [];
    const browser = await chromium.launch({
        headless: true
    });

    const context = await browser.newContext();
    const page = await context.newPage();
    for(let homepage in urls){
        await page.goto(urls[homepage]);
        let crawler = new Crawler(page, {maxDepth: Number.MAX_SAFE_INTEGER});
        const [siteResult,siteResultUrls] = await crawler.recursiveGetItem();
        result[homepage] = siteResult;
        resultUrls = resultUrls.concat(siteResultUrls);
    }
    // const result = await crawler.recursiveGetItem();
    await context.close();
    await browser.close();
    fs.writeFileSync(path.join(__dirname, '../result.json'), JSON.stringify(result, null, '  '));
    fs.writeFileSync(path.join(__dirname, '../urls.json'), JSON.stringify(resultUrls, null, '  '));
}
main();