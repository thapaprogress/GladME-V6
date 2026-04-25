import asyncio
from agents.planner import PlannerAgent
from agents.coder import CoderAgent
from agents.reviewer import ReviewerAgent
from core.memory import MemoryManager
from core.state import update_state

class AsyncOrchestrator:
    def __init__(self):
        self.planner = PlannerAgent()
        self.coder = CoderAgent()
        self.reviewer = ReviewerAgent()
        self.memory = MemoryManager()

    async def run(self, user_request):
        """
        Main execution loop using asynchronous tasks.
        """
        print(f"🚀 Starting Autonomous Pipeline for: {user_request}")
        self.memory.log_event(f"Task Start: {user_request}")
        
        # 1. PLAN (Architectural Phase)
        update_state({"name": "Planner", "timestamp": self.memory.history[-1]['timestamp']}, "running")
        plan = await asyncio.to_thread(self.planner.plan_task, user_request)
        update_state({"name": "Planner"}, "completed")

        # 2. EXECUTE & REVIEW LOOP
        attempts = 0
        max_attempts = 3
        
        while attempts < max_attempts:
            # 💻 CODER EXECUTION (Concurrent simulation)
            update_state({"name": "Coder"}, "running")
            coder_task = asyncio.to_thread(self.coder.execute_plan, plan)
            results = await coder_task
            update_state({"name": "Coder"}, "completed")

            # 🔍 REVIEWER AUDIT
            update_state({"name": "Reviewer"}, "running")
            review_task = asyncio.to_thread(self.reviewer.review_results, results)
            review_result = await review_task
            update_state({"name": "Reviewer"}, "completed")
            
            if review_result["status"] == "approved":
                self.memory.log_event("Final Approval Received.")
                return "APPROVED: Task finished successfully."
            else:
                attempts += 1
                print(f"⚠️ Iteration {attempts} failed. Refined plan required.")
        
        return "FAILED: Pipeline reached maximum iterations."
