from dotenv import load_dotenv
import os
from pathlib import Path

# Specify the path to the .env file
env_path = Path('cmpe_272_project_spring2025-/.env.local')
load_dotenv(dotenv_path=env_path)

def test_api_keys():
    openai_api_key = os.getenv("OPENAI_API_KEY")
    google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")

    if openai_api_key:
        print("OpenAI API key is set.")
    else:
        print("OpenAI API key is NOT set.")

    if google_maps_api_key:
        print("Google Maps API key is set.")
    else:
        print("Google Maps API key is NOT set.")

# Run the test
test_api_keys()
