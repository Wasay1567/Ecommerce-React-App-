import scrapy
import json
from pymongo import MongoClient

class CoachSpider(scrapy.Spider):
    name = "coach"
    allowed_domains = ["coachoutlet.com"]
    api_base = "https://www.coachoutlet.com/api/get-shop"

    # Define all category paths
    
    categories = {
        'handbags': [
            'women/bags',
            'bags/view-all',
            'bags?filterCategory=Totes+and+Carryalls',
            'bags/totes-carryalls',
            'bags?filterCategory=Shoulder+Bags',
            'bags/shoulder-bags-hobos',
            'bags?filterCategory=Crossbody+Bags',
            'bags/crossbody-bags',
            'bags/satchels-top-handles',
            'bags/mini-bags-clutches',
            'women/bags?filterCategory=Backpacks|Belt+Bags+and+Slings',
            'bags/backpacks',
            'bags/belt-bags'
        ],
        'wallets': [
            'women/wallets',
            'wallets/small-wallets?gender=Women',
            'wallets/large-wallets?gender=Women'
        ],
        'wristlets': [
            'women/wristlets',
            'wallets/wristlets'
        ]
    }



    def start_requests(self):
        # self.client = MongoClient(
        #     'mongodb+srv://scrapy3:CNYq6DSrpZ0EZ4XR@cluster0.bjwly.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        #     serverSelectionTimeoutMS=5000,  # Adjust timeout in milliseconds
        #     socketTimeoutMS=60000,          # Adjust socket timeout in milliseconds
        #     maxPoolSize=50 )
        # self.db = self.client['Scraper_data']
        # self.collection = self.db['products']
        # Generate initial requests for each category
        for category_type, paths in self.categories.items():
            for path in paths:
                if('?' in path):
                    url = f"{self.api_base}/{path}&page=1&__v__=i6V2v_FlgwNoK_3qVocJH"
                else:
                    url = f"{self.api_base}/{path}?page=1&__v__=i6V2v_FlgwNoK_3qVocJH"
                yield scrapy.Request(
                    url,
                    callback=self.parse_first_page,
                    # headers=self.headers,
                    meta={'category_type': category_type, 'path': path},
                    dont_filter=True  # Ensure the request is not filtered
                )

    def parse_first_page(self, response):
        if response.status == 301:
            # Follow the redirected link
            redirected_url = response.headers.get('Location').decode('utf-8')
            yield scrapy.Request(
                redirected_url,
                callback=self.parse_first_page,
                meta={'category_type': response.meta['category_type'], 'path': response.meta['path']}
            )
            return
        data = json.loads(response.body)
        total_pages = data.get('pageData', {}).get('totalPages', 0)
        print(total_pages)
        # Generate requests for all pages in this category
        category_type = response.meta['category_type']
        path = response.meta['path']

        # Process first page
        yield from self.parse_products(response)

        # Generate requests for remaining pages
        for page in range(2, total_pages + 1):
            if('?' in path):
                url = f"{self.api_base}/{path}&page={page}&__v__=i6V2v_FlgwNoK_3qVocJH"
            else:
                url = f"{self.api_base}/{path}?page={page}&__v__=i6V2v_FlgwNoK_3qVocJH"
            yield scrapy.Request(
                url,
                callback=self.parse_products,
                meta={'category_type': category_type, 'path': path}
            )

    def parse_products(self, response):
        data = json.loads(response.body)
        products = data.get('pageData', {}).get('products', [])
        category_type = response.meta['category_type']
        path = response.meta['path']
        
        for product in products:
            # Fetch product URL
            product_url = "https://www.coachoutlet.com" + product.get("url")
            
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
            review_count = response.css('p.review-count ::text').get().strip()
        except:
            review_count = 0

        try:
            colors = []
            colors_elements = response.css('a.css-jskcrt')
            for color_element in colors_elements:
                color_href = "https://www.coachoutlet.com" + color_element.css('::attr(href)').get()
                color_title = color_element.css('button ::attr(data-color-text)').get()
                color_id = color_element.css('button ::attr(data-color-text)').get()  # Assuming color_id is the same as color_title for simplicity
                color_img = color_element.css('img ::attr(src)').get().replace('?$desktopSwatchImage$','')
                colors.append({
                    "id": color_id,
                    "text": color_title,
                    "image": color_img,
                    "link": color_href
                })
        except Exception as e:
            print(f"An error occurred while processing colors: {e}")
            colors = []
            
        
        
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
            # "colors": [
            #     {
            #         "id": color.get("id"),
            #         "text": color.get("text"),
            #         "image": color.get("image", {}).get("src"),
            #     }
            #     for color in product.get("colors", [])
            # ],
            "colors":colors,
            "image": [
                media_item.get("src")
                for media_item in product.get("media", {}).get("full", [])
            ],
            "thumbnail": product.get("media", {}).get("thumbnail", {}).get("src"),
            "stock_level": product.get("inventory", {}).get("stockLevel"),
            "is_orderable": product.get("inventory", {}).get("orderable"),
            "url": "https://www.coachoutlet.com"+product.get("url"),
            "variation_values": product.get("variationValues", {}),
            "details": product.get("details"),
            "reviewCount" : review_count,
        }