from core.orchestrator import Orchestrator

def main():
    print("--- Antigravity AI Agentic System ---")
    orchestrator = Orchestrator()
    
    while True:
        try:
            user_input = input("\nEnter task (or 'exit' to quit): ")
            if user_input.lower() in ['exit', 'quit']:
                break
                
            result = orchestrator.run(user_input)
            print(f"\nFinal Result: {result}")
            
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"Critical System Error: {e}")

if __name__ == "__main__":
    main()
