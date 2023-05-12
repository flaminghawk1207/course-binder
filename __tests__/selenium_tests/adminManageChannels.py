import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import constants as const

def createChannel(channelName, channelCode, department, url):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.get(url)

    time.sleep(1)
    driver.find_element(By.ID,"Manage Channels").click()
    time.sleep(1)
    driver.find_element(By.ID,"createChannelDialogButton").click()
    time.sleep(1)

    driver.find_element(By.ID,"channelName").send_keys(channelName)
    driver.find_element(By.ID,"channelCode").send_keys(channelCode)
    driver.find_element(By.ID,"departmentName").send_keys(department)
    driver.find_element(By.ID,"createChannelButton").click()
    time.sleep(2) 

    try:
        time.sleep(1)
        # driver.find_element(By.ID,":r1f:-helper-text")
        driver.find_element(By.CSS_SELECTOR,".css-k4qjio-MuiFormHelperText-root.Mui-error")

    except:
        print("Channel Created Successfully")

    else:
        print(driver.find_element(By.CSS_SELECTOR,".css-k4qjio-MuiFormHelperText-root.Mui-error").text)
    
    time.sleep(1)


def main():
    url = const.BASE_URL + '/admin'
    createChannel("selenium test subject", "", "Selenium Test", url)
    createChannel("selenium test subject", "19SEL123", "Selenium Test", url)

if __name__ == "__main__":
    main()