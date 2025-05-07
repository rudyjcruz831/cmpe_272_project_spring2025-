package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "log"
    "net/http"
)

type InputData struct {
    EncodedAddress float32 `json:"encoded_address"`
    Beds           int     `json:"beds"`
    Baths          int     `json:"baths"`
    Area           float32 `json:"area"`
}

type PredictionResponse struct {
    PredictedPrice float64 `json:"predicted_price"`
}

func predictHandler(w http.ResponseWriter, r *http.Request) {
    var input InputData
    err := json.NewDecoder(r.Body).Decode(&input)
    if err != nil {
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    // Forward request to Python inference API
    payload, _ := json.Marshal(input)
    resp, err := http.Post("http://localhost:8000/predict", "application/json", bytes.NewBuffer(payload))
    if err != nil {
        http.Error(w, "Inference service unreachable", http.StatusInternalServerError)
        return
    }
    defer resp.Body.Close()

    var prediction PredictionResponse
    body, _ := io.ReadAll(resp.Body)
    json.Unmarshal(body, &prediction)

    // Return to frontend
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(prediction)
}

func main() {
    http.HandleFunc("/predict", predictHandler)
    fmt.Println("Go server listening on http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
