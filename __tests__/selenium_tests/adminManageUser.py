import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import constants as const

def createUser(firstName, lastName, email, password, role, url):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.get(url)

    time.sleep(1)
    driver.find_element(By.ID,"Manage Users").click()
    time.sleep(1)
    driver.find_element(By.ID,"createUserDialogButton").click()
    time.sleep(1)

    driver.find_element(By.ID,":r7:").send_keys(firstName)
    driver.find_element(By.ID,":r9:").send_keys(lastName)
    driver.find_element(By.ID,":rb:").send_keys(email)
    driver.find_element(By.ID,":rd:").send_keys(password)
    driver.find_element(By.ID,"mui-component-select-role").send_keys(role)
    driver.find_element(By.ID,"createUserButton").click()
    time.sleep(2) 

    try:
        time.sleep(1)
        # driver.find_element(By.ID,":r1f:-helper-text")
        driver.find_element(By.CSS_SELECTOR,".css-k4qjio-MuiFormHelperText-root.Mui-error")

    except:
        print("User Created Successfully")

    else:
        print(driver.find_element(By.CSS_SELECTOR,".css-k4qjio-MuiFormHelperText-root.Mui-error").text)
    
    time.sleep(1)


def main():
    url = const.BASE_URL + '/admin'
    createUser("testF", "", "test1@selenium.com", "qwerty12345", "faculty", url)
    createUser("testF", "testL", "test1@selenium", "qwerty12345", "faculty", url)
    createUser("testF", "testL", "test1@selenium.com", "qwerty12345", "faculty", url)
    createUser("testF", "testL", "test1@selenium.com", "Qwerty@12345", "faculty", url)

if __name__ == "__main__":
    main()