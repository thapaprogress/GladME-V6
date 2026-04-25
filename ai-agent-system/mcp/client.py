import requests
from mcp.registry import registry

def call_tool(server_name, tool, args):
    """
    Routes a tool call to a specific MCP server.
    """
    server = registry.get_server(server_name)
    if not server:
        return {"error": f"Server '{server_name}' not found in registry"}

    try:
        res = requests.post(
            f"{server['url']}/tool",
            json={"tool": tool, "args": args},
            timeout=10
        )
        return res.json()
    except Exception as e:
        return {"error": f"Request to {server_name} failed: {str(e)}"}
