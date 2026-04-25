task_state = {
    "status": "idle",
    "current_step": None,
    "logs": []
}

def update_state(step, status="running"):
    """
    Tracks the active progression of the task across agents.
    """
    task_state["status"] = status
    task_state["current_step"] = step
    task_state["logs"].append({
        "timestamp": step.get("timestamp"),
        "step": step.get("name"),
        "status": status
    })
    print(f"📍 State Updated: {step.get('name')} -> {status}")

def get_state():
    return task_state
