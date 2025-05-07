import onnxruntime as ort
import numpy as np

# Load ONNX model
session = ort.InferenceSession("xgb_model.onnx")

# Input name (check what it's called in your model)
input_name = session.get_inputs()[0].name

# Example input: [encoded_address, beds, baths, area]
input_data = np.array([[19, 2, 1, 700]], dtype=np.float32)

# Run inference
output = session.run(None, {input_name: input_data})
predicted_price = float(output[0][0])

print(f"✅ Predicted price: ${predicted_price:.2f}")
