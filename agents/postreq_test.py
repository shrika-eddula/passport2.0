from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Home Page"

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    input_text = data.get('text', '')
    print(f"Received text: {input_text}")
    return jsonify({"message": "Text received", "text": input_text})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
