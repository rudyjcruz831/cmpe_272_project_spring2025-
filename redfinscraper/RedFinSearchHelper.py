import time, random, subprocess, sys, os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException, WebDriverException

def setup_driver():
    options = webdriver.ChromeOptions()
    options.headless = True
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)

    # Additional stealth settings
    options.add_argument("--disable-notifications")
    options.add_argument("--disable-popup-blocking")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-infobars")
    
    # Spoof a real user-agent
    ua = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
          "AppleWebKit/537.36 (KHTML, like Gecko) "
          "Chrome/122.0.0.0 Safari/537.36")
    options.add_argument(f"user-agent={ua}")

    try:
        driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=options
        )
        # Set page load timeout
        driver.set_page_load_timeout(30)
        return driver
    except Exception as e:
        print(f"Error setting up Chrome driver: {e}")
        sys.exit(1)

def perform_search(driver, search_query):
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            driver.get("https://www.redfin.com")
            time.sleep(random.uniform(2, 4))

            # Wait for search box and clear it
            search_box = WebDriverWait(driver, 30).until(
                EC.presence_of_element_located((By.ID, "search-box-input"))
            )
            search_box.clear()
            time.sleep(random.uniform(0.5, 1.0))

            # Type the search query with human-like delays
            for ch in search_query:
                search_box.send_keys(ch)
                time.sleep(random.uniform(0.1, 0.25))

            # Move mouse to element and click
            ActionChains(driver).move_to_element(search_box).perform()
            time.sleep(random.uniform(1.2, 2.2))
            search_box.send_keys(Keys.RETURN)

            # Wait for results with increased timeout
            WebDriverWait(driver, 45).until(
                EC.presence_of_element_located((
                    By.CSS_SELECTOR, "div.HomeCardContainer, div.RentalHomeCardContainer"
                ))
            )

            # Add some scrolling to simulate human behavior
            driver.execute_script("window.scrollBy(0, 300);")
            time.sleep(random.uniform(2, 3))

            url = driver.current_url
            if "/apartments-for-rent" not in url:
                url = url.rstrip("/") + "/apartments-for-rent"
            
            return url

        except TimeoutException:
            print(f"Timeout on attempt {retry_count + 1} of {max_retries}")
            retry_count += 1
            if retry_count == max_retries:
                raise
            time.sleep(random.uniform(5, 10))  # Wait before retrying
            
        except WebDriverException as e:
            print(f"WebDriver error on attempt {retry_count + 1}: {e}")
            retry_count += 1
            if retry_count == max_retries:
                raise
            time.sleep(random.uniform(5, 10))

def main():
    # Argument parsing
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

    driver = None
    try:
        # Setup and run search
        driver = setup_driver()
        url = perform_search(driver, search_query)

        # Launch Scrapy spider
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

    except Exception as e:
        print(f"Error occurred: {e}")
        sys.exit(1)
    finally:
        if driver:
            try:
                driver.quit()
            except:
                pass  # Ignore errors during cleanup

if __name__ == "__main__":
    main()
