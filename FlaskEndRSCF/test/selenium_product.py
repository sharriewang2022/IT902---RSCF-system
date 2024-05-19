from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

def test_components():
    browserDriver = webdriver.Edge
    browserDriver.maximize_window()

    # start test react project
    browserDriver.get("http://localhost:3000")

    title = browserDriver.title
    print("title:" + title)
    assert title == "Web react system"
 
    # build waiting strategy
    browserDriver.implicitly_wait(0.5)

    text_element = browserDriver.find_element(by=By.NAME, value="Product Name")
    submit_button = browserDriver.find_element(by=By.CSS_SELECTOR, value="button")
    #set value to text
    text_element.send_keys("Add Product")
    submit_button.click()

    # get input
    input_element = browserDriver.find_element_by_xpath('//input[@id="price"]')
    # product price
    input_element.send_keys("200")

    message_element  = browserDriver.find_element(by=By.ID, value="productID")
    value = message_element.text
    assert value == "Add product successfully!"
 
    browserDriver.quit()

#test click
def test_click(self):
    self.driver.get("http://localhost:3000")
    element_click = self.driver.find_element(By.XPATH,"//input[@value='product items']")
    element_double_click = self.driver.find_element(By.XPATH,"//input[@value='dbl click me']")
    element_right_click = self.driver.find_element(By.XPATH,"//input[@value='right click me']")
    action=self.driver.ActionChains(self.driver)
    action.click(element_click)
    action.double_click(element_double_click)
    action.context_click(element_right_click)
    action.perform() 

 