import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import constants as const
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
from selenium.common.exceptions import UnexpectedAlertPresentException
import login
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def press_keys(driver, *args):
    actions = ActionChains(driver)
    for key in args:
        actions.send_keys(key)
    actions.perform()

def uploadFile(adminName, adminPassword, url, filepath, shouldFail=False):
    try:
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        login.fillLoginCredentials(driver, adminName, adminPassword, url)

        driver.implicitly_wait(40)

        driver.find_element(By.ID,"LABCSE1").click()

        driver.find_element(By.ID, "fileDownloadButton").click()
        time.sleep(3)
        print("File Download Successful!!")

        driver.find_element(By.ID, "fileDeleteButton").click()
        time.sleep(3)
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        # Switch to the alert and handle it
        alert = driver.switch_to.alert
        alert.accept()
        print("File Deletion Successful!!")

        # click refresh  
        driver.find_element(By.ID, "refreshDirectoryButton").click()
        time.sleep(2)

        driver.find_element(By.ID, "uploadFileButton").click()
        time.sleep(2)
        driver.find_element(By.ID, "fileDropZone").send_keys(filepath)
        time.sleep(2)
        driver.find_element(By.ID, "fileUploadSubmit").click()
        time.sleep(5)
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        # Switch to the alert and handle it
        alert = driver.switch_to.alert
        alert.accept()
        time.sleep(10)
        print("File Uploaded Successully!!")
        
        if (not shouldFail):
            print("TEST CASE PASSED")
    
    except Exception as e:
        print("Error:", e)
        if (not shouldFail):
            print("TEST CASE FAILED")
        else:
            print("TEST CASE PASSED")

def main():
    filepath = "C:/Users/jayan/OneDrive/Pictures/amrita/sem6/19CSE314 Software Engineering/Project/course-binder/__tests__/selenium_tests/sample files/Faculty_details.xlsx"
    uploadFile(const.FACULTY_USER, const.FACULTY_PASSWORD, const.BASE_URL, filepath, shouldFail=False)
    
if __name__ == "__main__":
    main()