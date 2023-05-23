import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import constants as const
from selenium.webdriver.common.alert import Alert

def fillLoginCredentials(driver,username, password, url, shouldFail = False):
    driver.get(url)
    driver.implicitly_wait(20)

    email_elem = driver.find_element(By.NAME, "email").send_keys(username)
    pass_elem = driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.CSS_SELECTOR,"button, [type=\'button\'], [type=\'reset\'], [type=\'submit\']").click()

    try:
        print(driver.find_element(By.CSS_SELECTOR, ".mui-style-1himidv-MuiFormHelperText-root.Mui-error").text)
        if shouldFail:
            print("TEST CASE PASSED!")
        else:
            print("TEST CASE FAILED!")

    except:
        try:
            alert = Alert(driver)
            print(alert.text)
            alert.accept()
        except:
            print("Logged in Successfully using Username:", username,"Password:",password)
        print("TEST CASE PASSED!")

def main():
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    fillLoginCredentials(driver,"","Anish@1207",const.BASE_URL, shouldFail=True)
    driver.close()

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    fillLoginCredentials(driver,"jayantasd","Anish@1207",const.BASE_URL, shouldFail=True)
    driver.close()

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    fillLoginCredentials(driver,const.ADMIN_USER,const.ADMIN_PASSWORD,const.BASE_URL)
    driver.close()
    

if __name__ == "__main__":
    main()