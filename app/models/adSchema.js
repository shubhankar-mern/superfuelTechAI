import mongoose from "mongoose";
const adSchema = new mongoose.Schema({
    id:{
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    daily_budget: {
        type: Number,
        default: 0,
        required: true,
       
    },
    keywords: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Keyword",
        default: [],
    },
});
adSchema.pre('save', async function(next) {
    if (this.isNew) {
      const maxDoc = await mongoose.models.Ad.findOne({}, { id: 1 }).sort({ id: -1 });
      this.id = maxDoc ? maxDoc.id + 1 : 1;
    }
    next();
  });
const Ad = mongoose.model("Ad", adSchema);

export default Ad;