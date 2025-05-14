import scrapy
from scrapy_selenium import SeleniumRequest
import math
from scrapy.spidermiddlewares.httperror import HttpError
from twisted.internet.error import DNSLookupError, TimeoutError

class RedfinSpider(scrapy.Spider):
    name = 'homes'
    custom_settings = {
        'RETRY_ENABLED': True,
        'RETRY_TIMES': 3,
        'RETRY_HTTP_CODES': [500, 502, 503, 504, 408, 429],
    }

    def __init__(self, start_url=None, *args, **kwargs):
        super(RedfinSpider, self).__init__(*args, **kwargs)
        self.start_url = start_url
        self.logger.info(f"Spider initialized with start_url: {start_url}")

    def start_requests(self):
        self.logger.info(f"Starting requests with URL: {self.start_url}")
        yield SeleniumRequest(
            url=self.start_url,
            callback=self.parse_total_homes,
            wait_time=10,  # Wait for JavaScript to load
            errback=self.errback_httpbin,
            dont_filter=True  # Important: Allow retries of the same URL
        )
    
    def errback_httpbin(self, failure):
        self.logger.error(f"Request failed: {failure.value}")
        if failure.check(HttpError):
            response = failure.value.response
            self.logger.error(f"HttpError on {response.url}, status: {response.status}")
        elif failure.check(DNSLookupError):
            request = failure.request
            self.logger.error(f"DNSLookupError on {request.url}")
        elif failure.check(TimeoutError):
            request = failure.request
            self.logger.error(f"TimeoutError on {request.url}")
    
    def parse_total_homes(self, response):
        self.logger.info("Parsing total homes from response")
        #Get the total amount of homes
        total_homes = response.css('div[data-rf-test-id="homes-description"]::text').re_first(r'\d+$')
        
        if not total_homes:
            self.logger.warning("Could not find total homes count, checking alternative selectors")
            # Try alternative selectors or handle the case when total_homes is not found
            total_homes = "41"  # Default to one page if count not found
        
        total_homes = int(total_homes)
        total_pages = math.ceil(total_homes / 41)
        self.logger.info(f"Total Homes: {total_homes}, Total pages: {total_pages}")

        #scrape the first page
        yield from self.parse(response)

        #iterate through the remaining pages using the URL
        for page_number in range(2, total_pages + 1):
            page_url = self.start_url.rstrip("/") + f"/page-{page_number}"
            self.logger.info(f"Queuing page {page_number}: {page_url}")
            yield SeleniumRequest(
                url=page_url,
                callback=self.parse,
                wait_time=30,
                errback=self.errback_httpbin,
                dont_filter=True,
                meta={'page_number': page_number}
            )

    def parse(self, response):
        page_number = response.meta.get('page_number', 1)
        self.logger.info(f"Parsing page {page_number}")
        
        products = response.css('div.HomeCardContainer.flex.justify-center')
        if not products:
            self.logger.warning(f"No products found on page {page_number}, URL: {response.url}")
            return

        for product in products:
            try:
                item = self.parse_product(product, response)
                if item:
                    yield item
            except Exception as e:
                self.logger.error(f"Error parsing product: {str(e)}")
                continue

    def parse_product(self, product, response):
        # Extract address
        raw_text = product.xpath('.//div[contains(@class, "bp-Homecard__Address--address")]//text()').getall()
        address = ''.join(raw_text).replace('\xa0', '').replace('|', '').strip()
        if not address or address.strip() == '':
            address = product.css('div.bp-Homecard__Address::text').get()
            if not address:
                self.logger.warning("Could not find address for product")
                return None

        # Extract price
        price = product.css('div.bp-Homecard__SmallestUnit::text').get()
        if not price or price.strip() == '':
            price = product.css('span.bp-Homecard__Price--value::text').get()
            if not price or price.strip() == '':
                price_parts = product.css('span.bp-Homecard__Price--value span::text').getall()
                price = ''.join(price_parts).strip()

        # Extract other details
        beds = product.css('span.bp-Homecard__Stats--beds::text').get() or "-"
        baths = product.css('span.bp-Homecard__Stats--baths::text').get() or "-"
        
        # Get the URL of the listing
        relativeurl = product.css('a::attr(href)').get()
        full_url = response.urljoin(relativeurl) if relativeurl else None

        area_value = product.css('span.bp-Homecard__LockedStat--value::text').get()
        area_label = product.css('span.bp-Homecard__LockedStat--label::text').get()
        area_value = area_value or "-"
        area_label = area_label or "-"
        area = f"{area_value} {area_label}"

        image_url = product.css('img.bp-Homecard__Photo--image::attr(src)').get()

        return {
            "address": address,
            "price": price,
            "beds": beds,
            "baths": baths,
            "area": area,
            "home_url": full_url,
            "image_url": image_url
        }

            
