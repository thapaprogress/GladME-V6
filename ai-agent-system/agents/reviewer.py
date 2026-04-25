class ReviewerAgent:
    def __init__(self):
        self.role = "Strict Quality Auditor"

    def review_results(self, execution_results):
        """
        Validates the results of the Coder's execution.
        """
        print(f"🔍 {self.role} is reviewing outputs...")
        
        for entry in execution_results:
            res = entry["result"]
            if "error" in res:
                print(f"  ❌ Step failed: {entry['step']['action']} - {res['error']}")
                return {"status": "fail", "reason": res["error"], "step": entry["step"]}
        
        print("  ✅ All steps passed validation.")
        return {"status": "approved"}
