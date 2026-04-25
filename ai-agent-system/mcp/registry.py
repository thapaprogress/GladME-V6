import json

class MCPRegistry:
    def __init__(self):
        self.servers = {}

    def add_server(self, name, url):
        self.servers[name] = {
            "url": url,
            "status": "connected"
        }

    def remove_server(self, name):
        if name in self.servers:
            del self.servers[name]

    def list_servers(self):
        return self.servers

    def get_server(self, name):
        return self.servers.get(name)

# Singleton instance
registry = MCPRegistry()
