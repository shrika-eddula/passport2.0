from openai import OpenAI
import openai 


# Specify the path to your text file
file_path = 'CrewAI Documentation.txt'

# Open the file and read its contents
with open(file_path, 'r') as file:
    pdf = file.read()

with open("context.txt", 'r') as file:
    context=file.read()
# Now file_contents contains the entire content of the text file

def ask_openai_with_context(context, question):
    try:
        # Combine the context and question into a single prompt
        prompt = f"Context: {context}\n\nQuestion: {question}\n\nAnswer:"
        client = OpenAI()
        # Make an API call to the OpenAI GPT model
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Use GPT-3 model (or "gpt-4" for GPT-4 model if available)
            messages=[
                {"role": "system", "content": context},
                {
                    'role': "user",
                    "content": question

                }
            ]
        )

        # Extract and return the generated response text
        return response.choices[0].message

    except Exception as e:
        return f"Error: {e}"

# Example usage
context = f'''Given a task, your job is to create a multiagentic system that is able to solve the task. Do so by carefully planning what steps are needed to complete the task, then assign the tasks to various agents, describing what each agent's role is and how they must work together to complete the final goal. In the end, return the multi agent setup. An example along with the type of output that is expeced is given below. In addition to the example, you're expected to read the documentatino provided below to see the different tools/integrations provided that will allow the agentic system to interact with the real world. 


Documentation: {pdf}

Ex Outputs: {context}

When you give outputs, only give the python code format and nothing else. Again, only return python code and nothing else.
    '''


question = "Your task: find different restaurants near Kendall square, figure out one with a good menu with lots of food options, and fill out a reservation for Tuesday October 8th at 6pm."
answer = ask_openai_with_context(context, question)
#print(f"Answer: {repr(answer)}")

print(answer)

client=OpenAI()
assistant = client.beta.assistants.create(
  instructions="You run code when told to.",
  model="gpt-4o-mini",
  tools=[{"type": "code_interpreter"}]
)
thread = client.beta.threads.create()


message = client.beta.threads.messages.create(
  thread_id=thread.id,
  role="user",
  content=f"Can you run the following code: {answer}"
)

run = client.beta.threads.runs.create_and_poll(
  thread_id=thread.id,
  assistant_id=assistant.id,
  instructions="Follow the message and tell me when you're done."
)

print(run)


if run.status == 'completed': 
  messages = client.beta.threads.messages.list(
    thread_id=thread.id
  )
  print(messages)
else:
  print(run.status)