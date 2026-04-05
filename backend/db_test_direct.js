const mongoose = require('mongoose');
const uri = "mongodb://priyanshushingole_db_user:Priya147%23*@ac-ragifum-shard-00-00.pqyrk4s.mongodb.net:27017,ac-ragifum-shard-00-01.pqyrk4s.mongodb.net:27017,ac-ragifum-shard-00-02.pqyrk4s.mongodb.net:27017/?ssl=true&replicaSet=atlas-z8k25l-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster1";
// Note: replicaSet name might be different, let's try without it first.
const uri2 = "mongodb://priyanshushingole_db_user:Priya147%23*@ac-ragifum-shard-00-00.pqyrk4s.mongodb.net:27017,ac-ragifum-shard-00-01.pqyrk4s.mongodb.net:27017,ac-ragifum-shard-00-02.pqyrk4s.mongodb.net:27017/?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster1";

async function test() {
  try {
    await mongoose.connect(uri2, { serverSelectionTimeoutMS: 5000 });
    console.log("SUCCESS");
    process.exit(0);
  } catch(e) {
    console.error("FAIL", e);
    process.exit(1);
  }
}
test();
