const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema(
    {
        name : String,
        email : String,
        subject : String,
        message : String,
        created_at : Date
    },
    {
        collection : "contact_info"
    }
);

module.exports = mongoose.model("contactSchema",contactSchema)