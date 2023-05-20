import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import constants as const
import login
from selenium.webdriver.common.alert import Alert

def createChannel(adminName, adminPassword, channelName, channelCode, department, type_value, year, url):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    login.fillLoginCredentials(driver, adminName, adminPassword, url)

    driver.implicitly_wait(20)

    # time.sleep(1)
    driver.find_element(By.ID,"Manage Channels").click()
    # time.sleep(1)
    driver.find_element(By.ID,"createChannelDialogButton").click()
    # time.sleep(1)

    driver.find_element(By.ID,"channelName").send_keys(channelName)
    driver.find_element(By.ID,"channelCode").send_keys(channelCode)
    driver.find_element(By.ID,"departmentName").send_keys(department)
    driver.find_element(By.ID,"channelTypeSelect").send_keys(type_value)
    driver.find_element(By.ID, "channelYearSelect").send_keys(year)
    driver.find_element(By.ID,"createChannelButton").click()
    # time.sleep(2) 

    try:
        # time.sleep(1)
        driver.find_element(By.CSS_SELECTOR,".css-k4qjio-MuiFormHelperText-root.Mui-error")
    except:
        try:
            # time.sleep(3)
            alert = Alert(driver)
            if (alert.text == "Channel created successfully"):
                print("Channel Created Successfully")
            else:
                print("Error:", alert.text)
            alert.accept()
        except:
            print("Channel Not Created")
    else:
        print(driver.find_element(By.CSS_SELECTOR,".css-k4qjio-MuiFormHelperText-root.Mui-error").text)
    
    # time.sleep(1)


def main():
    url = const.BASE_URL
    # createChannel("jayanthmenon007@gmail.com","Hello@12345", "selenium test subject", "", "Selenium Test", "course", "II", url)
    createChannel("jayanthmenon007@gmail.com","Hello@12345", "selenium subject", "19SEL12212", "Selenium Test 1", "lab", "I", url)

if __name__ == "__main__":
    main()