import time, random, subprocess, sys, os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

# ————————————————
# 1) Argument parsing
# ————————————————
if len(sys.argv) > 1:
    search_query = sys.argv[1]
else:
    search_query = input("Enter a city, ZIP code, or neighborhood: ")

output_file = sys.argv[2] if len(sys.argv) > 2 else "rental_listings.json"
if len(sys.argv) > 3:
    scrapy_project_dir = os.path.abspath(sys.argv[3])
else:
    print("ERROR: No Scrapy project directory provided. Exiting.")
    sys.exit(1)

# ————————————————
# 2) Configure headless Chrome + stealth flags
# ————————————————
options = webdriver.ChromeOptions()
options.headless = True
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

# Stealth flags
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option('useAutomationExtension', False)

# Spoof a real user‐agent
ua = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
      "AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/122.0.0.0 Safari/537.36")
options.add_argument(f"user-agent={ua}")

# Install or update ChromeDriver via webdriver_manager
driver = webdriver.Chrome(
    service=Service(ChromeDriverManager().install()),
    options=options
)

# ————————————————
# 3) Automate Redfin search
# ————————————————
driver.get("https://www.redfin.com")
time.sleep(random.uniform(1.5, 3.0))

search_box = WebDriverWait(driver, 30).until(
    EC.presence_of_element_located((By.ID, "search-box-input"))
)
search_box.clear()

# human‐like typing
for ch in search_query:
    search_box.send_keys(ch)
    time.sleep(random.uniform(0.1, 0.25))

ActionChains(driver).move_to_element(search_box).perform()
time.sleep(random.uniform(1.2, 2.2))
search_box.send_keys(Keys.RETURN)

time.sleep(random.uniform(1, 3))
driver.execute_script("window.scrollBy(0, 50);")

# wait for results
WebDriverWait(driver, 30).until(
    EC.presence_of_element_located((By.CSS_SELECTOR,
        "div.HomeCardContainer, div.RentalHomeCardContainer"))
)

# grab the final URL
url = driver.current_url
if "/apartments-for-rent" not in url:
    url = url.rstrip("/") + "/apartments-for-rent"

driver.quit()

# ————————————————
# 4) Launch Scrapy spider with that URL
# ————————————————
result = subprocess.run([
    "scrapy", "crawl", "homes",
    "-a", f"start_url={url}",
    "-O", output_file
], cwd=scrapy_project_dir,
   capture_output=True, text=True)

print("Scrapy stdout:\n", result.stdout)
print("Scrapy stderr:\n", result.stderr)
if result.returncode:
    print("Scrapy failed.")
    sys.exit(result.returncode)
else:
    print("Scraping completed successfully.")
