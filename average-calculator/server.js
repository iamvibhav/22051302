require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;

const WINDOW_SIZE = 10;
const THIRD_PARTY_API = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibo",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/random"
};

let numberWindow = [];

const fetchNumbers = async (type) => {
    try {
      const token = process.env.ACCESS_TOKEN?.trim();
      console.log('Full token being used:', token);
      
      const response = await axios.get(THIRD_PARTY_API[type], {
        timeout: 500,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      return response.data.numbers || [];
    } catch (error) {
      if (error.response) {
        console.error(`API Error (${type}):`, {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.config.headers // Log request headers
        });
      } else {
        console.error(`Network Error (${type}):`, error.message);
      }
      return [];
    }
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
};

app.get('/', (req, res) => {
  res.json({
    message: 'Average Calculator API is running',
    endpoints: {
      numbers: '/numbers/:numberid',
      validIds: ['p', 'f', 'e', 'r']
    }
  });
});

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;

  if (!['p', 'f', 'e', 'r'].includes(numberid)) {
    return res.status(400).json({ error: "Invalid number ID. Use 'p', 'f', 'e', or 'r'." });
  }

  try {
    const fetchedNumbers = await fetchNumbers(numberid);
    const uniqueNumbers = fetchedNumbers.filter(num => !numberWindow.includes(num));
    numberWindow = [...numberWindow, ...uniqueNumbers];

    if (numberWindow.length > WINDOW_SIZE) {
      numberWindow = numberWindow.slice(-WINDOW_SIZE);
    }

    const average = calculateAverage(numberWindow);

    const response = {
      windowPrevState: numberWindow.slice(0, -uniqueNumbers.length),
      windowCurrState: numberWindow,
      numbers: fetchedNumbers,
      avg: average
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested endpoint does not exist' });
});

app.listen(PORT, () => {
  console.log(`Average Calculator Microservice running on http://localhost:${PORT}`);
});