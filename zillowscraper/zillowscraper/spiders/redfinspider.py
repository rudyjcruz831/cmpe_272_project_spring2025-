import scrapy
from scrapy_selenium import SeleniumRequest
import math

class RedfinSpider(scrapy.Spider):
    name = 'homes'
    start_urls = ['https://www.redfin.com/zipcode/95020']


    def start_requests(self):
        yield SeleniumRequest(
            url=self.start_urls[0],
            callback=self.parse_total_homes,
            wait_time=10  # Wait for JavaScript to load
        )
    
    def parse_total_homes(self, response):
        #Get the total amount of homes
        total_homes = response.css('div[data-rf-test-id="homes-description"]::text').re_first(r'\d+')
        if(total_homes):
            total_homes = int(total_homes)
            total_pages = math.ceil(total_homes / 41)
            self.logger.info(f"Total Homes: {total_homes}, Total pages: {total_pages}")

            yield from self.parse(response)

            #iterate throught the pages using the URL
            for page_number in range (1, total_pages + 1):
                page_url = f"https://www.redfin.com/zipcode/95020/page-{page_number}"
                yield SeleniumRequest(
                    url=page_url,
                    callback=self.parse,
                    wait_time=5
                )

    def parse(self, response):
        #print(response.text)
        #count = 1
        #houseCount = response.css('div[data-rf-test-id="homes-description"]::text').re_first(r'\d+')
        #Pages = houseCount/41
        #while(count < Pages) :
        
        #scrape all the information from the home cards
        for products in response.css('div.bp-Homecard.bp-InteractiveHomecard'):

            relativeurl = products.css('a::attr(href)').get()
            full_url = response.urljoin(relativeurl)

            yield {
                "address" : products.css('div.bp-Homecard__Address::text').get(),
                "price" : products.css('span.bp-Homecard__Price--value::text').get().replace('$',''),
                "beds" : products.css('span.bp-Homecard__Stats--beds::text').get(),
                "baths" : products.css('span.bp-Homecard__Stats--baths::text').get(),
                "area" : products.css('span.bp-Homecard__LockedStat--value::text').get() + " " + products.css('span.bp-Homecard__LockedStat--label::text').get(),
                "home_url" : full_url,
                "image_url" : products.css('img.bp-Homecard__Photo--image::attr(src)').get()
                }
        #count  = count + 1
            

    #    next_button = response.css('button.PageArrow__direction--next')
    #    if(next_button):
    #        yield SeleniumRequest(
    #            url=response.url, 
    #            callback=self.parse,
    #            wait_time=10,
                #script="document.querySelector('button.PageArrow__direction--next').click()"
                #script="document.querySelector('button.bp-Button.PageArrow.clickable.Pagination__button.PageArrow__direction--next').click()"
                
    #            script="""var nextBtn = document.querySelector('button.PageArrow__direction--next'); if (nextBtn) { nextBtn.click(); }"""
    #        )

            
