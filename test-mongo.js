const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

const { MongoClient } = require("mongodb");

const uri =
    "mongodb://ac-zyuc07x-shard-00-01.mlukesk.mongodb.net:27017/?tls=true&replicaSet=atlas-aexzlz-shard-0&authSource=admin";

const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000
});

async function test() {
    try {
        await client.connect();

        console.log("MongoDB BERHASIL TERHUBUNG");

        const result = await client.db("admin").command({
            ping: 1
        });

        console.log(result);
    } catch (error) {
        console.log("MongoDB GAGAL");
        console.log(error.message);
    } finally {
        await client.close();
    }
}

test();