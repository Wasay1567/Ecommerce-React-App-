import os
import json
import re
from collections import defaultdict

def load_json_files(folder_path):
    all_products = []
    for filename in os.listdir(folder_path):
        if filename.endswith('.json'):
            with open(os.path.join(folder_path, filename), 'r', encoding="utf8") as file:
                products = json.load(file)
                all_products.extend(products)
    return all_products

def clean_brand_name(brand):
    # Remove non-English alphabet characters from the brand name
    return re.sub(r'[^a-zA-Z\s]', '', brand)

def consolidate_products(products):
    consolidated = defaultdict(lambda: {
        'brand': '',
        'category_paths': [],
        'details': {},
        'price': float('inf'),
        'regular_price': float('inf')
    })
    
    for product in products:
        t=0
        # Debugging: Check the type of product
        try:
            sku = (product['SKU'])
            brand = clean_brand_name(product['brand'])
            if product['price'] is None or product['regular_price'] is None:
                print(f"Skipping product with SKU {sku}: price or regular_price is None.")
                continue
            price = product['price']
            regular_price = product['regular_price']
            # Increase price by 65% while maintaining the discount
            discount = (regular_price - price) / regular_price
            new_regular_price = regular_price * 1.65
            new_price = new_regular_price * (1 - discount)
            if sku in consolidated:
                # If the SKU already exists, add the category path if it's not already in the list
                if product['category_path'] not in consolidated[sku]['category_paths']:
                    consolidated[sku]['category_paths'].append(product['category_path'])
                # Update the price and regular price to the least values
                consolidated[sku]['price'] = min(consolidated[sku]['price'], price)
                consolidated[sku]['regular_price'] = min(consolidated[sku]['regular_price'], regular_price)
            else:
                # If it's a new SKU, initialize it
                consolidated[sku]['brand'] = brand
                consolidated[sku]['category_paths'].append(product['category_path'])
                consolidated[sku]['price'] = price
                consolidated[sku]['regular_price'] = regular_price
                # Retain other product details
                consolidated[sku]['details'] = {k: v for k, v in product.items() if k not in ['brand', 'category_path']}
        except KeyError as e:
            print(f"KeyError: Missing key {e} in product: {product}")
        except Exception as e:
            print(f"Unexpected error: {e} with product: {product}")
        
    # Convert the consolidated dictionary back to a list of products
    result = []
    for sku, data in consolidated.items():
        result.append({
            'SKU': sku,
            'brand': data['brand'],
            'category_paths': data['category_paths'],
            'price': data['price'],
            'regular_price': data['regular_price'],
            **data['details']  # Include other details
        })
    print("Total", t)
    
    return result

def main(folder_path):
    # Ensure folder_path is valid
    if not os.path.exists(folder_path):
        raise ValueError(f"The specified folder path does not exist: {folder_path}")
    
    print(f"Loading JSON files from: {folder_path}")
    all_products = load_json_files(folder_path)
    print(f"Loaded {len(all_products)} products.")
    
    consolidated_products = consolidate_products(all_products)
    print(f"Consolidated to {len(consolidated_products)} products.")
    
    # Output the consolidated products
    with open('consolidated_products.json', 'w', encoding='utf8') as outfile:
        json.dump(consolidated_products, outfile, indent=4)
    print("Consolidated products saved to 'consolidated_products.json'.")

# Replace 'your_folder_path' with the path to your folder containing JSON files
main(os.getcwd())
