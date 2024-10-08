from dotenv import load_dotenv
load_dotenv()

from crewai import Agent, Task, Crew, Process
from interpreter import interpreter
from langchain.tools import tool
from langchain_openai import ChatOpenAI

# 1. Configuration and Tools
llm = ChatOpenAI(model="gpt-4o-mini")
interpreter.auto_run = True
interpreter.llm.model = "openai/gpt-4o-mini"

class CLITool:
    @tool("Executor")
    def execute_cli_command(command: str):
        """Create and Execute code using Open Interpreter."""
        result = interpreter.chat(command)
        return result

# 2. Creating an Agent for CLI tasks
cli_agent = Agent(
    role='Software Engineer',
    goal='Always use Executor Tool. Ability to perform CLI operations, write programs and execute using Exector Tool',
    backstory='Expert in command line operations, creating and executing code.',
    tools=[CLITool.execute_cli_command],
    verbose=True,
    llm=llm 
)

# 3. Defining a Task for CLI operations
cli_task = Task(
    description='write a python program to find the stock price of apple using yfinance, execute the code and return the result',
    expected_output="the stock price of apple after code execution",
    agent=cli_agent,
    tools=[CLITool.execute_cli_command]
)

# 4. Creating a Crew with CLI focus
cli_crew = Crew(
    agents=[cli_agent],
    tasks=[cli_task],
    process=Process.sequential,
    manager_llm=llm
)

# 5. Run the Crew
result = cli_crew.kickoff()
print(result)
