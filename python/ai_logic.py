import sys
import subprocess
from openai import OpenAI
from pydantic import BaseModel
from AgentE.AgentE_Planner import main
client = OpenAI()
from make_crew import create_system

class Boolean(BaseModel):
    answer: bool


class Steps(BaseModel):
    class Agent(BaseModel):
        name: str 
        role:str 
        goal: str 
        backstory: str
        tools:list[str]
        allow_delegation:bool
        agentE:bool
    
    class Task(BaseModel):
        description: str 
        expected_output: str
        agent: str 

    agents: list[Agent]
    tasks: list[Task]

def need_AgentE(prompt):
    completion = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": """You are an agent execution expert. You will be fed tasks. When you are given a task, decide whether or not a system needs to access the Internet/control a browser in order
            to complete the task. For example, if the task is to write a python script, browser help isn't needed. But if the python script is to check my email and write a draft, browser control is needed because I 
            need to venture to the person's email. If you decide that browser control is needed, return 1. Otherwise, return 0. For questions asking about information, only say that browser control is needed if 
             you don't already know the answer. For example, if I ask you who created Microsoft, you can tell me Bill Gates without needing to search it up."""},
            {
                "role": "user",
                "content": prompt
            }
        ],
        response_format=Boolean,
    )

    return completion.choices[0].message.parsed 


def agentic_steps(prompt):
    with open('/Users/advaygoel/Desktop/passport2.0/python/agent_planning_prompt.txt', "r") as f:
        agentic_prompt = f.read()
    
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": agentic_prompt},
            {
                "role": "user",
                "content": prompt
            }
        ],
        response_format=Steps,
    )

    return completion.choices[0].message.parsed 

def route_prompt(prompt, agent_starter_filepath = None):
    if not agent_starter_filepath:
        raise ValueError("Agent planner file is required!")
    
    # if "True" in str(need_AgentE(prompt)):
    #     command = [
    #         sys.executable,
    #         agent_starter_filepath,
    #         "--prompt",
    #         prompt
    #     ]
    #     subprocess.run(command)
    #     return "process complete"
    # else:
    steps = agentic_steps(prompt)
    agente=False
    for agent in steps.agents:
        if "True" in str(need_AgentE(agent.goal)):
            agent.agentE=True
            if not agente:
                yield "Agent E is running."
                agente=True
        else:
            agent.agentE=False
    
    print(steps)
    print("hi")
    for res in create_system(steps):
        yield res 
    #return create_system(steps)


#route_prompt("prove that P=NP", "/Users/advaygoel/Desktop/passport2.0/python/AgentE/AgentE_Planner.py")

#print("True" in str(need_AgentE("I want to access google calendar and send evan an invite to meet up.")))

#print(agentic_steps("Find me emails for 50 data brokers and email them asking to meet so I can ask them about my startup idea."))
