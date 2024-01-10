import mongoose from "mongoose";

const assistantSchema = new mongoose.Schema({
  assistantId: { type: String, required: true },
  threadIds: { type: Array, required: true },
});

export default mongoose.model("assistants", assistantSchema);
