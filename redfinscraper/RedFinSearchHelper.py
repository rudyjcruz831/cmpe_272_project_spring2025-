import time
import random
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import subprocess
import sys
import os

if len(sys.argv) > 1:
    search_query = sys.argv[1]
else:
    search_query = input("Enter a city, ZIP code, or neighborhood: ")

if len(sys.argv) > 2:
    output_file = sys.argv[2]
else:
    output_file = "rental_listings.json"

if len(sys.argv) > 3:
    scrapy_project_dir = os.path.abspath(sys.argv[3])
else:
    print("ERROR: No Scrapy project directory provided. Exiting.")
    sys.exit(1)

# ----- Launch Undetected Chrome -----
options = uc.ChromeOptions()
options.add_argument("--disable-blink-features=AutomationControlled")  # Helps avoid detection
driver = uc.Chrome(options=options)

driver.get("https://www.redfin.com")

# ----- Human-like pause after page load -----
time.sleep(random.uniform(1.5, 3.0))

# ----- Find the search box -----
search_box = WebDriverWait(driver, 15).until(
    EC.presence_of_element_located((By.ID, "search-box-input"))
)
search_box.clear()

# ----- Random scroll down a bit -----
driver.execute_script("window.scrollBy(0, 100);")
time.sleep(random.uniform(0.8, 1.5))

# ----- Simulate human typing -----
for character in search_query:
    search_box.send_keys(character)
    time.sleep(random.uniform(0.1, 0.25))  # Random typing speed

# ----- Move mouse to the search box -----
actions = ActionChains(driver)
actions.move_to_element(search_box).perform()

# ----- Random pause before hitting Enter -----
time.sleep(random.uniform(1.2, 2.2))

search_box.send_keys(Keys.RETURN)

# ----- Slight scroll again -----
time.sleep(random.uniform(1, 3))
driver.execute_script("window.scrollBy(0, 50);")

# ----- Wait for results -----
try:
    WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "div.HomeCardContainer, div.RentalHomeCardContainer"))
    )
except:
    print("Could not find search results. Exiting.")
    driver.quit()
    exit()

# ----- Get URL -----
resulting_url = driver.current_url

# ----- Make sure it's a rentals page -----
if "/apartments-for-rent" not in resulting_url:
    resulting_url = resulting_url.rstrip("/") + "/apartments-for-rent"

#print("Found rentals URL:", resulting_url)

driver.quit()

# ----- Start Scrapy Spider -----
#subprocess.run([
#    "scrapy",
#    "crawl",
#    "homes",
#    "-a",
#    f"start_url={resulting_url}",
#    "-O",
#    output_file
#], cwd=scrapy_project_dir)

result = subprocess.run([
    "scrapy",
    "crawl",
    "homes",
    "-a",
    f"start_url={resulting_url}",
    "-O",
    output_file
], cwd=scrapy_project_dir, capture_output=True, text=True)

print("Scrapy stdout:\n", result.stdout)
print("Scrapy stderr:\n", result.stderr)

if result.returncode != 0:
    print("Scrapy failed.")
    sys.exit(result.returncode)
else:
    print("Scraping completed successfully.")
