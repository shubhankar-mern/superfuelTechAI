import mongoose from 'mongoose';

const keywordSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  bid: {
    type: Number,
    required: true
  },
  match_type: {
    type: String,
    enum: ['exact', 'phrase', 'broad'],
    required: true
  },
  state: {
    type: String,
    enum: ['enabled', 'disabled'],
    default: 'enabled'
  }
});

// Compound unique index for text + campaignId
keywordSchema.index({ text: 1, campaignId: 1 }, { unique: true });

// Auto-increment ID
keywordSchema.pre('save', async function(next) {
  if (this.isNew) {
    const maxDoc = await mongoose.models.Keyword.findOne({}, { id: 1 }).sort({ id: -1 });
    this.id = maxDoc ? maxDoc.id + 1 : 1;
  }
  next();
});

export const Keyword = mongoose.models.Keyword || mongoose.model('Keyword', keywordSchema);