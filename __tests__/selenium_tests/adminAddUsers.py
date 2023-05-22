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
    try:
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        login.fillLoginCredentials(driver, adminName, adminPassword, url)

        driver.implicitly_wait(10)

        driver.find_element(By.ID, "Manage Channels").click()
        driver.find_element(By.ID, "searchChannelAutoComplete").send_keys(channelName)
        time.sleep(2)
        driver.find_element(By.ID, "searchChannelAutoComplete").send_keys(Keys.DOWN, Keys.ENTER)
        driver.find_element(By.ID, "addUserChannel").click()

        driver.find_element(By.ID, "userNameAutoComplete").click()
        time.sleep(2)
        driver.find_element(By.ID, "userNameAutoComplete").send_keys(userName)
        # time.sleep(2)
        driver.find_element(By.ID, "userNameAutoComplete").send_keys(Keys.ARROW_DOWN, Keys.ENTER)
        time.sleep(2)

        if (channelRole == "faculty"):
            driver.find_element(By.ID, "channelRoleSelect").send_keys(Keys.DOWN, Keys.ENTER)
        elif (channelRole == "course_mentor"):
            driver.find_element(By.ID, "channelRoleSelect").send_keys(Keys.DOWN, Keys.DOWN, Keys.ENTER)
        time.sleep(2)

        driver.find_element(By.ID, "submitAddUser").click()

        try:
            alert = Alert(driver)
            if (alert.text == "Add " + userName + " to " + channelName + "?"):    
                alert.accept()
                time.sleep(2)
                if (alert.text == "User added to channel successfully"):
                    print (userName, "has been added to", channelName, "as", channelRole)
                alert.accept()
            else:
                print(userName, "not addded to", channelName)
    
        except:
            print(userName, "not addded to", channelName)

    except:
        print(userName, "not addded to", channelName)

    return

def main():
    url = const.BASE_URL
    addUser(const.ADMIN_USER, const.ADMIN_PASSWORD, "", "Lakshya", "course_mentor", url)
    addUser(const.ADMIN_USER, const.ADMIN_PASSWORD, "POPL", "Lakshya", "course_mentor", url)

if __name__ == "__main__":
    main()