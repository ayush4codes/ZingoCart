import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const uri = "mongodb+srv://thunder90:basbhaiabnhihota@zc.vbkjcpk.mongodb.net/?appName=zc";

console.log("Connecting to MongoDB Atlas...");
try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log("Connected successfully!");
  console.log("Database Name:", mongoose.connection.name);
  
  // Test writing a sample vendor
  const VendorSchema = new mongoose.Schema({
    name: String,
    storeName: String,
    email: String
  });
  
  const TestVendor = mongoose.models.TestVendor || mongoose.model('TestVendor', VendorSchema);
  
  console.log("Saving a test document...");
  const sample = new TestVendor({
    name: "Diag Test",
    storeName: "Diag Shop",
    email: "diag_" + Date.now() + "@test.com"
  });
  await sample.save();
  console.log("Saved successfully!");
  
  // Clean up
  await TestVendor.deleteOne({ _id: sample._id });
  console.log("Cleaned up sample document!");
  
  await mongoose.disconnect();
  console.log("Disconnected successfully!");
  process.exit(0);
} catch (err) {
  console.error("Connection failed with error:");
  console.error(err);
  process.exit(1);
}
