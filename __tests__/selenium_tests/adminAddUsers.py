from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import constants as const
from selenium.webdriver.common.alert import Alert


def addUser():
    # channelNameAutoComplete
    return

def main():
    url = const.BASE_URL
    # createChannel("jayanthmenon007@gmail.com","Hello@12345", "selenium test subject", "", "Selenium Test", "course", "II", url)
    addUser("jayanthmenon007@gmail.com","Hello@12345", "selenium subject", "19SEL12212", "Selenium Test 1", "lab", "I", url)

if __name__ == "__main__":
    main()