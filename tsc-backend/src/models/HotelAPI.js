class HotelAPI {
    constructor(baseURL = 'https://hotelapi.loyalty.dev') {
      this.baseURL = baseURL;
    }
  
    async getHotelPrices(params) {
      const url = new URL(`${this.baseURL}/api/hotels/prices`);
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
      const response = await fetch(url);
      return response.json();
    }
  
    async getHotelPrice(hotelId, params) {
      const url = new URL(`${this.baseURL}/api/hotels/${hotelId}/price`);
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
      const response = await fetch(url);
      return response.json();
    }
  
    async getHotelsForDestination(destinationId) {
      const url = new URL(`${this.baseURL}/api/hotels`);
      url.searchParams.append('destination_id', destinationId);
      const response = await fetch(url);
      return response.json();
    }
  
    async getHotelDetails(hotelId) {
      const url = new URL(`${this.baseURL}/api/hotels/${hotelId}`);
      const response = await fetch(url);
      return response.json();
    }
  }
  
  export default HotelAPI;
  // Example usage:
  // const api = new HotelAPI();
  // 
  // api.getHotelPrices({
  //   destination_id: 'WD0M',
  //   checkin: '2024-10-01',
  //   checkout: '2024-10-07',
  //   lang: 'en_US',
  //   currency: 'SGD',
  //   country_code: 'SG',
  //   guests: '2',
  //   partner_id: '1'
  // }).then(data => console.log(data));
  // 
  // api.getHotelPrice('diH7', {
  //   destination_id: 'WD0M',
  //   checkin: '2024-10-01',
  //   checkout: '2024-10-07',
  //   lang: 'en_US',
  //   currency: 'SGD',
  //   country_code: 'SG',
  //   guests: '2',
  //   partner_id: '1'
  // }).then(data => console.log(data));
  // 
  // api.getHotelsForDestination('RsBU').then(data => console.log(data));
  // 
  // api.getHotelDetails('diH7').then(data => console.log(data));