import scrapy
from scrapy_selenium import SeleniumRequest
import math

class RedfinSpider(scrapy.Spider):
    name = 'homes'


    def __init__(self, start_url=None, *args, **kwargs):
        super(RedfinSpider, self).__init__(*args, **kwargs)
        self.start_url = start_url
        

    def start_requests(self):
        yield SeleniumRequest(
            #url=self.start_urls[0],
            url=self.start_url,
            callback=self.parse_total_homes,
            wait_time=10 # Wait for JavaScript to load
        )
    
    def parse_total_homes(self, response):
        #Get the total amount of homes
        total_homes = response.css('div[data-rf-test-id="homes-description"]::text').re_first(r'\d+$')
        if(total_homes):
            total_homes = int(total_homes)
            total_pages = math.ceil(total_homes / 41)
            self.logger.info(f"Total Homes: {total_homes}, Total pages: {total_pages}")

            #scrape the first page
            yield from self.parse(response)

            #iterate throught the remaining pages using the URL
            for page_number in range (2, total_pages + 1):
                page_url = self.start_url.rstrip("/") + f"/page-{page_number}"
                self.logger.info(f"Queuing page {page_number}: {page_url}")
                yield SeleniumRequest(
                    url=page_url,
                    callback=self.parse,
                    wait_time=30,
                )

    def parse(self, response):
        
        for products in response.css('div.HomeCardContainer.flex.justify-center'):

            raw_text = products.xpath('.//div[contains(@class, "bp-Homecard__Address--address")]//text()').getall()
            address = ''.join(raw_text).replace('\xa0', '').replace('|', '').strip()
            if(not address) or (address.strip() == ''):
                address = products.css('div.bp-Homecard__Address::text').get()
                if(not address) :
                    continue

            price = products.css('div.bp-Homecard__SmallestUnit::text').get()
            if (not price) or (price.strip() == ''):
                price = products.css('span.bp-Homecard__Price--value::text').get()
                if (not price) or (price.strip() == ''):
                    price_parts = products.css('span.bp-Homecard__Price--value span::text').getall()
                    price = ''.join(price_parts).strip()

            beds = products.css('span.bp-Homecard__Stats--beds::text').get() or "-"
            baths = products.css('span.bp-Homecard__Stats--baths::text').get() or "-"
            

            #get the url of the listing
            relativeurl = products.css('a::attr(href)').get()
            full_url = response.urljoin(relativeurl)

            area_value = products.css('span.bp-Homecard__LockedStat--value::text').get()
            area_label = products.css('span.bp-Homecard__LockedStat--label::text').get()
            area_value = area_value or "-"
            area_label = area_label or "-"
            area = f"{area_value} {area_label}"
            yield {
                "address" : address,
                "price" : price,
                "beds" : beds,
                "baths" : baths,
                "area" : area,
                "home_url" : full_url,
                "image_url" : products.css('img.bp-Homecard__Photo--image::attr(src)').get()
                }

            
