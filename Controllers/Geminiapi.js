const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
// Access your API key as an environment variable (see "Set up your API key" above)


// ...


exports.Newchatwithgemini = async(req,res)=>{
    try {

        const {ques} = req.body;
        //console.log("ques",ques);
        if(!ques)
        {
            return res.status(404).json({
                succsess:false,
                message:"Please Enter your Query"
            })
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
        // The Gemini 1.5 models are versatile and work with most use cases
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        
        const prompt = ques;
        const result = await model.generateContent(prompt); 
        const response =  result.response;
        const text = response.text();
        //console.log(response.text());

        return res.status(200).json({
            succsess:true,
            message:"Query solution generated successfully",
            solution:text
        })
        
    } catch (error) {
        
        console.log("error while generating query ans using gemini",error);
        return res.status(500).json({
            succsess:false,
            message:"Internal server error",
            error:error
        })

    }
}