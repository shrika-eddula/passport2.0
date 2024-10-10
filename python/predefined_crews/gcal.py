from crewai import Agent, Task, Crew
from crewai_tools import tool 
import sys 
import subprocess

agent_llm = "gpt-4o-mini"
@tool("agente")
def agente_tool(prompt):
    """
    instantiates Agent-E and feeds it the given prompt. Outputs the final response.
    """
    global agent_llm
    agent_starter_filepath="/Users/advaygoel/Desktop/passport2.0/python/AgentE/AgentE_Planner.py"
    command = [
            sys.executable,
            agent_starter_filepath,
            "--prompt",
            prompt,
            "--llm",
            agent_llm
        ]
    completedprocess = subprocess.run(command, capture_output=True, text=True)

    print(type(completedprocess))
    print("stdout:", completedprocess.stdout)
    #print("stderr:", completedprocess.stderr)

    return completedprocess.stdout
    #return 6

def create_agents(prompt):
    global agent_llm
    agents = {} 
    agent_list = []
    agents["agente"] = Agent(role="Browser runner", goal=f"""Run the provided tool to instantiate a browser agent. You need to direct it 
                                     and tell it to go to Google Calendar so that it can fulfill the goal. As a reminder,
                             your goal is {prompt}""", backstory="You have always been very good at instantiating browser agents.",
                                     verbose=True, allow_delegation=False, tools=[agente_tool])
    agents["other"] = Agent(role = "Summarizer", goal = f"""You will be given Google Calendar information from the previous agent.
                            Use that information to present the user with the answer to their query, which was {prompt}.""", 
                            verbose=True, allow_delegation=False)
    agent_list.extend([agents["agente"], agents["other"]])

    return agents, agent_list

def create_tasks(prompt, agents):
    tasks = [] 
    tasks.append(Task(description=f"Access the agente tool to go to Google Calendar and scrape info relevant to the prompt, which is {prompt}.",
                      expected_output="Scraped information from Google Calendar containing info relevant to the goal.",
                      agent=agents["agente"])
                    )
    tasks.append(Task(description=f"Using the information provided by the previous agent, format the data to answer the prompt, which is {prompt}.",
                      expected_output="A nice readable summary of the Google Calendar info to present to the user.",
                      agent=agents["other"])
                    )
    return tasks 

def create_gcal_system(output):
    print("hi")
    agents, agent_list =create_agents(output.agents)
    tasks = create_tasks(output.tasks, agents)
    crew = Crew(agents=agent_list, tasks=tasks, verbose=2, cache=True, memory=True)
    print("hi")
    try:
        result = crew.kickoff() 
        print(result)
        yield result
    except:
        yield "Process failed. Trying again."
