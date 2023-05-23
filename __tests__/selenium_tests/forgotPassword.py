import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import constants as const
from selenium.webdriver.common.alert import Alert

def forgotPassword(email_value,url, shouldFail=False):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.get(url)

    time.sleep(2)
    driver.find_element(By.ID,"forgotPasswordLink").click()

    time.sleep(2)
    driver.find_element(By.NAME,"email").send_keys(email_value)
    driver.find_element(By.CSS_SELECTOR,"button, [type='button'], [type='reset'], [type='submit']").click()

    try:
        driver.find_element(By.CLASS_NAME,"text-red-700")
    except:
        try:
            time.sleep(3)
            alert = Alert(driver)
            if (alert.text == "auth/user-not-found"):
                print("Email Address '"+email_value+"' not registered")
                if shouldFail:
                    print("TEST CASE PASSED!")
                else:
                    print("TEST CASE FAILED!")
            elif (alert.text == "Please find the reset link sent to your mail"):
                print("Reset Password Link sent to", email_value)
                print("TEST CASE PASSED!")
            elif shouldFail:
                print("Error:", alert.text)
                print("TEST CASE PASSED!")
            else:
                print("Error:", alert.text)
                print("TEST CASE FAILED!")
            alert.accept()
        except:
            print("Reset Link has been sent to",email_value)
            print("TEST CASE PASSED!")
    else:
        if shouldFail:
            print("TEST CASE PASSED!")
        else:
            print("Invalid Email Address:", email_value)
            print("TEST CASE FAILED!")

    time.sleep(3)

def main():
    forgotPassword("jayanthmenons", const.BASE_URL, shouldFail=True)
    forgotPassword("thsddfsdfss@asdasdasdasd.com", const.BASE_URL, shouldFail=True)
    forgotPassword("jayanthmenons@gmail.com", const.BASE_URL)

if __name__ == "__main__":
    main()