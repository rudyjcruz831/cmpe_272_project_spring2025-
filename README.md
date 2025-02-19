# cmpe_272_project_spring2025-
Project for Enterprise Software Engineering Platforms Spring 2025

## Disaster Recovery and Backup System

Problem: Enterprises need a cost-effective disaster recovery
solution.
Solution:
  - Use Restic or BorgBackup for automated backups.
  - Store backups in MinIO or Ceph (open-source object storage).
  - Use Prometheus and Alertmanager for monitoring and alerts.


## Zillow Data Analyzer for Finding Below-Market Housing Deals
Problem: Homebuyers and real estate investors often struggle to identify the best housing deals in a specific area, especially properties listed below market value.

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
    2. Compare each property’s price to the average and identify those listed below market value.
  Comparable Sales:
    1. Identify comparable properties (comps) that have recently sold in the area.
    2. Highlight properties that are priced significantly lower than their comps.
  Neighborhood Insights:
    1. Provide insights into neighborhood trends, such as average days on market, price reductions, and demand.

  ### Reflection 
  - This project uses Zillow data and analytics to help homebuyers and renters understand real estate trends. It gathers property details like prices, sizes, and listing dates through web scraping or the Zillow API. By analyzing market values, it identifies properties priced below the average and compares them with similar recently sold homes. The project also tracks neighborhood trends, such as price changes and demand, to give users a clearer picture of the market. Through data-driven insights, it helps buyers and renters make informed decisions about their next home.
