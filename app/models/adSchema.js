import mongoose from "mongoose";
const adSchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    daily_budget: {
        type: Number,
       
    },
    keywords: {
        type: Array,
    },
});

const Ad = mongoose.model("Ad", adSchema);

export default Ad;