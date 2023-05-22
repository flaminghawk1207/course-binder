import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import constants as const
from selenium.webdriver.common.alert import Alert

def fillLoginCredentials(driver,username, password, url):
    driver.get(url)
    driver.implicitly_wait(20)

    email_elem = driver.find_element(By.NAME, "email").send_keys(username)
    pass_elem = driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.CSS_SELECTOR,"button, [type=\'button\'], [type=\'reset\'], [type=\'submit\']").click()

    try:
        alert = Alert(driver)
        print(alert.text)
        alert.accept()
    except:
        print("Logged in Successfully using Username:", username,"Password:",password)

def main():
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    fillLoginCredentials(driver,"jayanthmenons@gmail.com","qwerty1234",const.BASE_URL)
    driver.close()

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    fillLoginCredentials(driver,"jayanthmenons@gmail.com","qwerty12345",const.BASE_URL)
    driver.close()
    

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    fillLoginCredentials(driver,"anishayyagari@gmail.com","Anish@1207",const.BASE_URL)
    driver.close()

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    fillLoginCredentials(driver,"anishayyagari@gmail.com","Anish7",const.BASE_URL)
    driver.close()
    

if __name__ == "__main__":
    main()