import os
import sys
import json
import logging
from dotenv import load_dotenv
from crewai import Agent, Task, Crew
from langchain_openai import ChatOpenAI

# Set up logging
logging.basicConfig(level=logging.DEBUG, filename='planning_agent.log', filemode='w',
                    format='%(asctime)s - %(levelname)s - %(message)s')

load_dotenv()

class PlanningAgent:
    def __init__(self):
        logging.info("Initializing PlanningAgent")
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            logging.error("OPENAI_API_KEY not found in environment variables")
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        self.llm = ChatOpenAI(api_key=api_key, model="gpt-3.5-turbo")
        logging.info("PlanningAgent initialized successfully")
        print(json.dumps({"progress": "PlanningAgent initialized"}))

    def create_workflow(self, query):
        logging.info(f"Creating workflow for query: {query}")
        print(json.dumps({"progress": "Creating workflow"}))
        
        planner = Agent(
            role='Workflow Planner',
            goal='Create a CrewAI workflow based on the user query',
            backstory='You are an expert in creating efficient workflows using CrewAI',
            allow_delegation=False,
            llm=self.llm
        )
        print(json.dumps({"progress": "Agent created"}))

        planning_task = Task(
            description=f"Create a CrewAI workflow based on this query: {query}. Return only the Python code for the workflow.",
            expected_output="Python code for the CrewAI workflow",
            agent=planner
        )
        print(json.dumps({"progress": "Task created"}))

        crew = Crew(
            agents=[planner],
            tasks=[planning_task],
            verbose=True
        )
        print(json.dumps({"progress": "Crew created"}))

        logging.info("Starting crew kickoff")
        print(json.dumps({"progress": "Starting crew kickoff"}))
        result = crew.kickoff()
        logging.info(f"Crew kickoff completed. Result: {result}")
        print(json.dumps({"progress": "Crew kickoff completed"}))
        return result

if __name__ == "__main__":
    try:
        logging.info("Script started")
        print(json.dumps({"progress": "Script started"}))
        agent = PlanningAgent()
        query = sys.argv[1] if len(sys.argv) > 1 else "Create a workflow to analyze stock market data and generate investment recommendations"
        logging.info(f"Using query: {query}")
        print(json.dumps({"progress": f"Using query: {query}"}))
        workflow_code = agent.create_workflow(query)
        result = json.dumps({"result": workflow_code})
        logging.info(f"Final result: {result}")
        print(result)
    except Exception as e:
        logging.exception("An error occurred")
        print(json.dumps({"error": str(e)}))
    finally:
        logging.info("Script finished")
        print(json.dumps({"progress": "Script finished"}))
    sys.exit(0)