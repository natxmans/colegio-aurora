# Petit serveur local pour la maquette 3D (sans cache, pour voir toujours la dernière version)
import http.server, socketserver, os, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8820
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class SansCache(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.js': 'text/javascript'}
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
    def log_message(self, *a):
        pass

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('', PORT), SansCache) as srv:
    print(f'Colegio Aurora : http://localhost:{PORT}')
    srv.serve_forever()
