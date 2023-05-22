# Add User component inside Mangage Channels in admin page

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import constants as const
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.common.keys import Keys
import login
import time


def addUser(adminName, adminPassword, channelName, userName, channelRole, url):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    login.fillLoginCredentials(driver, adminName, adminPassword, url)

    driver.implicitly_wait(20)

    driver.find_element(By.ID, "Manage Channels").click()
    driver.find_element(By.ID, "searchChannelAutoComplete").send_keys(channelName)
    driver.find_element(By.ID, "searchChannelAutoComplete").send_keys(Keys.DOWN, Keys.ENTER)
    driver.find_element(By.ID, "addUserChannel").click()
    driver.find_element(By.ID, "userNameAutoComplete").send_keys(userName)
    time.sleep(2)
    driver.find_element(By.ID, "userNameAutoComplete").send_keys(Keys.DOWN, Keys.ENTER)
    time.sleep(2)
    driver.find_element(By.ID, "channelRoleSelect").send_keys(channelRole)
    time.sleep(2)
    driver.find_element(By.ID, "submitAddUser").click()

    try:
        alert = Alert(driver)
        print(alert.text)
        if (alert.text == "Add " + userName + " to " + channelName + "?"):    
            alert.accept()
            # alert = Alert(driver)
            time.sleep(2)
            print(alert.text)
            alert.accept()
        else:
            print("Error:", alert.text)

    except:
        print("No Alerts")

    return

def main():
    url = const.BASE_URL
    addUser("jayanthmenon007@gmail.com","Hello@12345", "POPL", "Lakshya", "faculty", url)

if __name__ == "__main__":
    main()