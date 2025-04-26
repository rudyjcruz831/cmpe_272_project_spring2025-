package handler



//Define the structure based on RentCast's API Response
type RentalListing struct {
    Address string json:"address"
    City string json: "city"
    State     string json: "State "
    RentPrice float64 json: "rentPrice"
    Bedrooms int json: "bedrooms"
    Bathrooms int json: "bathrooms"
}

type RentalResponse struct {
    LisListings []RentalListing json: "listings"
}

func fetchRentalListings(apiKey, city, state string) ([]RentalListing, error){
	url := fmt.Sprintf("https://api.rentcast.io/v1/lisitngs?city=%s&state=%s", city, state)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil{
		return nil, err
	}

	//RentCast.io API Key
	req.Header.Add("35c10aea96e74d668d011ac74f60d25a", apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status: %s", resp.Status)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var rentalData RentalResponse
	if err := json.Unmarshal(body, &rentalData); err != nil {
		return nil, err
	}

	return rentalData.Listings, nil
}

//test function
func main() {
	apiKey := "YOUR_RENTCAST_API_KEY"
	city := "San Jose"
	state := "CA"

	listings, err := fetchRentalListings(apiKey, city, state)
	if err != nil {
		log.Fatalf("Error fetching rental listings: %v", err)
	}

	for _, listing := range listings {
		fmt.Printf("Address: %s, %s, %s | Rent: $%.2f | Beds: %d | Baths: %d\n",
			listing.Address, listing.City, listing.State, listing.RentPrice, listing.Bedrooms, listing.Bathrooms)
	}
}