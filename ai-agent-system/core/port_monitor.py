import time
import threading
from mcp.client import call_tool
from core.events import emit

class PortMonitor(threading.Thread):
    def __init__(self, interval=5):
        super().__init__()
        self.interval = interval
        self.running = False
        self.last_ports = []

    def run(self):
        self.running = True
        print("🔍 Port Monitor Started...")
        while self.running:
            try:
                res = call_tool("local", "list_ports", {})
                ports = res.get("ports", [])
                
                if isinstance(ports, list) and ports != self.last_ports:
                    new_ports = set(ports) - set(self.last_ports)
                    if new_ports:
                        emit("port_detected", {"ports": list(new_ports)})
                    self.last_ports = ports
                    
            except Exception as e:
                print(f"⚠️ Monitor error: {e}")
            
            time.sleep(self.interval)

    def stop(self):
        self.running = False
