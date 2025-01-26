import scrapy
import json
import requests

class KateSpider(scrapy.Spider):
    name = "kate"
    allowed_domains = ["katespadeoutlet.com"]
    api_base = "https://www.katespadeoutlet.com/api/get-shop"
    
    # Define all category paths
    categories = {
        'handbags': [
            'handbags/view-all',
            'new/handbags',
            'handbags/crossbody-bags',
            'handbags/tote-bags',
            'handbags/satchels',
            'handbags/backpacks-travel-bags',
            'handbags/shoulder-bags',
            'handbags/laptop-bags',
            'handbags/bucket-bags',
            'handbags/belt-bags',
            'collections/spade-flower',
            'collections/phoebe',
            'collections/the-lena-shop',
            'collections/madison',
            'collections/rosie',
            'collections/kayla',
            'collections/leila',
            'collections/reegan',
            'collections/camden',
            'collections/chelsea',
            'collections/the-carey-shop',
            'deals/clearance?department=handbags'
        ],
        'wallets': [
            'wallets/view-all',
            'new/wallets',
            'wallets/wristlets',
            'wallets/card-holders',
            'wallets/large-wallets',
            'wallets/medium-wallets',
            'wallets/small-wallets',
            'deals/clearance?department=wallets'
        ]
    }

    def start_requests(self):
        # Generate initial requests for each category
        for category_type, paths in self.categories.items():
            for path in paths:
                url = f"{self.api_base}/{path}?page=1&__v__=kR_dkUFJTJnXOqtNKEtIJ"
                if('clearance' in path):
                    url = f"{self.api_base}/{path}&page=1&__v__=kR_dkUFJTJnXOqtNKEtIJ"
                yield scrapy.Request(
                    url,
                    callback=self.parse_first_page,
                    meta={'category_type': category_type, 'path': path},
                    dont_filter=True  # Allow following redirects
                )

    def parse_first_page(self, response):
        data = json.loads(response.body)
        total_pages = data.get('pageData', {}).get('totalPages', 0)
        
        # Generate requests for all pages in this category
        category_type = response.meta['category_type']
        path = response.meta['path']
        
        # Process first page
        yield from self.parse_products(response)
        
        # Generate requests for remaining pages
        for page in range(2, total_pages + 1):
            url = f"{self.api_base}/{path}?page={page}&__v__=kR_dkUFJTJnXOqtNKEtIJ"
            yield scrapy.Request(
                url,
                callback=self.parse_products,
                meta={'category_type': category_type, 'path': path},
                dont_filter=True  # Allow following redirects
            )

    def parse_products(self, response):
        data = json.loads(response.body)
        products = data.get('pageData', {}).get('products', [])
        category_type = response.meta['category_type']
        path = response.meta['path']
        
        for product in products:
            # Fetch product URL
            product_url = "https://www.katespadeoutlet.com" + product.get("url")
            
            # New request to fetch product details
            yield scrapy.Request(
                product_url,
                callback=self.parse_product_details,
                meta={'category_type': category_type, 'path': path, 'product': product},
                dont_filter=True  # Allow following redirects
            )

    def parse_product_details(self, response):
        product = response.meta['product']
        category_type = response.meta['category_type']
        path = response.meta['path']
        
        try:
            # url = "https://www.katespade.com/api/emplifi-reviews/get-reviews"

            # querystring = {"sortBy":"HighestRating","pagesize":"9","sku":product.get("pickedProps", {}).get("upc"),"__v__":"_Ecw-aqoRp_uRAaH5KhPp"}
            # resp = requests.request("GET", url, params=querystring)
            # review_data = json.loads(resp.text)
            # review_count = review_data.get('results', [{}])[0].get('rollup', {}).get('review_count', 0)
            # ratingValue = review_data.get('results', [{}])[0].get('rollup', {}).get('average_rating', 0)
    

            # print(resp)
            review_count = response.css('p.review-count ::text').get().strip()
            # # review_count.remove(' Reviews')
            
        except:
            review_count = 0
            
        
        
        # Extract product props details
        details = {}
        props_elements = response.css("div.product-props__details")
        
        for element in props_elements:
            key = element.css("h2::text").get().strip()
            values = [li.css("::text").get().strip() for li in element.css("li")]
            details[key] = values
        
        # Combine product details with existing product data
        product.update({
            "details": details
        })
        
        yield {
            "category_type": category_type,
            "category_path": path,
            "name": product.get("name"),
            "brand": product.get("brand"),
            "price": product.get("prices", {}).get("currentPrice"),
            "regular_price": product.get("prices", {}).get("regularPrice"),
            "SKU": product.get("productId"),
            "_id": product.get("productId"),
            "UPC": product.get("pickedProps", {}).get("upc"),
            "style": product.get("masterId"),
            "discount": product.get("prices", {}).get("discount"),
            "is_on_sale": product.get("prices", {}).get("isOnSale"),
            "colors": [
                {
                    "id": product.get("masterId").strip() + ' ' + color.get("id").strip(),
                    "text": color.get("text"),
                    "image": color.get("image", {}).get("src").replace('S_', ''),
                }
                for color in product.get("colors", [])
            ],
            "image": [
                media_item.get("src")
                for media_item in product.get("media", {}).get("full", [])
            ],
            "thumbnail": product.get("media", {}).get("thumbnail", {}).get("src"),
            "stock_level": product.get("inventory", {}).get("stockLevel"),
            "is_orderable": product.get("inventory", {}).get("orderable"),
            "url": 'https://www.katespade.com'+ product.get("url"),
            "variation_values": product.get("variationValues", {}),
            "details": product.get("details"),
            "reviewCount" : review_count,
        }

