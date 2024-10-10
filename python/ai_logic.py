import sys
import subprocess
from openai import OpenAI
from pydantic import BaseModel
from AgentE.AgentE_Planner import main
client = OpenAI()
from make_crew import create_system
from predefined_crews.gcal import create_gcal_system

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
    """
    Given agent goal/prompts, figures out whether the agent requires access of AgentE.
    """

    completion = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": """You are an agent execution expert. You will be fed tasks. When you are given a task, decide whether or not a system needs to access the Internet/control a browser in order
            to complete the task. For example, if the task is to write a python script, browser help isn't needed. But if the python script is to check my email and write a draft, browser control is needed because I 
            need to venture to the person's email. If you decide that browser control is needed, return 1. Otherwise, return 0. For questions asking about information, only say that browser control is needed if 
             you don't already know the answer. For example, if I ask you who created Microsoft, you can tell me Bill Gates without needing to search it up.
             
             REMEMBER, ONLY RETURN TRUE IF BROWSER AGENT IS NEEDED FOR THIS SPECIFIC TASK."""},
            {
                "role": "user",
                "content": prompt
            }
        ],
        response_format=Boolean,
    )

    return completion.choices[0].message.parsed 


def agentic_steps(prompt):
    """
    Given that CrewAI is needed for a prompt, determines the agentic structure.
    """
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

def need_agents(prompt):
    """
    Determines whether CrewAI is needed for the prompt.
    """

    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": """you are a helpful agent who is tasked with figuring out whether a given 
             request requires the usage of an advanced AI agent system or if it can just be answered directly with 
             the given context. For example, if I asked to figure out the current price of Apple stock, you might
             require an agent because you'd use Google to search the web and then return the answer. However, if I asked
             you who sailed the ocean blue in 1492, you would simply respond with no."""},
            {
                "role": "user",
                "content": prompt
            }
        ],
        response_format=Boolean,
    )

    return completion.choices[0].message.parsed 

def answer_prompt(prompt):
    """
    Chatbot style q/a
    """

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant who answers the questions given to you."},
            {"role": "user", "content": prompt}
        ]
    )

    print(completion.choices[0].message.content)

    return completion.choices[0].message.content

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
    if any(["Google Calendar", "Gcal", "Calendar", "Google Cal"]) in prompt:
        for res in create_gcal_system(prompt):
            yield res
    else:
        need_agent = need_agents(prompt)
        if "False" in str(need_agent):
            ans= answer_prompt(prompt)
            print(ans)
            print(type(ans))
            yield ans 
        else:
            steps = agentic_steps(prompt)
            agente=False
            for agent in steps.agents:
                if "True" in str(need_AgentE(agent.goal)):
                    agent.agentE=True
                    if not agente:
                        yield "Agent E is running.\n"
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
