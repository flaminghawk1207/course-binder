# Add Channel component inside Manage Users in admin page

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import constants as const
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.common.keys import Keys
import login
import time


def addUser(adminName, adminPassword, username, channelName, channelRole, url):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    login.fillLoginCredentials(driver, adminName, adminPassword, url)

    driver.implicitly_wait(20)

    driver.find_element(By.ID, "Manage Users").click()
    driver.find_element(By.ID, "searchUsersAutoComplete").send_keys(username)
    driver.find_element(By.ID, "searchUsersAutoComplete").send_keys(Keys.ARROW_DOWN, Keys.ENTER)
    driver.find_element(By.ID, "addUserChannel").click()
    driver.find_element(By.ID, "channelNameAutoComplete").send_keys(channelName)
    driver.find_element(By.ID, "channelNameAutoComplete").send_keys(Keys.DOWN, Keys.ENTER)
    # driver.find_element(By.ID, "channelRoleSelect").send_keys(channelRole)
    driver.find_element(By.ID, "channelRoleSelect").send_keys(Keys.ARROW_DOWN, Keys.ENTER)

    time.sleep(1)
    driver.find_element(By.ID, "submitAddChannel").click()

    try:
        alert = Alert(driver)
        print(alert.text)
        if (alert.text == "Add " + username + " to " + channelName + "?"):    
            alert.accept()
            alert = Alert(driver)
            print(alert.text)
        else:
            print("Error:", alert.text)

    except:
        print("No Alerts")

    return

def main():
    url = const.BASE_URL
    addUser("jayanthmenon007@gmail.com","Hello@12345", "Lakshya", "Software", "faculty", url)

if __name__ == "__main__":
    main()