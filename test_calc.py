import sys
import os

# Mock the environment to test crud.recalculate_product_costs
sys.path.append(os.path.join(os.getcwd(), 'backend'))
import models

def test_calc():
    product = models.Product()
    product.packaging_size = "50x40x30"
    product.places_count = 2
    product.weight_per_box = 10
    product.price_cny = 100
    product.quantity = 2
    product.cny_rate = 12.5
    product.delivery_rate_usd_per_kg = 2.0
    product.usd_rate = 89.0
    product.service_percent = 10.0

    from crud import recalculate_product_costs
    recalculate_product_costs(product)

    print(f"Packaging Size: {product.packaging_size}")
    print(f"Places Count: {product.places_count}")
    print(f"Total Weight: {product.total_weight}") # Expect 20.0
    print(f"Total Volume: {product.total_volume}") # Expect (50*40*30*2)/1,000,000 = 0.12
    print(f"Density: {product.density}") # Expect 20/0.12 = 166.67

if __name__ == "__main__":
    test_calc()
