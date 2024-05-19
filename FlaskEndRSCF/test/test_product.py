import pytest
from api import product
from api import role

@pytest.mark.parametrize("productId", [
    ("d72c920f-7578-11ee-a0d4-a402b97fc582"),
    (20),
    (''),
])

def test_getSomeProduct(productId):
    assert product.getSomeProduct(productId)  

def test_getSomeProduct():
    assert product.getSomeProduct("d72c920f-7578-11ee-a0d4-a402b97fc582")  

def test_getSomeRole():
    assert role.getSomeRole("sa")  
    
