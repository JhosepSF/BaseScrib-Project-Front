import json
import urllib.request
import urllib.error

URL = "http://localhost:8000/api/users/"
payload = {
    "username": "testuser_script",
    "password": "password123",
    "email": "testscript@example.com",
    "first_name": "Script",
    "last_name": "Test",
    "role": "student",
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(URL, data=data, headers={"Content-Type": "application/json"}, method='POST')

try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        status = resp.getcode()
        body = resp.read().decode('utf-8')
        print(f"STATUS: {status}")
        print("BODY:")
        print(body)
except urllib.error.HTTPError as e:
    try:
        body = e.read().decode('utf-8')
    except Exception:
        body = '<no body>'
    print(f"HTTP ERROR: {e.code}")
    print("BODY:")
    print(body)
except Exception as ex:
    print("REQUEST FAILED:", ex)
