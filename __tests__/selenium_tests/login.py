import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import constants as const

def fillLoginCredentials(username, password, url):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.get(url)
    time.sleep(2)

    email_elem = driver.find_element(By.NAME, "email").send_keys(username)
    pass_elem = driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.CSS_SELECTOR,"button, [type=\'button\'], [type=\'reset\'], [type=\'submit\']").click()

    print("Logged in Successfully using Username:", username,"Password:",password)
    time.sleep(5)


def main():
    fillLoginCredentials("jayanthmenons@gmail.com","qwerty12345",const.BASE_URL)
    fillLoginCredentials("jayanthmenons@gmail.com","qwerty1234",const.BASE_URL)
    # fillLoginCredentials("anishayyagari@gmail.com","Anish@1207",url)
    # fillLoginCredentials("anishayyagari@gmail.com","Anish7",url)
    

if __name__ == "__main__":
    main()