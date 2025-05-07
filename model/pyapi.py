from fastapi import FastAPI
from pydantic import BaseModel
import onnxruntime as ort
import numpy as np
import math
from fastapi.middleware.cors import CORSMiddleware

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
    baths: int
    area: float
    price: float  # User-provided rent

# Hello World endpoint
@app.get("/")
def hello_world():
    return {"message": "Hello World! Welcome to the Property Price Prediction API"}

# Deal evaluation logic (returns only numeric metrics)
def evaluate_deal(predicted_rent: float, price: float):
    if predicted_rent <= 0:
        return {
            "percent_difference": 0.0,
            "normalized_score": 0.0
        }

    percent_diff = (predicted_rent - price) / predicted_rent
    normalized_score = 100 * (1 - ((price - predicted_rent) / predicted_rent))
    normalized_score = max(0, min(130, normalized_score))  # Optional cap

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