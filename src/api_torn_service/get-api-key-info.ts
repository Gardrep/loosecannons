export default async function getApiKeyInfo(API_KEY: string) {
  const url = `https://api.torn.com/v2/key/info?key=${API_KEY}`;
  
  const options = {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    console.log('getApiKeyInfo-Success:', result);
    return result;
  } catch (error) {
    console.error('Post failed:', error);
  }
}