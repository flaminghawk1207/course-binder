import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import constants as const
import login
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support.ui import Select

def createUser(adminName, adminPassword, firstName, lastName, email, password, role, url):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    login.fillLoginCredentials(driver, adminName, adminPassword, url)

    time.sleep(1)
    driver.find_element(By.ID,"Manage Users").click()
    time.sleep(1)
    driver.find_element(By.ID,"createUserDialogButton").click()
    time.sleep(1)

    driver.find_element(By.ID,":r7:").send_keys(firstName)
    driver.find_element(By.ID,":r9:").send_keys(lastName)
    driver.find_element(By.ID,":rb:").send_keys(email)
    driver.find_element(By.ID,":rd:").send_keys(password)
    time.sleep(2)
    driver.find_element(By.ID,"mui-component-select-role").send_keys(role)
    # drop=Select(driver.find_element(By.ID,"roleSelect"))
    # drop.select_by_visible_text("Faculty")
                                
    driver.find_element(By.ID,"createUserButton").click()
    time.sleep(2) 

    try:
        time.sleep(1)
        driver.find_element(By.CSS_SELECTOR,".css-k4qjio-MuiFormHelperText-root.Mui-error")

    except:
        try:
            time.sleep(3)
            alert = Alert(driver)
            if (alert.text == "User created successfully"):
                print("User Created Successfully")
            else:
                print("Error:", alert.text)
            alert.accept()
        except:
            print("User Not Created")        

    else:
        print(driver.find_element(By.CSS_SELECTOR,".css-k4qjio-MuiFormHelperText-root.Mui-error").text)
    
    time.sleep(1)


def main():
    url = const.BASE_URL
    # createUser("jayanthmenon007@gmail.com", "Hello@12345", "testF", "", "test1@selenium.com", "qwerty12345", "faculty", url)
    # createUser("jayanthmenon007@gmail.com", "Hello@12345", "testF", "testL", "test1@selenium", "qwerty12345", "faculty", url)
    # createUser("jayanthmenon007@gmail.com", "Hello@12345", "testF", "testL", "test1@selenium.com", "qwerty12345", "faculty", url)
    createUser("jayanthmenon007@gmail.com", "Hello@12345", "testF2", "testL2", "test1234@selenium.com", "Qwerty@12345", "faculty", url)

if __name__ == "__main__":
    main()