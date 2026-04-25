import json
import os

REGISTRY_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "skills", "registry.json")

def list_skills_flow():
    print("\n--- Available Skills & Tools ---")
    if not os.path.exists(REGISTRY_PATH):
        print("Skill registry not found.")
        return

    with open(REGISTRY_PATH, "r") as f:
        data = json.load(f)
        for skill in data.get("skills", []):
            print(f"📦 Skill: {skill['name']}")
            print(f"   Server: {skill['server']}")
            print(f"   Tools : {', '.join(skill['tools'])}")
            print("-" * 20)
