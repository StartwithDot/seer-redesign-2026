#!/usr/bin/env python3
"""SPA + Static Development Server for Seer Design Lab (poidh2/dist)."""
import http.server
import os
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5188
ROOT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")


class SpaHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def do_GET(self):
        path_only = self.path.split("?", 1)[0].split("#", 1)[0]
        full_path = os.path.join(ROOT_DIR, path_only.lstrip("/"))
        if os.path.isdir(full_path):
            index_in_dir = os.path.join(full_path, "index.html")
            if not os.path.exists(index_in_dir):
                self.path = "/index.html"
        elif not os.path.exists(full_path):
            self.path = "/index.html"
        return super().do_GET()


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), SpaHandler) as httpd:
        print(f"SEER_DESIGN_LAB_SERVER_READY http://127.0.0.1:{PORT}/design-lab", flush=True)
        httpd.serve_forever()
