from core.orchestrator import Orchestrator
from mcp.registry import registry
from ui.mcp_manager import add_server_flow, list_servers_flow
from ui.skill_manager import list_skills_flow

def main():
    print("--- Antigravity AI OS (MCP-Enabled) ---")
    orchestrator = Orchestrator()
    
    # Pre-register local server for convenience
    registry.add_server("local", "http://localhost:8000")
    
    while True:
        print("\n[M] Manage MCP Servers | [S] View Skills | [T] Run Task | [X] Exit")
        choice = input("Select an option: ").upper()
        
        if choice == 'M':
            sub_choice = input("(A)dd Server | (L)ist Servers: ").upper()
            if sub_choice == 'A': add_server_flow()
            elif sub_choice == 'L': list_servers_flow()
            
        elif choice == 'S':
            list_skills_flow()
            
        elif choice == 'T':
            task = input("Enter task description: ")
            if task:
                result = orchestrator.run(task)
                print(f"\nFinal Result: {result}")
                
        elif choice == 'X':
            break
            
        else:
            print("Invalid selection.")

if __name__ == "__main__":
    main()
