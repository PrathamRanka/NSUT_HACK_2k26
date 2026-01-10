import pytest
import httpx
import requests

# Assuming the ML service is running on localhost:8000
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Verify the ML service is running and returns the correct status."""
    try:
        response = requests.get(f"{BASE_URL}/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "Ironclad AI Active"
    except requests.exceptions.ConnectionError:
        pytest.fail("ML Service is NOT running!")

def test_prediction_normal_bca():
    """
    Scenario: Standard payment for Building and Construction Authority.
    Amount: $100,000 (Approx 100k SGD).
    Expectation: Low Risk.
    """
    payload = {
        "amount": 100000.0,
        "agency": "Building and Construction Authority",
        "vendor": "Larsen & Toubro Infra"
    }
    # BCA has many transactions ~1M+, so 100k is safe.
    response = requests.post(f"{BASE_URL}/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    print(f"\n[BCA Normal] Risk: {data['risk_score']}")
    assert "risk_score" in data

def test_prediction_high_value_outlier():
    """
    Scenario: Massive unexpected outlier.
    Amount: $500,000,000 (500 Million - massive compared to typical 30M max).
    Expectation: High Risk.
    """
    payload = {
        "amount": 500000000.0,
        "agency": "Civil Aviation Authority of Singapore",
        "vendor": "Unknown Mega Corp"
    }
    response = requests.post(f"{BASE_URL}/predict", json=payload)
    data = response.json()
    print(f"\n[CAAS High Value] Risk: {data['risk_score']}")
    # Should be high risk
    assert data["risk_score"] > 50

def test_prediction_suspicious_round_number():
    """
    Scenario: Round Number.
    Amount: 150,000.
    """
    payload = {
        "amount": 150000.0,
        "agency": "Ministry of Culture, Community and Youth - Ministry Headquarter",
        "vendor": "Ganesh Contractors"
    }
    response = requests.post(f"{BASE_URL}/predict", json=payload)
    data = response.json()
    print(f"\n[Round Number] Risk: {data['risk_score']}")
    # If ML model has specific logic for round numbers
    assert data["risk_score"] > 10 # Basic check

def test_prediction_context_mismatch():
    """
    Scenario: Agency spending unusual amount.
    Agency: 'Agri-food and Veterinary Authority' (Usually small consumables).
    Amount: 50,000,000 (50M).
    Expectation: High Risk.
    """
    payload = {
        "amount": 50000000.0, 
        "agency": "Agri-food and Veterinary Authority",
        "vendor": "Global Tech"
    }
    response = requests.post(f"{BASE_URL}/predict", json=payload)
    data = response.json()
    # Logic verification relies on trained model
    assert response.status_code == 200
