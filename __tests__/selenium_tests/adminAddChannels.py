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


def addChannel(adminName, adminPassword, username, channelName, channelRole, url):
    try:
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        login.fillLoginCredentials(driver, adminName, adminPassword, url)

        driver.implicitly_wait(10)

        driver.find_element(By.ID, "Manage Users").click()
        driver.find_element(By.ID, "searchUsersAutoComplete").send_keys(username)
        time.sleep(2)
        driver.find_element(By.ID, "searchUsersAutoComplete").send_keys(Keys.ARROW_DOWN, Keys.ENTER)
        driver.find_element(By.ID, "addUserChannel").click()
        driver.find_element(By.ID, "channelNameAutoComplete").send_keys(channelName)
        time.sleep(2)
        driver.find_element(By.ID, "channelNameAutoComplete").send_keys(Keys.ARROW_DOWN, Keys.ENTER)

        if channelRole == "faculty":
            driver.find_element(By.ID, "channelRoleSelect").send_keys(Keys.ARROW_DOWN, Keys.ENTER)
        elif channelRole == "course_mentor":
            driver.find_element(By.ID, "channelRoleSelect").send_keys(Keys.ARROW_DOWN, Keys.ARROW_DOWN, Keys.ENTER)

        time.sleep(1)
        driver.find_element(By.ID, "submitAddChannel").click()
        time.sleep(3)
        try:
            alert = Alert(driver)
            if (alert.text == "Add " + username + " to " + channelName + "?"):    
                alert.accept()
                alert = Alert(driver)
                print(username, "added to", channelName)
            else:
                print("Error:", alert.text)

        except:
            print(username, "not added to", channelName)

    except:
        print(username, "not addded to", channelName)

    return

def main():
    url = const.BASE_URL
    addChannel(const.ADMIN_USER, const.ADMIN_PASSWORD, "Lakshya", "POPL", "", url)
    addChannel(const.ADMIN_USER, const.ADMIN_PASSWORD, "Lakshya", "POPL", "course_mentor", url)

if __name__ == "__main__":
    main()