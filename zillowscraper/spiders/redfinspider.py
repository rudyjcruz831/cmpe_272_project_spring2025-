import scrapy
from scrapy_selenium import SeleniumRequest

class RedfinSpider(scrapy.Spider):
    name = 'homes'
    start_urls = ['https://www.redfin.com/zipcode/95020']


    def start_requests(self):
        yield SeleniumRequest(
            url=self.start_urls[0],
            callback=self.parse,
            wait_time=10  # Wait for JavaScript to load
        )

    def parse(self, response):
        #print(response.text)
        for products in response.css('div.bp-Homecard.bp-InteractiveHomecard'):
            yield {
                "address" : products.css('div.bp-Homecard__Address::text').get(),
                "price" : products.css('span.bp-Homecard__Price--value::text').get().replace('$',''),
                "beds" : products.css('span.bp-Homecard__Stats--beds::text').get(),
                "baths" : products.css('span.bp-Homecard__Stats--baths::text').get(),
                "area" : products.css('span.bp-Homecard__LockedStat--value::text').get() + " " + products.css('span.bp-Homecard__LockedStat--label::text').get(),
                "image_url" : products.css('img.bp-Homecard__Photo--image::attr(src)').get()
                }
            
        next_button = response.css('button.PageArrow__direction--next')
        if(next_button):
            yield SeleniumRequest(
                url=response.url, 
                callback=self.parse,
                wait_time=10,
                script="document.querySelector('button.PageArrow__direction--next').click()"
                #script="document.querySelector('button.bp-Button.PageArrow.clickable.Pagination__button.PageArrow__direction--next').click()"
                
                #script="""var nextBtn = document.querySelector('button.PageArrow__direction--next'); if (nextBtn) { nextBtn.click(); }"""
                )
