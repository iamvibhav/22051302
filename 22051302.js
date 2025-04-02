const axios = require('axios');

const url = "http://20.244.56.144/evaluation-service/register";

const data = {
  email: "22051302@kiit.ac.in",
  name: "Vibhav",
  mobileNo: "9454025200",
  githubUsername: "iamvibhav",
  rollNo: "22051302",
  collegeName: "KIIT University",
  accessCode: "nwpwrZ"
};

axios.post(url, data)
  .then(response => {
    const { clientID, clientSecret } = response.data;
    console.log("Registration Successful!");
    console.log("Client ID:", clientID);
    console.log("Client Secret:", clientSecret);
  })
  .catch(error => {
    console.error("Error:", error.response ? error.response.data : error.message);
  });