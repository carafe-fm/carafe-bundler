const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('faye-websocket');

const hotReloadCode = fs.readFileSync(path.join(__dirname, 'hot-reload.html'), 'utf-8');

class DevServer {
    constructor(sourceCompiler, port) {
        this.sourceCompiler = sourceCompiler;
        this.port = port;
        this.clients = [];
        this.generateHtml();
    }

    replaceLastOccurrence(find, replace, string) {
        var lastIndex = string.toLowerCase().lastIndexOf(find.toLowerCase());
        
        if (lastIndex === -1) {
            return string;
        }
        
        var beginString = string.substring(0, lastIndex);
        var endString = string.substring(lastIndex + find.length);
        
        return beginString + replace + endString;
    }

    generateHtml() {
        this.html = this.replaceLastOccurrence('</body>', hotReloadCode + '</body>', this.sourceCompiler.compileHtml())
    }

    start() {
        return new Promise((resolve, reject) => {
            this.server = http.createServer((req, res) => {
                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8',
                });
                res.write(this.html);
                res.end();
            });

            this.server.addListener('upgrade', (request, socket, head) => {
                if (!WebSocket.isWebSocket(request)) {
                    return;
                }

                const ws = new WebSocket(request, socket, head);

                ws.on('close', () => {
                    this.clients = this.clients.filter(client => {
                        return client !== ws;
                    });
                });

                this.clients.push(ws);
            });

            this.server.addListener('error', () => {
                this.server.close();
                reject();
            });

            this.server.addListener('listening', () => {
                resolve();
            });

            this.server.listen(this.port);
        });
    }

    update() {
        this.generateHtml();

        this.clients.forEach(ws => {
            if (ws) {
                ws.send('reload');
            }
        });
    }
}

module.exports = DevServer;
