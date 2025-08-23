import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse, JSONResponse

app = FastAPI()

@app.get("/api/v1/health")
def health():
    return {"ok": True}

# Serve built frontend
if os.path.isdir("dist"):
    if os.path.isdir("dist/assets"):
        app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")
    app.mount("/_app", StaticFiles(directory="dist"), name="dist_root")

@app.get("/{path:path}")
def spa(path: str):
    index_path = os.path.join("dist", "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return JSONResponse({"detail": "Frontend not built yet. Run npm run build"}, status_code=503)