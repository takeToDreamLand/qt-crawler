class Crawler {
    constructor(page, options={maxDepth: Number.MAX_SAFE_INTEGER}){
        /** @type {import('playwright').Page} */
        this.page = page;
        this.options = options;
    }
    async getAllItem(){
        const currentUrl = this.page.url();
        // console.log(currentUrl);
        const allRows = await this.page.$$(".wrapper tr");
        const croppedRows = allRows.slice(3, -1); // 
        const thenableResult = croppedRows.map(async (row) => {
            let className = await row.$("i").then(e => e.getAttribute("class"));
            let url = await row.$("a").then(e => e.getAttribute("href"));
            return {
                type: className === "icon-file" ? 'file' : 'folder',
                url: currentUrl+url,
                children: []
            }
        })
        return Promise.all(thenableResult);
    }
    async recursiveGetItem(depth=0){
        let result = await this.getAllItem();
        let urls = [];
        for(let i=0; i<result.length; i++){
            const item = result[i];
            if(item.type === 'file'){
                delete item.children;
                urls.push(item.url);
            }else{
                if(depth < this.options.maxDepth){
                    await this.page.goto(item.url);
                    const crawler = new Crawler(this.page, this.options);
                    let [childrenItems,childrenUrls] = await crawler.recursiveGetItem(depth+1);
                    item.children = childrenItems;
                    urls = urls.concat(childrenUrls);
                }
            }
        }
        console.log(urls);
        return [result,urls];
    }
}
exports.Crawler = Crawler;