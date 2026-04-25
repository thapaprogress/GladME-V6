from mcp.registry import registry

def add_server_flow():
    print("\n--- Add MCP Server ---")
    name = input("Server Unique Name: ")
    url = input("Server URL (e.g., http://localhost:8000): ")
    registry.add_server(name, url)
    print(f"✅ Server '{name}' registered successfully.")

def list_servers_flow():
    print("\n--- Registered MCP Servers ---")
    servers = registry.list_servers()
    if not servers:
        print("No servers connected.")
    for name, config in servers.items():
        print(f"- {name}: {config['url']} ({config['status']})")
