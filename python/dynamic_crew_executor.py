import sys
import json
from crewai import Agent, Task, Crew
from langchain_openai import ChatOpenAI

def execute_crew_code(code_string):
    try:
        # Create a local environment to execute the code
        local_env = {}
        
        # Execute the generated code
        exec(code_string, globals(), local_env)
        
        # Assuming the code creates a Crew object named 'crew'
        if 'crew' in local_env:
            result = local_env['crew'].kickoff()
            return {"result": result}
        else:
            return {"error": "No Crew object found in the generated code."}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        # Read the CrewAI code from stdin
        code_string = sys.stdin.read()
        
        # Execute the code
        result = execute_crew_code(code_string)
        
        # Print the result as JSON
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))