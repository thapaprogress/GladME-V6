import time

class MemoryManager:
    def __init__(self):
        self.history = []

    def log_event(self, event):
        entry = {
            "timestamp": time.time(),
            "event": event
        }
        self.history.append(entry)
        print(f"🧠 Memory Logged: {event}")

    def get_history(self):
        return self.history
