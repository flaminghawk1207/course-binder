import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import constants as const
import login
from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.common.alert import Alert
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import UnexpectedAlertPresentException


def press_keys(driver, *args):
    actions = ActionChains(driver)
    for key in args:
        actions.send_keys(key)
    actions.perform()

def createChannel(adminName, adminPassword, channelName, channelCode, department, type_value, year, url):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    login.fillLoginCredentials(driver, adminName, adminPassword, url)

    driver.implicitly_wait(20)

    driver.find_element(By.ID,"Manage Channels").click()
    driver.find_element(By.ID,"createChannelDialogButton").click()

    driver.find_element(By.ID,"channelName").send_keys(channelName)
    driver.find_element(By.ID,"channelCode").send_keys(channelCode)
    driver.find_element(By.ID,"departmentName").send_keys(department)

    if type_value == "course":
        driver.find_element(By.ID,"channelTypeSelect").click()
        press_keys(driver, Keys.UP, Keys.ENTER)

        if year == "I":
            driver.find_element(By.ID,"channelYearSelect").click()
            press_keys(driver, Keys.UP, Keys.ENTER)
        elif year == "II":
            driver.find_element(By.ID,"channelYearSelect").click()
            press_keys(driver, Keys.DOWN, Keys.ENTER)
        elif year == "III":
            driver.find_element(By.ID,"channelYearSelect").click()
            press_keys(driver, Keys.DOWN, Keys.DOWN, Keys.ENTER)
        elif year == "IV":
            driver.find_element(By.ID,"channelYearSelect").click()
            press_keys(driver, Keys.DOWN, Keys.DOWN, Keys.DOWN, Keys.ENTER)
        else:
            print("Invalid Year Value")


    elif type_value == "lab":
        driver.find_element(By.ID,"channelTypeSelect").click()
        press_keys(driver, Keys.DOWN, Keys.ENTER)
        time.sleep(2)

    time.sleep(2)

    try:
        driver.find_element(By.ID,"createChannelButton").click()
        time.sleep(2)

    except UnexpectedAlertPresentException as e:
        alert_text = e.alert_text
        print("Unexpected alert opened:", alert_text)
        press_keys(Keys.ENTER)

    except UnexpectedAlertPresentException:  # type: ignore[call-arg]
        pass

    try:
        driver.find_element(By.CSS_SELECTOR,".mui-style-6ebt62-MuiFormHelperText-root.Mui-error")
    except:
        print(channelName, "Created!!")
        print("TESTCASE PASSED!!")
    else:
        print(driver.find_element(By.CSS_SELECTOR,".mui-style-6ebt62-MuiFormHelperText-root.Mui-error").text)

    

def main():
    # url = const.BASE_URL
    # createChannel(const.ADMIN_USER, const.ADMIN_PASSWORD, const.TEST_COURSE_NAME, const.TEST_CHANNEL_CODE, "", "course", "III", url)
    # createChannel(const.ADMIN_USER, const.ADMIN_PASSWORD, const.TEST_COURSE_NAME, const.TEST_CHANNEL_CODE, const.TEST_CHANNEL_DEPARTMENT, "course", "III", const.BASE_URL)
    createChannel(const.ADMIN_USER, const.ADMIN_PASSWORD, const.TEST_LAB_NAME, const.TEST_CHANNEL_CODE, const.TEST_CHANNEL_DEPARTMENT, "lab", "", const.BASE_URL)

if __name__ == "__main__":
    main()