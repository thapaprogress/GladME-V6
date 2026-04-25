from mcp.client import call_tool

class CoderAgent:
    def __init__(self):
        self.role = "Expert Developer"

    def execute_plan(self, plan):
        """
        Sequentially executes steps provided by the Planner using MCP tools.
        """
        print(f"💻 {self.role} is executing plan: {plan['goal']}")
        results = []

        for step in plan["steps"]:
            action = step["action"]
            # Extract arguments excluding the action name
            args = {k: v for k, v in step.items() if k != "action"}
            
            print(f"  - Executing {action} with args: {args}")
            res = call_tool(action, args)
            results.append({"step": step, "result": res})

        return results
