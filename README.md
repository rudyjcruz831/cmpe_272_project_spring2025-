# Welcome to AffordAbode!
cmpe_272_project_spring2025-
Project for Enterprise Software Engineering Platforms Spring 2025

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Features](#features)

## Overview
AffordAbode is a powerful data analysis tool designed to help users find below-market housing deals by analyzing Zillow data. The project serves two main target demographics:
1. Low-income and commuter students seeking affordable housing near campus
2. Work From Home (WFH) workers transitioning to Return To Office (RTO) requirements

## Zillow Data Analyzer for Finding Below-Market Housing Deals (Possible target demographics)
1. Problem: Low-income and commuter students are looking for rent in high-income areas, often near their campus.
2. OR With an emphasis on WFH (Work From Home) workers having to abide by RTO (Return To Office), identify the best housing within an acceptable commuting range of their office.  

Solution:
- Build a data analysis tool that scrapes and analyzes Zillow data to identify below-market housing deals in a given zip code.
- Use Python with libraries like BeautifulSoup or Scrapy for web scraping Zillow listings.
- Analyze the data using Pandas and NumPy to identify properties listed below market value based on historical price trends, comparable sales, and neighborhood averages.
- Use Metabase or Superset for visualizing insights and generating reports.
- Deploy the tool as a web application using Flask or Streamlit for easy access.
  
Key Features:
  Data Collection:
    1. Scrape Zillow listings for a specific zip code, including property details like price, square footage, number of bedrooms/bathrooms, and listing date.
    2. Use Zillow API (if available) or web scraping to collect data.

   Market Value Analysis:
    1. Calculate the average price per square foot for the zip code.
    2. Compare each property's price to the average and identify those listed below market value.
  Comparable Sales:
    1. Identify comparable properties (comps) that have recently sold in the area.
    2. Highlight properties that are priced significantly lower than their comps.
  Neighborhood Insights:
    1. Provide insights into neighborhood trends, such as average days on market, price reductions, and demand.

  ### Reflection 
  - This project uses Zillow data and analytics to help students understand real estate trends. It gathers property details like prices, sizes, and listing dates through web scraping or the Zillow API. By analyzing market values, it identifies properties priced below the average and compares them with similar recently sold homes. The project also tracks neighborhood trends, such as price changes and demand, to give users a clearer picture of the market. Through data-driven insights, it helps buyers and renters make informed decisions about their next home.'

  - This project uses Zillow data and analytics to help RTO workers find the best housing with their needs. It gathers property details like distance from the office and transportation options to get to the office. By analyzing market values, it identifies properties priced below the average and compares them with similar recently sold homes. The project also tracks neighborhood trends, such as price changes and demand, to give users a clearer picture of the market. Through data-driven insights, it helps these workers make informed decisions about what and where to buy or rent to fulfill their office's ROT requirements.

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

