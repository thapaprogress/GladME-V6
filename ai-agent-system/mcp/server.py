from fastapi import FastAPI
from pydantic import BaseModel
import os
import subprocess

app = FastAPI()

class ToolRequest(BaseModel):
    tool: str
    args: dict

@app.post("/tool")
def run_tool(req: ToolRequest):
    tool = req.tool
    args = req.args

    try:
        if tool == "mkdir":
            os.makedirs(args["path"], exist_ok=True)
            return {"status": "success"}

        elif tool == "create_file":
            with open(args["path"], "w") as f:
                f.write(args["content"])
            return {"status": "success"}

        elif tool == "read_file":
            if os.path.exists(args["path"]):
                with open(args["path"], "r") as f:
                    return {"content": f.read()}
            return {"error": "File not found"}

        elif tool == "list_dir":
            path = args.get("path", ".")
            if os.path.exists(path):
                return {"files": os.listdir(path)}
            return {"error": "Directory not found"}

        elif tool == "run_command":
            result = subprocess.run(args["command"], shell=True, capture_output=True, text=True)
            return {
                "output": result.stdout,
                "error": result.stderr,
                "exit_code": result.returncode
            }

        else:
            return {"error": f"Unknown tool: {tool}"}

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
