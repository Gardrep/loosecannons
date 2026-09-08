import useAPIKey from "../components/api-key-validator/api-key-store";

export default async function getSpecificTeam(teamId: number) {
  const API_KEY: string = useAPIKey.getState().getApiKey()
  const url = `https://api.torn.com/v2/torn/${teamId}/eliminationteam?limit=100&key=${API_KEY}`;
  
  const options = {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  };

  try {
    if(!API_KEY)  throw new Error(`No Api Key`);
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    console.log('getSpecificTeam-Success:', result);
    return result;
  } catch (error) {
    console.error('getSpecificTeam-Failed:', error);
  }
}