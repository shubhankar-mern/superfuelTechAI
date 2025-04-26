import mongoose from "mongoose";
const keywordSchema = new mongoose.Schema({
    id:{
        type: Number,
    },
    text: {
        type: String,
        unique: true,
    },
    bid: {
        type: Number,
    },
    match_type: {
        type: String,
        enum: ["exact", "phrase", "broad"],
    },
    state: {
        type: String,
        enum: ["enabled", "disabled"],
    },
   
});

const Keyword = mongoose.model("Keyword", keywordSchema);

export default Keyword;