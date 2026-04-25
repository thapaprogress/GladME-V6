import asyncio
from core.orchestrator import AsyncOrchestrator
from mcp.registry import registry
from ui.mcp_manager import add_server_flow, list_servers_flow
from ui.skill_manager import list_skills_flow
from core.port_monitor import PortMonitor
from core.events import subscribe

async def main():
    print("--- Antigravity AI IDE OS (V2.0-Autonomous) ---")
    orchestrator = AsyncOrchestrator()
    
    # 🔌 Initialize Infrastructure
    registry.add_server("local", "http://localhost:8000")
    
    # 🔍 Start Real-time Monitoring in background
    monitor = PortMonitor()
    monitor.start()
    
    # Subscribe to events for main console output
    subscribe("port_detected", lambda d: print(f"\n🔔 [EVENT] New hardware detected: {d['ports']}"))

    while True:
        try:
            print("\n[M] MCP | [S] Skills | [T] Run Task | [X] Exit")
            # async input helper or simple thread wrap
            choice = await asyncio.to_thread(input, "Select: ")
            choice = choice.upper()
            
            if choice == 'M':
                sub = await asyncio.to_thread(input, "(A)dd | (L)ist: ")
                if sub.upper() == 'A': add_server_flow()
                elif sub.upper() == 'L': list_servers_flow()
                
            elif choice == 'S':
                list_skills_flow()
                
            elif choice == 'T':
                task = await asyncio.to_thread(input, "Enter goal: ")
                if task:
                    result = await orchestrator.run(task)
                    print(f"\nFinal OS Result: {result}")
                    
            elif choice == 'X':
                monitor.stop()
                break
                
        except KeyboardInterrupt:
            monitor.stop()
            break
        except Exception as e:
            print(f"OS Kernel Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
