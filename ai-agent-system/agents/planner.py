class PlannerAgent:
    def __init__(self):
        self.role = "Senior Software Architect"

    def plan_task(self, user_input, project_structure=None):
        """
        Analyzes user input and returns a structured execution plan.
        In a production scenario, this would call an LLM (e.g., Gemini).
        """
        print(f"🧭 {self.role} is planning: {user_input}")
        
        # Heuristic-based planning for demonstration
        if "instruction" in user_input.lower():
            return {
                "goal": "Add instruction module",
                "steps": [
                    {"action": "mkdir", "path": "instruction"},
                    {"action": "create_file", "path": "instruction/README.md", "content": "# Instruction Module\nOfficial documentation and guides."},
                    {"action": "create_file", "path": "instruction/guide.md", "content": "# Getting Started\n1. Setup environment\n2. Run main.py"}
                ]
            }
        
        return {
            "goal": "Generic Task",
            "steps": [
                {"action": "run_command", "command": "echo 'Processing generic task'"}
            ]
        }
