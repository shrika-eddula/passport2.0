"""
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup


# Set up options to make Chrome run headless
chrome_options = Options()
chrome_options.add_argument("--headless")  # Ensures headless mode
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

# Initialize the WebDriver (Chrome in this case)
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

# Fetch the desired URL
url = "https://cnn.com"  # Replace with the URL you want to scrape
driver.get(url)

# Get the page source (HTML)
html = driver.page_source
soup = BeautifulSoup(driver.page_source, 'html.parser')

x, y = 100, 200
element = driver.execute_script(f"return document.elementFromPoint({x}, {y});")
print(element)

#title = soup.select_one('h1').html
text = soup.select_one('p').html
link = soup.select_one('a').get('href')

# Print or process the HTML as needed

# Quit the browser
driver.quit()
"""

from lavague.core import  WorldModel, ActionEngine
from lavague.core.agents import WebAgent
from lavague.drivers.selenium import SeleniumDriver
from lavague.contexts.openai import OpenaiContext

# Initialize Context
context = OpenaiContext(llm="gpt-3.5-turbo", mm_llm="gpt-3.5-turbo")

selenium_driver = SeleniumDriver(headless=False)
world_model = WorldModel()
action_engine = ActionEngine(selenium_driver)
agent = WebAgent(world_model, action_engine)
agent.get("https://google.com")
agent.run("Go to amazon and find iphone 15 cases sorted by best seller.")

# Launch Gradio Agent Demo
agent.demo("Go to amazon and find iphone 15 cases sorted by best seller")