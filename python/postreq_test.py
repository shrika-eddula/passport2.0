from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import time
import uuid

from ai_logic import route_prompt

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:8888", "supports_credentials": True}})

# Simulating a database to store chat sessions
chat_sessions = {}
 

def generate_llm_response(prompt):
    # Simulating LLM response. Replace this with actual LLM integration.
    # result = f"Response to: {prompt}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.".split()
    agent_starter_filepath = "/Users/advaygoel/Desktop/passport2.0/python/AgentE/AgentE_Planner.py"
    result = route_prompt(prompt, agent_starter_filepath)
    if isinstance(result, str):
        for word in " ".split(result):
            yield word + " "
            time.sleep(0.05)
    else:
        for word in result:
            yield word + " "
            time.sleep(0.05)
    

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
    print("here is user input:", user_input)
    
    if session_id not in chat_sessions:
        return jsonify({"error": "Invalid session ID"}), 400
    
    chat_sessions[session_id].append({"role": "user", "content": user_input})
    
    def generate():
        llm_response = ""
        for word in generate_llm_response(user_input):
            llm_response += word
            yield word
        
        chat_sessions[session_id].append({"role": "assistant", "content": llm_response.strip()})
    
    return Response(generate(), mimetype='text/plain')

@app.route('/api/get_chat_history', methods=['GET'])
def get_chat_history():
    session_id = request.args.get('session_id')
    if session_id not in chat_sessions:
        return jsonify({"error": "Invalid session ID"}), 400
    return jsonify({"history": chat_sessions[session_id]})

if __name__ == '__main__':
    app.run(debug=True, port=5000)