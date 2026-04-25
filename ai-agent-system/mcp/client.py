import requests

MCP_URL = "http://localhost:8000/tool"

def call_tool(tool, args):
    """
    Bridge to the MCP Server tools.
    """
    try:
        res = requests.post(MCP_URL, json={
            "tool": tool,
            "args": args
        })
        return res.json()
    except Exception as e:
        return {"error": f"Failed to connect to MCP Server: {str(e)}"}
