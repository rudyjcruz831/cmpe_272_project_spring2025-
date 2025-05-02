import time
import random
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import subprocess

# ----- Get User Input -----
search_query = input("Enter a city, ZIP code, or neighborhood: ")

# ----- Launch Undetected Chrome -----
options = uc.ChromeOptions()
options.add_argument("--disable-blink-features=AutomationControlled")  # Helps avoid detection
driver = uc.Chrome(options=options)

driver.get("https://www.redfin.com")

# ----- Human-like pause after page load -----
time.sleep(random.uniform(2, 5))

# ----- Find the search box -----
search_box = WebDriverWait(driver, 15).until(
    EC.presence_of_element_located((By.ID, "search-box-input"))
)
search_box.clear()

# ----- Random scroll down a bit -----
driver.execute_script("window.scrollBy(0, 100);")
time.sleep(random.uniform(1, 2))

# ----- Simulate human typing -----
for character in search_query:
    search_box.send_keys(character)
    time.sleep(random.uniform(0.15, 0.4))  # Random typing speed

# ----- Move mouse to the search box -----
actions = ActionChains(driver)
actions.move_to_element(search_box).perform()

# ----- Random pause before hitting Enter -----
time.sleep(random.uniform(2, 4))

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

print("Found rentals URL:", resulting_url)

driver.quit()

# ----- Start Scrapy Spider -----
subprocess.run([
    "scrapy",
    "crawl",
    "homes",
    "-a",
    f"start_url={resulting_url}",
    "-O",
    "rental_listings.json"
])
