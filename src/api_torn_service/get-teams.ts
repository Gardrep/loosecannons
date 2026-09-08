import useAPIKey from "../components/api-key-validator/api-key-store";

export default async function getTeams() {
  console.log("getTeams=>")
  const API_KEY: string = useAPIKey.getState().getApiKey()
  const url = `https://api.torn.com/v2/torn/elimination?key=${API_KEY}`;
  
  const options = {
    method: 'GET',
    headers: {
      'accept': 'application/json', // Tells the server we are sending JSON
    },
  };

  try {
    if(!API_KEY)  throw new Error(`No Api Key`);
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    console.log('getTeams-Success:', result);
    return result;
  } catch (error) {
    console.error('getTeams-Failed:', error);
  }
}