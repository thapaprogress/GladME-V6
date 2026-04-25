import json
import os
from mcp.client import call_tool

# Resolve path relative to this script
REGISTRY_PATH = os.path.join(os.path.dirname(__file__), "registry.json")

def load_skills():
    if not os.path.exists(REGISTRY_PATH):
        return []
    with open(REGISTRY_PATH, "r") as f:
        return json.load(f).get("skills", [])

def find_tool(tool_name):
    skills = load_skills()
    for skill in skills:
        if tool_name in skill["tools"]:
            return skill["server"], tool_name
    return None, None

def execute_tool(tool_name, args):
    """
    Intelligently routes a tool call based on the skill registry.
    """
    server, tool = find_tool(tool_name)

    if not server:
        return {"error": f"Tool '{tool_name}' not found in any registered skill."}

    return call_tool(server, tool, args)
