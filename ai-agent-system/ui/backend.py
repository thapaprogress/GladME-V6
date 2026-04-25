from fastapi import FastAPI
from mcp.registry import registry
from core.state import get_state
from core.events import subscribe

app = FastAPI()

# System state cache for UI
ui_state = {
    "notifications": []
}

# Listen for hardware events to push to UI
subscribe("port_detected", lambda d: ui_state["notifications"].append(f"🔌 Hardware Alert: {d['ports']} detected"))

@app.get("/system/servers")
def get_servers():
    return registry.list_servers()

@app.get("/system/state")
def get_current_task_state():
    return get_state()

@app.get("/system/notifications")
def get_notifications():
    return ui_state["notifications"]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
