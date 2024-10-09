from flask import Flask, request, Response, jsonify
from flask_cors import CORS
import uuid
import requests
import json
from markdown2 import Markdown
import re

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*", "supports_credentials": True}})

chat_sessions = {}

OLLAMA_API_BASE = "http://localhost:11434"  # Adjust if your Ollama API is hosted elsewhere

def generate_llm_response(prompt):
    url = f"{OLLAMA_API_BASE}/api/chat"
    data = {
        "model": "llama3.1:latest",  # Adjust this to match your Ollama model name
        "messages": [
            {"role": "user", "content":prompt}
        ],
        "stream": True
    }
    
    with requests.post(url, json=data, stream=True) as r:
        for line in r.iter_lines():
            if line:
                response_dict = json.loads(line.decode('utf-8'))
                content = response_dict.get("message", {}).get("content", "")
                if content:
                    yield content

@app.route('/api/start_chat', methods=['POST'])
def start_chat():
    session_id = str(uuid.uuid4())
    chat_sessions[session_id] = []
    return jsonify({"session_id": session_id})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    session_id = data.get('session_id')
    user_input = data.get('text', '')
    
    if session_id not in chat_sessions:
        return jsonify({"error": "Invalid session ID"}), 400
    
    chat_sessions[session_id].append({"role": "user", "content": user_input})
    
    def generate():
        llm_response = ""
        for token in generate_llm_response(user_input):
            llm_response += token
            yield token
        
        chat_sessions[session_id].append({"role": "assistant", "content": llm_response.strip()})
    
    return Response(generate(), mimetype='text/plain')

if __name__ == '__main__':
    app.run(port=5000, debug=True)