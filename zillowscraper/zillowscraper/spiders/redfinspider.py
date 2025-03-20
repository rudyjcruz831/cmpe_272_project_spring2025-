import scrapy

class RedfinSpider(scrapy.Spider):
    name = 'homes'
    start_urls = ['https://www.redfin.com/zipcode/95139']

    def parse(self, response):
        for products in response.css('div.bp-Homecard__Content'):
           # address = response.css('div.bp-Homecard__Address::text').get()
           
            yield {
                #'address' : address.strip() if address else None,
                'address' : response.css('div.bp-Homecard__Address::text').get(),
                'price' : products.css('span.bp-Homecard__Price--value::text').get().replace('$',''),
                'beds' : products.css('span.bp-Homecard__Stats--beds::text').get(),
                'baths' : products.css('span.bp-Homecard__Stats--baths::text').get(),
                'area' : products.css('span.bp-Homecard__LockedStat--value::text').get() + " " + products.css('span.bp-Homecard__LockedStat--label::text').get()
                }
           
        
        for next_page in response.css('a.next'):
            yield response.follow(next_page, self.parse)
