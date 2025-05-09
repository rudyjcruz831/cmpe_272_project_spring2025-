from fastapi import FastAPI
from pydantic import BaseModel
import requests
import math
import openai
import json
import os
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware with more permissive settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Test endpoints
@app.get("/")
async def root():
    return {"message": "Personal Recommendations API is running"}

@app.get("/test")
async def test():
    return {"message": "Test endpoint is working"}

@app.get("/endpoints")
async def list_endpoints():
    return {
        "endpoints": [
            {"path": "/", "method": "GET"},
            {"path": "/test", "method": "GET"},
            {"path": "/recommend_places", "method": "POST"},
            {"path": "/find_dist", "method": "POST"}
        ]
    }

# OpenAI and OpenCage API keys
OPENCAGE_API_KEY = "bfec60cae0a6424680d74384b5437074"
OPENAI_API_KEY = "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"
openai.api_key = OPENAI_API_KEY

### ---------------------------
### Reuse previous distance logic
### ---------------------------

class DistanceRequest(BaseModel):
    origin: str
    destinations: list[str]

def get_coordinates(location: str):
    url = f"https://api.opencagedata.com/geocode/v1/json?q={location}&key={OPENCAGE_API_KEY}"
    response = requests.get(url)
    data = response.json()
    results = data.get("results")
    if not results:
        raise ValueError(f"Could not find coordinates for '{location}'")
    coords = results[0]["geometry"]
    return coords["lat"], coords["lng"]

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)
    a = math.sin(d_phi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@app.post("/find_dist")
def find_dist(data: DistanceRequest):
    try:
        origin_lat, origin_lng = get_coordinates(data.origin)
    except ValueError as e:
        return {"error": str(e)}

    distances = {}
    for dest in data.destinations:
        try:
            dest_lat, dest_lng = get_coordinates(dest)
            dist_km = haversine(origin_lat, origin_lng, dest_lat, dest_lng)
            distances[dest] = round(dist_km, 2)
        except ValueError as e:
            distances[dest] = "Location not found"

    return {
        "origin": data.origin,
        "distances_km": distances
    }

### ---------------------------
### New Endpoint: Place Recommendations
### ---------------------------

