import json

def load_json(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def combine_data(jsonA, jsonB):
    combined_data = []
    
    # Create a dictionary from jsonB for quick lookup by id
    jsonB_dict = {hotel['id']: hotel for hotel in jsonB}
    
    # Iterate through jsonA hotels
    for hotel in jsonA['hotels']:
        hotel_id = hotel['id']
        
        # If hotel_id exists in jsonB_dict, combine data
        if hotel_id in jsonB_dict:
            combined_entry = {
                "id": hotel_id,
                "price": hotel['price'],
                "name": jsonB_dict[hotel_id]['name'],
                "imageUrl": f"{jsonB_dict[hotel_id]['image_details']['prefix']}{jsonB_dict[hotel_id]['image_details']['count']-1}{jsonB_dict[hotel_id]['image_details']['suffix']}",
                "StarRating": jsonB_dict[hotel_id]['rating'],
                "GuestRating": jsonB_dict[hotel_id]['trustyou']['score']['kaligo_overall']
            }
            combined_data.append(combined_entry)
    
    return combined_data

def main():
    # Load JSON data from files
    jsonA = load_json('jsonA.json')
    jsonB = load_json('jsonB.json')

    # Combine the data
    combined_data = combine_data(jsonA, jsonB)

    # Print the combined data
    print(json.dumps(combined_data, indent=4))

    # Optionally, save the combined data to a JSON file
    with open('combined_data.json', 'w') as f:
        json.dump(combined_data, f, indent=4)

if __name__ == "__main__":
    main()
