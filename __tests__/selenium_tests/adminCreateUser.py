import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import constants as const
import login
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import UnexpectedAlertPresentException


def press_keys(driver, *args):
    actions = ActionChains(driver)
    for key in args:
        actions.send_keys(key)
    actions.perform()

def createUser(adminName, adminPassword, firstName, lastName, email, password, role, department, url):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    login.fillLoginCredentials(driver, adminName, adminPassword, url)

    driver.implicitly_wait(20)

    driver.find_element(By.ID,"Manage Users").click()
    driver.find_element(By.ID,"createUserDialogButton").click()

    driver.find_element(By.ID,"firstName").send_keys(firstName)
    driver.find_element(By.ID,"lastName").send_keys(lastName)
    driver.find_element(By.ID,"emailTextField").send_keys(email)
    driver.find_element(By.ID,"passwordTextField").send_keys(password)
    driver.find_element(By.ID,"roleSelect").send_keys(role)

    if role == "admin":
        driver.find_element(By.ID,"roleSelect").click()
        press_keys(driver, Keys.UP, Keys.ENTER)
    elif role == "pricipal":
        driver.find_element(By.ID,"roleSelect").click()
        press_keys(driver, Keys.DOWN, Keys.ENTER)
    elif role == "hod":
        driver.find_element(By.ID,"roleSelect").click()
        press_keys(driver, Keys.DOWN, Keys.DOWN, Keys.ENTER)
    elif role == "faculty":
        driver.find_element(By.ID,"roleSelect").click()
        press_keys(driver, Keys.DOWN, Keys.DOWN, Keys.DOWN, Keys.ENTER)

    if (role == "hod" or role == "faculty"):
        driver.find_element(By.ID, "departmentTextField").send_keys(department)
        time.sleep(2)

    time.sleep(2)

    try:
        driver.find_element(By.ID,"createUserButton").click()
        time.sleep(4)
    except UnexpectedAlertPresentException as e:
        alert_text = e.alert_text
        print("Unexpected alert opened:", alert_text)
        press_keys(Keys.ENTER)
    except UnexpectedAlertPresentException:  # type: ignore[call-arg]
        pass 

    try:
        driver.find_element(By.CSS_SELECTOR,".mui-style-6ebt62-MuiFormHelperText-root.Mui-error")
    except:
        print("User has been created")
        print("TEST CASE PASSED!")
        pass
    else:
        print(driver.find_element(By.CSS_SELECTOR,".mui-style-6ebt62-MuiFormHelperText-root.Mui-error").text)



def main():
    url = const.BASE_URL
    # createUser(const.ADMIN_USER, const.ADMIN_PASSWORD, "", "TEST", "TEST@gma.com", "Test@12345", "admin", "TEST DEPARTMENT", url)
    # createUser(const.ADMIN_USER, const.ADMIN_PASSWORD, "TEST", "TEST", "TEST.com", "Test@12345", "admin", "TEST DEPARTMENT", url)
    createUser(const.ADMIN_USER, const.ADMIN_PASSWORD, "TEST", "TEST", "TEST@gma.com", "Test@12345", "admin", "TEST DEPARTMENT", url)

if __name__ == "__main__":
    main()