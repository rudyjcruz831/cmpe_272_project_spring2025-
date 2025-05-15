# Welcome to AffordAbode!
cmpe_272_project_spring2025-
Project for Enterprise Software Engineering Platforms Spring 2025
http://ec2-54-153-109-88.us-west-1.compute.amazonaws.com:3000/

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Features](#features)

## Overview
AffordAbode is a powerful data analysis tool designed to help users find below-market housing deals by analyzing Redfin data. The project serves two main target demographics:
Low-income and commuter students seeking affordable housing near campus

## RedFin Data Analyzer for Finding Below-Market Housing Deals (Possible target demographics)
1. Problem: Low-income and commuter students are looking for rent in high-income areas, often near their campus.

Solution:
- Build a data analysis tool that scrapes and analyzes Redfin data to identify below-market housing deals in a given zip code.
- Use Scrapy-Selenium for web scraping RedFin listings.
- Analyze the data using an AI model to identify properties listed below market value based on historical price trends, comparable sales, and neighborhood averages.
- Deploy the tool as a web application using AWS EC2
  
Key Features:
  Data Collection:
    Scrape RedFin listings for a specific zip code, including property details like price, square footage, and number of bedrooms/bathrooms.
  Market Value Analysis:
    Calculate the average price per square foot for the zip code.
    Compare each property's price to the average and identify those listed below market value.
  Comparable Sales:
    Highlight properties that are priced significantly lower than their comps.

  ### Reflection 
  - This project uses RedFin data and analytics to help students understand real estate trends. It gathers property details like prices, sizes, and bedrooms/bathrooms through web scraping. By analyzing market values, it identifies properties priced below the average. The project gives users a clearer picture of the market, and through data-driven insights, it helps buyers and renters make informed decisions about their next home.

## Project Architecture

### Backend Components
The backend of AffordAbode consists of several key components:

1. **Model Layer** (`/model` directory):
   - Contains the machine learning model for housing recommendations
   - Uses ONNX runtime for model inference
   - Includes personal recommendation system (`personal_recs.py`)
   - Provides API endpoints through `pyapi.py`

2. **Redfin Scraper** (`/redfinscraper` directory):
   - Python-based web scraper for Redfin listings
   - Collects real-time housing data
   - Integrates with the Next.js frontend through API endpoints

### Frontend Integration
The project uses Next.js as the frontend framework, which:
- Embeds and executes the Python backend components
- Provides a modern, responsive user interface
- Communicates with the backend through API endpoints
- Handles data visualization and user interactions

### Data Flow
1. Next.js frontend makes requests to the backend API
2. Backend processes requests using the ML model and Redfin scraper
3. Results are returned to the frontend for display
4. User interactions trigger new data collection and analysis

## Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/cmpe_272_project_spring2025-.git
cd cmpe_272_project_spring2025-
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt

# Additional required packages
pip install scrapy
pip install scrapy-selenium
pip install selenium webdriver-manager
pip install selenium==4.9.1
pip install undetected-chromedriver==3.4.6
pip install httpx
pip install fastapi uvicorn onnxruntime numpy
```

Note: Make sure you have Chrome browser installed as it's required for the web scraping functionality.

## Usage
1. Configure your environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

2. Run the application:
```bash
python app.py
```

3. Access the web interface at `http://localhost:3000`

## Project Structure
```
affordabode/
├── app/                # Next.js application files
├── components/         # React components
├── model/             # Backend ML model and API
│   ├── inference.py   # Model inference logic
│   ├── personal_recs.py # Personalization system
│   └── pyapi.py       # API endpoints
├── redfinscraper/     # Redfin data collection
│   ├── RedFinSearchHelper.py
│   └── scrapy.cfg
├── public/            # Static assets
└── utils/            # Utility functions
```

