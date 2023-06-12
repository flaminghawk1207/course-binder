import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import constants as const
import login
from selenium.webdriver.common.alert import Alert

def chat(adminName, adminPassword, url, shouldFail = False):
    try:
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        login.fillLoginCredentials(driver, adminName, adminPassword, url)

        driver.implicitly_wait(40)

        driver.find_element(By.ID,"LABCSE1").click()
        driver.find_element(By.ID, "chatButton").click()
        driver.find_element(By.ID, "chatTypeMessage").send_keys("Test Message. " + time.ctime())

        driver.find_element(By.ID, "chatSendButton").click()
        driver.find_element(By.ID, "chatRefreshButton").click()

        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        time.sleep(5)

        print("Chat sent successfully!!")
        if (not shouldFail):
            print("TEST CASE PASSED")

    except Exception as exp:
        print("Error: ", exp)
        if (not shouldFail):
            print("TEST CASE FAILED")
        else:
            print("TEST CASE PASSED")

    return

def main():
    chat(const.FACULTY_USER, const.FACULTY_PASSWORD, const.BASE_URL, shouldFail=False)


if  __name__ == "__main__":
    main()