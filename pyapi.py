from fastapi import FastAPI
from pydantic import BaseModel
import onnxruntime as ort
import numpy as np

app = FastAPI()
session = ort.InferenceSession("/home/guna/272/AbodeAfford/Main/xgb_model.onnx")
input_name = session.get_inputs()[0].name

class InputData(BaseModel):
    encoded_address: float
    beds: int
    baths: int
    area: float

@app.post("/predict")
def predict(data: InputData):
    input_array = np.array([[data.encoded_address, data.beds, data.baths, data.area]], dtype=np.float32)
    result = session.run(None, {input_name: input_array})
    prediction = float(result[0][0])
    return {"predicted_price": prediction}
