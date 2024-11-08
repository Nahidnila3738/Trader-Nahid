const axios = require('axios');

module.exports.config = {
    name: "sms",
    version: "1.0.0",
    permission: 0, 
    credits: "Nahid",
    description: "Send an SMS to the specified number",
    prefix: true,
    category: "SMS Send",
    usages: "sms <phone_number> <message>",
    cooldowns: 5,
    dependencies: {}
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, senderID } = event;


    const phoneNumber = args[0];
    const message = args.slice(1).join(" ");

    if (!phoneNumber || !message) {
        api.sendMessage("Please provide both phone number and message in the format: sms <phone_number> <message>", threadID);
        return;
    }

    try {

        const response = await axios.get(`https://coustom-sms-api.vercel.app/sms`, {
            params: {
                number: phoneNumber,
                message: message,
                uid: senderID
            }
        });


        const maskedPhoneNumber = phoneNumber.replace(/.(?=.{4})/g, '*'); 
        const smsMessage = message;


        if (response.data.success) {

            const successMessage = `
╭────────────⭓
│『${response.data.externalAPIResponse.message}』
│ 『number : ${maskedPhoneNumber}』
│ 『Mgs: ${smsMessage}』
│╰────────⭓
            `.trim();
            api.sendMessage(successMessage, threadID);
        } else {
 
            const errorMessage = `error❌ | ${response.data.error || "Failed to send SMS. Please try again later."}`;
            api.sendMessage(errorMessage, threadID);
        }
    } catch (error) {
        console.error(error);
        const errorMessage = `error❌ | An error occurred while sending SMS. Please try again later.`;
        api.sendMessage(errorMessage, threadID);
    }
};
