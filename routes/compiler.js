require('dotenv').config();
var express =  require('express');
var router =  express.Router();
var axios = require('axios');

var submissionToken='';
router.post('/',async (req,res)=>{
    const { code, language_id, input } = req.body;
  
     console.log(input);
     console.log(typeof(input));
   
   //  console.log("Kokonod\n10 20");
    const requestData = {
        // "source_code": code,
        // "language_id" :language_id,
        // "stdin": input,
        "source_code": code ,//"#include <iostream>\n#include <string>\n\nusing namespace std;\n\nint main() {\n    string name;\n    cout << \"Please enter your name: \";\n    cin >> name;\n    cout << \"Hello, \" << name << \"!\" << endl;\n\n    int num1, num2;\n    cout << \"Please enter two numbers: \";\n    cin >> num1 >> num2;\n    int sum = num1 + num2;\n    cout << \"The sum of \" << num1 << \" and \" << num2 << \" is \" << sum << endl;\n\n    return 0;\n}",
            "language_id": language_id,
            "stdin": "10 20"
          
    };
    try {
        const response = await axios.post('https://judge0.p.rapidapi.com/submissions', requestData, {
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'X-RapidAPI-Key': '1c1032c4admsh017b04fbc8680a4p173177jsn95a4c2a62b1c'
    }
  });
  submissionToken = response.data.token;
  console.log(submissionToken);
    } catch (error) {
        res.json(error);
    }

     const getResultUrl = `https://judge0.p.rapidapi.com/submissions/${submissionToken}?base64_encoded=true&fields=stdout`;

     setTimeout(async () => {
       const resultResponse = await axios.get(getResultUrl, {
         headers: {
           'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
           'X-RapidAPI-Key':  '1c1032c4admsh017b04fbc8680a4p173177jsn95a4c2a62b1c'

         }
       });
  
       const output = Buffer.from(resultResponse.data.stdout, 'base64').toString('utf-8');
       console.log(output);
  
       res.json({ output});
     }, 5000); // Wait 5 seconds before getting the result
  });
module.exports = router;