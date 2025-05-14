from fastapi import FastAPI
from pydantic import BaseModel
import onnxruntime as ort
import numpy as np
import math
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import httpx
import os
from dotenv import load_dotenv
import logging
from pathlib import Path
from dotenv import load_dotenv, find_dotenv
from fastapi import FastAPI, Form, HTTPException
from typing import List, Optional
import json


load_dotenv(find_dotenv(filename=".env.local"))

# print("ENV VAR:", os.getenv("OPENAI_API_KEY"))
# env_path = Path('cmpe_272_project_spring2025-/.env.local')
# load_dotenv(dotenv_path=env_path)
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ONNX model
session = ort.InferenceSession("xgb_model.onnx")
input_name = session.get_inputs()[0].name

# Input model
class InputData(BaseModel):
    encoded_address: float
    beds: int
    baths: float  # Changed from int to float to accept decimal values
    area: float
    price: float  # User-provided rent

# Hello World endpoint
@app.get("/")
def hello_world():
    return {"message": "Hello World! Welcome to the Property Price Prediction API"}
@app.get("/urmum")
def test_api_keys():
    openai_api_key = os.getenv("OPENAI_API_KEY")
    google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")

    if openai_api_key:
        return "OpenAI API key is set."
    else:
        return "OpenAI API key is NOT set."

# Deal evaluation logic (returns only numeric metrics)
def evaluate_deal(predicted_rent: float, price: float):
    if predicted_rent <= 0:
        return {
            "percent_difference": 0.0,
            "normalized_score": 0.0
        }

    # Cap the price difference at 200% to prevent extreme scores
    percent_diff = (predicted_rent - price) / predicted_rent
    percent_diff = max(min(percent_diff, 2.0), -2.0)  # Cap at ±200%
    
    # Calculate normalized score with a minimum of 25
    normalized_score = 100 * (1 - ((price - predicted_rent) / predicted_rent))
    normalized_score = max(25, min(130, normalized_score))  # Minimum score of 25, maximum of 130

    return {
        "percent_difference": round(percent_diff * 100, 2),
        "normalized_score": round(normalized_score, 2)
    }

# Prediction endpoint
@app.post("/predict")
def predict(data: InputData):
    input_array = np.array([[data.encoded_address, data.beds, data.baths, data.area]], dtype=np.float32)
    result = session.run(None, {input_name: input_array})
    predicted_price = float(result[0][0])

    # Run deal evaluation
    deal_result = evaluate_deal(predicted_price, data.price)

    return {
        "predicted_price": round(predicted_price, 2),
        "actual_price": data.price,
        **deal_result
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

env_path = Path('cmpe_272_project_spring2025-/.env.local')
load_dotenv(dotenv_path=env_path)
# Load environment variables

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
# Setup CORS

# Get API keys from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

# Data models
class TransportationPreference(BaseModel):
    id: str
    label: str

class UserProfile(BaseModel):
    occupation: str
    company: str
    interests: List[str]
    transportation: List[str]
    completed: bool = True
    serverId: Optional[str] = None

class AddressInput(BaseModel):
    address: str
    radius: Optional[int] = Field(default=5000, description="Search radius in meters")

class RecommendationRequest(BaseModel):
    profile: UserProfile
    address_info: AddressInput

class Place(BaseModel):
    name: str
    category: str
    description: str
    address: Optional[str] = None
    distance: Optional[str] = None
    relevance_score: int = Field(ge=1, le=10, description="Relevance score from 1-10")
    relevance_reason: str


class AddressInput(BaseModel):
    address: str
    radius: int

@app.post("/recommendations")
async def generate_recommendations_endpoint(address_info: AddressInput):
    try:
        # Log the incoming request
        logger.info(f"Received recommendation request for address: {address_info}")
        
        recommendations = await generate_recommendationsA(address_info)
        
        return recommendations
        
    except Exception as e:
        logger.error(f"Error processing recommendation request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def generate_recommendationsA(address_info: AddressInput):
    """Generate place recommendations using OpenAI API based on user profile and raw address"""
    
    if not OPENAI_API_KEY:
        logger.error("OpenAI API key not provided")
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    # Log the current working directory
    logger.info(f"Current working directory: {os.getcwd()}")

    # Load user profile from local JSON
    try:
        # Use Path to construct the file path
        file_path = Path('userinfo.json')
        
        # Check if the file exists
        if not file_path.is_file():
            logger.error(f"File not found: {file_path}")
            raise HTTPException(status_code=500, detail=f"File not found: {file_path}")
        
        with file_path.open("r") as f:
            profile = json.load(f)
    except FileNotFoundError:
        logger.error("user_info.json file not found")
        raise HTTPException(status_code=500, detail="user_info.json file not found")
    except json.JSONDecodeError as e:
        logger.error(f"Error decoding JSON from user_info.json: {str(e)}")
        raise HTTPException(status_code=500, detail="Error decoding JSON from user_info.json")

    interests_str = ", ".join(profile.get("interests", []))
    transportation_str = ", ".join(profile.get("transportation", []))

    user_profile_summary = f"""
    User Profile:
    - Occupation: {profile.get("occupation")}
    - Company/Institution type: {profile.get("company")}
    - Interests: {interests_str}
    - Transportation preferences: {transportation_str}
    
    Location:
    - Address: {address_info.address}
    - Search radius: {address_info.radius} meters
    """

    prompt = f"""
    Based on the following user profile and location, generate a list of 3-4 personalized place recommendations 
    that would be interesting and relevant to this specific user.

    {user_profile_summary}

    For each recommended place, provide:
    
    1. Place name
    2. Category (e.g., workplace, café, museum, park, tech hub, etc.)
    3. A brief description of what makes it special
    4. Why it's relevant to this specific user's profile (interests, occupation, etc.)
    5. A relevance score from 1-10
    6. Google maps link

    Format each place as a JSON object:
    {{
      "name": "Place Name",
      "category": "Category",
      "description": "Brief description",
      "relevance_score": 8,
      "relevance_reason": "Why it's relevant",
      "google_maps_link": "https://maps.google.com/?q=Place Name"
    }}

    Return all place recommendations as a JSON array of these objects.
    """

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4-1106-preview",
                    "messages": [
                        {"role": "system", "content": "You are a personalized place recommendation assistant."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "response_format": { "type": "json_object" }
                },
                timeout=30.0
            )

            if response.status_code != 200:
                logger.error(f"OpenAI API error: {response.status_code} - {response.text}")
                raise HTTPException(status_code=500, detail=f"Error from OpenAI API: {response.text}")

            content = response.json()["choices"][0]["message"]["content"]

            parsed_content = json.loads(content)
            print(parsed_content, "parsed_content")
            #Ensure parsed_content is a dictionary with a "recommendations" key
            return parsed_content

    except httpx.TimeoutException:
        logger.error("OpenAI API request timed out")
        raise HTTPException(status_code=504, detail="OpenAI request timed out")

    except Exception as e:
        logger.error(f"Error generating recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))







# async def geocode_address(address: str):
#     """Convert address to latitude and longitude using Google Maps API"""
#     if not GOOGLE_MAPS_API_KEY:
#         # For demo purposes, return a default location if no API key
#         logger.warning("No Google Maps API key provided, using default coordinates")
#         return {"lat": 37.7749, "lng": -122.4194}  # Default to San Francisco
    
#     try:
#         async with httpx.AsyncClient() as client:
#             response = await client.get(
#                 "https://maps.googleapis.com/maps/api/geocode/json",
#                 params={
#                     "address": address,
#                     "key": GOOGLE_MAPS_API_KEY
#                 }
#             )
            
#             data = response.json()
#             print(data, "data")
#             print(address, "address")
#             if data["status"] != "OK":
#                 logger.error(f"Geocoding API error: {data['status']}")
#                 raise HTTPException(status_code=400, detail=f"Could not geocode address: {data['status']}")
                
#             location = data["results"][0]["geometry"]["location"]
#             return location
            
#     except Exception as e:
#         logger.error(f"Error geocoding address: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Geocoding error: {str(e)}")

# async def generate_recommendations(profile: UserProfile, address_info: AddressInput, coordinates: dict):
#     """Generate place recommendations using OpenAI API based on user profile and location"""
    
#     if not OPENAI_API_KEY:
#         logger.error("OpenAI API key not provided")
#         raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
#     # Convert interests and transportation to readable format
#     interests_str = ", ".join(profile.interests)
#     transportation_str = ", ".join(profile.transportation)
    
#     # Create a comprehensive user profile summary for the AI
#     user_profile_summary = f"""
#     User Profile:
#     - Occupation: {profile.occupation}
#     - Company/Institution type: {profile.company}
#     - Interests: {interests_str}
#     - Transportation preferences: {transportation_str}
    
#     Location:
#     - Address: {address_info.address}
#     - Coordinates: Latitude {coordinates['lat']}, Longitude {coordinates['lng']}
#     - Search radius: {address_info.radius} meters
#     """
    
#     # Prompt for OpenAI
#     prompt = f"""
#     Based on the following user profile and location, generate a list of 3-4 personalized place recommendations 
#     that would be interesting and relevant to this specific user.
    
#     {user_profile_summary}
    
#     For each recommended place, provide:
#     1. Place name
#     2. Category (e.g., workplace,café, museum, park, tech hub, etc.)
#     3. A brief description of what makes it special 
#     4. Why it's relevant to this specific user's profile (interests, occupation, etc.)
#     5. A relevance score from 1-10, where 10 means perfectly aligned with user's profile
    
#     Format each place as a JSON object with the following structure:
#     {{
#       "name": "Place Name",
#       "category": "Category",
#       "description": "Brief description of the place",
#       "relevance_score": 8,
#       "relevance_reason": "Why this place is relevant to the user's profile"
#     }}
    
#     Return all place recommendations as a JSON array of these objects.
#     """
    
#     try:
#         # Make API call to OpenAI
#         async with httpx.AsyncClient() as client:
#             response = await client.post(
#                 "https://api.openai.com/v1/chat/completions",
#                 headers={
#                     "Authorization": f"Bearer {OPENAI_API_KEY}",
#                     "Content-Type": "application/json"
#                 },
#                 json={
#                     "model": "gpt-4-1106-preview",  # or latest gpt-4-turbo model
#                     "messages": [
#                         {"role": "system", "content": "You are a personalized place recommendation assistant that provides relevant suggestions based on user profiles and locations."},
#                         {"role": "user", "content": prompt}
#                     ],
#                     "temperature": 0.7,
#                     "response_format": { "type": "json_object" }

#                 },
#                 timeout=30.0
#             )
            
#             if response.status_code != 200:    
#                 logger.error(f"OpenAI API error: {response.status_code} - {response.text}")
#                 raise HTTPException(status_code=500, detail=f"Error communicating with OpenAI API: {response.text}")

#                 # logger.error(f"OpenAI API error: {response.status_code} - {response.text}")
#                 # raise HTTPException(status_code=500, detail="Error communicating with OpenAI API")
            
#             response_data = response.json()
#             content = response_data["choices"][0]["message"]["content"]
            
#             # Process the OpenAI response
#             try:
#                 import json
#                 parsed_content = json.loads(content)
                
#                 places = parsed_content.get("places", [])
#                 user_summary = parsed_content.get("summary", "")
                
#                 if not places:
#                     # Handle case where AI might have formatted response differently
#                     # Try to extract an array from the response if "places" key isn't there
#                     if isinstance(parsed_content, list):
#                         places = parsed_content
#                     else:
#                         for key, value in parsed_content.items():
#                             if isinstance(value, list) and len(value) > 0:
#                                 places = value
#                                 break
                
#                 # If still no places found, raise error
#                 if not places:
#                     logger.error(f"Could not parse places from OpenAI response: {content}")
#                     raise HTTPException(status_code=500, detail="Could not generate place recommendations")
                
#                 return {
#                     "places": places,
#                     "user_summary": user_summary or "Recommendations based on your profile and location."
#                 }
                
#             except json.JSONDecodeError as e:
#                 logger.error(f"Error parsing OpenAI response: {str(e)}")
#                 raise HTTPException(status_code=500, detail="Error parsing recommendations")
                
#     except httpx.TimeoutException:
#         logger.error("OpenAI API request timed out")
#         raise HTTPException(status_code=504, detail="OpenAI request timed out")
        
#     except Exception as e:
#         logger.error(f"Error generating recommendations: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")
    

#following so for download the file to json
def save_user_profile_to_json(profile: UserProfile, filename: str = "userinfo.json"):
    try:
        profile_dict = profile.dict()
        json_data = json.dumps(profile_dict, indent=4)
        with open(filename, 'w') as json_file:
            json_file.write(json_data)
        print(f"User profile saved to {filename}")
    except Exception as e:
        print(f"An error occurred while saving the user profile: {str(e)}")

@app.post("/submit", response_model=UserProfile)
async def submit_form(profile: UserProfile):
    try:
        save_user_profile_to_json(profile)
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")