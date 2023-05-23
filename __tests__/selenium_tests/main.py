import constants, login, forgotPassword, adminCreateChannels, adminAddChannels, adminAddUsers, adminCreateUser
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import constants as const
from selenium.webdriver.common.alert import Alert

def main ():

    # -------- TESTING LOGIN --------
    print ("LOGIN TESTING")

    print("---------------------------")
    print("TEST 1: Empty Email Address")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    login.fillLoginCredentials(driver,"","Anish@1207",const.BASE_URL)
    driver.close()

    print("---------------------------")
    print("TEST 2: Invalid Email Address")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    login.fillLoginCredentials(driver,"jayantasd","Anish@1207",const.BASE_URL)
    driver.close()

    print("---------------------------")
    print("TEST 3: Invalid Password")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    login.fillLoginCredentials(driver,const.ADMIN_USER,"Anish@1207",const.BASE_URL)
    driver.close()

    print("---------------------------")
    print("TEST 4: Correct Credentials")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    login.fillLoginCredentials(driver,const.ADMIN_USER, const.ADMIN_PASSWORD,const.BASE_URL)
    driver.close()

    print("\n")


    # ----- FORGOT PASSWORD --------
    print("FORGOT PASSWORD TESTING")
    
    print("---------------------------")
    print("TEST 1: Invalid Email")
    forgotPassword.forgotPassword("asdsd", const.BASE_URL)
        
    print("---------------------------")
    print("TEST 2: Unregistered Email")
    forgotPassword.forgotPassword("randomperson@gmail.com", const.BASE_URL)
        
    print("---------------------------")
    print("TEST 3: Valid Email")
    forgotPassword.forgotPassword(const.ADMIN_USER, const.BASE_URL)

    print("\n")


    # # --------- CREATE CHANNEL -----------
    print("ADMIN CREATE CHANNEL")

    print("---------------------------")
    print("Test 1: Empty Input")
    adminCreateChannels.createChannel(const.ADMIN_USER, const.ADMIN_PASSWORD, const.TEST_COURSE_NAME, const.TEST_CHANNEL_CODE, "", "course", "III", const.BASE_URL)

    print("---------------------------")
    print("Test 2: Course Creation")
    adminCreateChannels.createChannel(const.ADMIN_USER, const.ADMIN_PASSWORD, const.TEST_COURSE_NAME, const.TEST_CHANNEL_CODE, const.TEST_CHANNEL_DEPARTMENT, "course", "III", const.BASE_URL)

    print("---------------------------")
    print("Test 3: Lab Creation")
    adminCreateChannels.createChannel(const.ADMIN_USER, const.ADMIN_PASSWORD, const.TEST_LAB_NAME, const.TEST_CHANNEL_CODE, const.TEST_CHANNEL_DEPARTMENT, "lab", "", const.BASE_URL)


    # ---------- CREATE USER -------------
    print("ADMIN CREATE USER")

    print("---------------------------")
    print("Test 1: Empty Input")
    adminCreateUser.createUser(const.ADMIN_USER, const.ADMIN_PASSWORD, "", "TEST", "TEST.com", "Test@12345", "admin", "TEST DEPARTMENT", const.BASE_URL)
    
    print("---------------------------")
    print("Test 2: Invalid Input")
    adminCreateUser.createUser(const.ADMIN_USER, const.ADMIN_PASSWORD, "TEST", "TEST", "TEST.com", "Test@12345", "admin", "TEST DEPARTMENT", const.BASE_URL)
    
    print("---------------------------")
    print("Test 3: Valid Input")
    adminCreateUser.createUser(const.ADMIN_USER, const.ADMIN_PASSWORD, "TEST", "TEST", "TEST.@gmail.com", "Test@12345", "admin", "TEST DEPARTMENT", const.BASE_URL)

    print("\n")


    # ------------ ADD USERS TO CHANNEL ------------
    print("ADD USERS TO CHANNEL")

    print("---------------------------")
    print("Test 1: Empty Input")
    adminAddUsers.addUser(const.ADMIN_USER, const.ADMIN_PASSWORD, "", "Lakshya", "course_mentor", const.BASE_URL)

    print("---------------------------")
    print("Test 2: Valid Input")
    adminAddUsers.addUser(const.ADMIN_USER, const.ADMIN_PASSWORD, "POPL", "Lakshya", "course_mentor", const.BASE_URL)

    print("\n")


    # ----------- ADD CHANNEL TO USERS ------------
    print("ADD CHANNEL TO USERS")
    print("---------------------------")
    print("Test 1: Empty Input")
    adminAddChannels.addChannel(const.ADMIN_USER, const.ADMIN_PASSWORD, "", "POPL", "course_mentor", const.BASE_URL)
    
    print("---------------------------")
    print("Test 2: Valid Input")
    adminAddChannels.addChannel(const.ADMIN_USER, const.ADMIN_PASSWORD, "Lakshya", "POPL", "course_mentor", const.BASE_URL)

    return


if __name__ == "__main__":
    main()
    