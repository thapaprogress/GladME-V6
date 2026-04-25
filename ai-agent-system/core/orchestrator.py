from agents.planner import PlannerAgent
from agents.coder import CoderAgent
from agents.reviewer import ReviewerAgent
from core.memory import MemoryManager

class Orchestrator:
    def __init__(self):
        self.planner = PlannerAgent()
        self.coder = CoderAgent()
        self.reviewer = ReviewerAgent()
        self.memory = MemoryManager()

    def run(self, user_request):
        """
        Main execution loop: Plan -> Code -> Review -> (Optional Fix)
        """
        self.memory.log_event(f"Task Started: {user_request}")
        
        # 1. PLAN
        plan = self.planner.plan_task(user_request)
        
        # 2. EXECUTE & REVIEW LOOP
        attempts = 0
        max_attempts = 3
        
        while attempts < max_attempts:
            results = self.coder.execute_plan(plan)
            review_result = self.reviewer.review_results(results)
            
            if review_result["status"] == "approved":
                self.memory.log_event("Task Approved and Completed")
                return "APPROVED: Task completed successfully."
            else:
                print(f"⚠️ Reviewer rejected attempt {attempts+1}. Fixing...")
                # In a real system, we'd feed the error back to the planner/coder
                attempts += 1
        
        return "FAILED: Maximum attempts reached without approval."
