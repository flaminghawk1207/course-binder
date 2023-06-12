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

def taskCheck(adminName, adminPassword, url, shouldFail=False):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    login.fillLoginCredentials(driver, adminName, adminPassword, url)

    driver.implicitly_wait(40)

    driver.find_element(By.ID,"19CSE312").click()
    driver.find_element(By.ID,"taskButton").click()
    time.sleep(2)

    # Creating new task
    driver.find_element(By.ID,"addTaskButton").click()
    driver.find_element(By.ID,"taskNameTextInput").send_keys("Test Task")
    driver.find_element(By.ID,"userNameAutoComplete").send_keys("Jayanth")
    time.sleep(2)
    driver.find_element(By.ID, "userNameAutoComplete").send_keys(Keys.DOWN, Keys.ENTER)

    driver.find_element(By.ID,"datePickerField").click()
    driver.find_element(By.ID,"datePickerField").send_keys(("06/13/2024 12:00 AM"))
    driver.find_element(By.ID,"addTaskSubmitButton").click()
    time.sleep(3)

    # view tasks
    driver.find_element(By.ID,"myTasksButton").click()
    time.sleep(3)

    # delete the new task
    driver.find_element(By.ID,"manageTasksButton").click()
    time.sleep(3)
    driver.find_element(By.ID,"deleteTask").click()
    
    pass

def main():
    taskCheck(const.FACULTY_USER, const.FACULTY_PASSWORD, const.BASE_URL, shouldFail=False)

if __name__=="__main__":
    main()