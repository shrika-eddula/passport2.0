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

def create_agents(agentic_info):
    global agent_llm
    agents = {} 
    agent_list = []
    for agent in agentic_info:
        if agent.agentE:
            agents[agent.name]=Agent(role="Browser runner", goal=f"""Run the provided tool to instantiate a browser agent that will complete your provided task: {agent.goal}.
                                     You will use the tool which will run a script. When using the tool, provide a description of what your goal was and what context you've been provided so far
                                     so that the tool has all of the proper context. As a quick reminder, the goal which needs to be passed to the tool is {agent.goal}.
                                     Once the script terminates, it will output a response to you which you are to pass on to the next agent in the system.""", 
                                     backstory="You are very good at instantiating browsing agents.",
                                     verbose=True, allow_delegation=False, tools=[agente_tool])
        else:
            agents[agent.name] = Agent(role=agent.role, goal=agent.goal, backstory=agent.backstory, verbose=True, allow_degation=agent.allow_delegation)
            agent_list.append(agents[agent.name])
    return agents, agent_list

def create_tasks(task_info, agents):
    tasks = [] 
    for task in task_info:
        tasks.append(Task(description=task.description, expected_output=task.expected_output, agent=agents[task.agent]))
    
    return tasks 

def create_system(output):
    print("hi")
    agents, agent_list =create_agents(output.agents)
    tasks = create_tasks(output.tasks, agents)
    crew = Crew(agents=agent_list, tasks=tasks, verbose=2, cache=True, memory=True)
    print("hi")
    try:
        result = crew.kickoff() 
        print(result)
    except:
        yield "Process failed. Trying again."
    yield result