const axios = require('axios');

const authenticate = async () => {
  const url = "http://20.244.56.144/evaluation-service/auth";
  const data = {
    email: "22051302@kiit.ac.in",
    name: "Vibhav",
    rollNo: "22051302",
    accessCode: "nwpwrZ",
    clientID: "d3cdab3f-5117-48ac-a2d8-beea9f8b906c",
    clientSecret: "uCTrsjgpfbWwckgv"
  };

  try {
    const response = await axios.post(url, data);
    console.log('New Access Token:', response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error('Authentication failed:', error.message);
    throw error;
  }
};

authenticate();