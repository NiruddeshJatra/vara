# payments/sslcommerz.py
import requests
import json
from django.conf import settings
from typing import Dict, Any

class SSLCommerzPayment:
    """Custom implementation of SSLCommerz payment integration"""
    
    def __init__(self):
        self.store_id = settings.SSLCOMMERZ_STORE_ID
        self.store_passwd = settings.SSLCOMMERZ_STORE_PASSWORD
        self.is_sandbox = getattr(settings, 'SSLCOMMERZ_IS_SANDBOX', True)
        self.base_url = "https://sandbox.sslcommerz.com" if self.is_sandbox else "https://securepay.sslcommerz.com"
    
    def create_session(self, payment_data: Dict[str, Any]) -> dict:
        """Create a new payment session"""
        api_url = f"{self.base_url}/gwprocess/v4/api.php"
        
        data = {
            'store_id': self.store_id,
            'store_passwd': self.store_passwd,
            'total_amount': float(payment_data['total_amount']),
            'currency': payment_data['currency'],
            'tran_id': payment_data['tran_id'],
            'success_url': payment_data['success_url'],
            'fail_url': payment_data['fail_url'],
            'cancel_url': payment_data['cancel_url'],
            'cus_name': payment_data['customer_name'],
            'cus_email': payment_data['customer_email'],
            'cus_phone': payment_data.get('customer_phone', ''),
            'cus_add1': payment_data.get('customer_address', ''),
            'cus_city': payment_data.get('customer_city', ''),
            'cus_postcode': payment_data.get('customer_postcode', ''),
            'cus_country': payment_data.get('customer_country', 'Bangladesh'),
            'shipping_method': 'NO',
            'product_name': payment_data.get('product_name', 'Payment'),
            'product_category': payment_data.get('product_category', 'General'),
            'product_profile': payment_data.get('product_profile', 'general')
        }
        
        try:
            response = requests.post(api_url, data=data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'status': 'FAILED', 'error': str(e)}