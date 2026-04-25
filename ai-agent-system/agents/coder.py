from skills.router import execute_tool

class CoderAgent:
    def __init__(self):
        self.role = "Expert Developer"

    def execute_plan(self, plan):
        """
        Sequentially executes steps using the Skill Router.
        The Coder no longer cares WHERE the tool is hosted.
        """
        print(f"💻 {self.role} is executing plan: {plan['goal']}")
        results = []

        for step in plan["steps"]:
            action = step["action"]
            args = {k: v for k, v in step.items() if k != "action"}
            
            print(f"  - Routing tool request: {action}")
            # The router handles server selection
            res = execute_tool(action, args)
            results.append({"step": step, "result": res})

        return results
