import json
import sys
from crewai import Agent, Task, Crew, Process
from langchain.llms import OpenAI

class NoteBackend:
    def __init__(self):
        self.notes = []
        self.llm = OpenAI()

    def create_note(self, title, content):
        note_id = len(self.notes)
        note = {"id": note_id, "title": title, "content": content}
        self.notes.append(note)
        return note

    def update_note(self, note_id, title, content):
        if 0 <= note_id < len(self.notes):
            self.notes[note_id]["title"] = title
            self.notes[note_id]["content"] = content
            return self.notes[note_id]
        return None

    def get_note(self, note_id):
        if 0 <= note_id < len(self.notes):
            return self.notes[note_id]
        return None

    def get_all_notes(self):
        return self.notes

    def analyze_note(self, note_id):
        if 0 <= note_id < len(self.notes):
            note = self.notes[note_id]
            
            # Define agents
            analyzer = Agent(
                role='Note Analyzer',
                goal='Analyze the content of the note and provide insights',
                backstory='You are an expert in analyzing text and extracting key information.',
                allow_delegation=False,
                llm=self.llm
            )
            
            summarizer = Agent(
                role='Note Summarizer',
                goal='Create a concise summary of the note',
                backstory='You are skilled at distilling information into brief, informative summaries.',
                allow_delegation=False,
                llm=self.llm
            )

            # Define tasks
            analysis_task = Task(
                description=f"Analyze the following note and provide insights:\n\nTitle: {note['title']}\n\nContent: {note['content']}",
                agent=analyzer
            )

            summary_task = Task(
                description=f"Summarize the following note in 2-3 sentences:\n\nTitle: {note['title']}\n\nContent: {note['content']}",
                agent=summarizer
            )

            # Create and run the crew
            crew = Crew(
                agents=[analyzer, summarizer],
                tasks=[analysis_task, summary_task],
                verbose=True
            )

            result = crew.kickoff()
            return result

        return None

# Initialize the backend
note_backend = NoteBackend()

# Main loop to handle incoming messages
for line in sys.stdin:
    try:
        message = json.loads(line)
        action = message.get('action')
        
        if action == 'create_note':
            note = note_backend.create_note(message['title'], message['content'])
            print(json.dumps({"action": "note_saved", "note": note}))
        elif action == 'update_note':
            note = note_backend.update_note(message['id'], message['title'], message['content'])
            print(json.dumps({"action": "note_saved", "note": note}))
        elif action == 'get_note':
            note = note_backend.get_note(message['id'])
            print(json.dumps({"action": "note_loaded", "note": note}))
        elif action == 'get_all_notes':
            notes = note_backend.get_all_notes()
            print(json.dumps({"action": "note_list", "notes": notes}))
        
        sys.stdout.flush()
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON received"}))
        sys.stdout.flush()
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.stdout.flush()