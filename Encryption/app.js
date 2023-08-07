var RSA = require('hybrid-crypto-js').RSA;
var Crypt = require('hybrid-crypto-js').Crypt;
var readline = require('readline');

var entropy = 'Random string, integer or float';
var rsa = new RSA({ entropy: entropy });


// Alternate AES keysize (some AES algorithms requires specific key size)
var crypt = new Crypt({
    // Increase amount of entropy
    entropy: entropy,
    // Default AES standard is AES-CBC. Options are:
    // AES-ECB, AES-CBC, AES-CFB, AES-OFB, AES-CTR, AES-GCM, 3DES-ECB, 3DES-CBC, DES-ECB, DES-CBC
    aesStandard: 'AES-GCM',
    // Default RSA standard is RSA-OAEP. Options are:
    // RSA-OAEP, RSAES-PKCS1-V1_5
    rsaStandard: 'RSA-OAEP',
    // Select default message digest
    md: 'sha512',
    aesKeySize: 256, // Defaults to 256,
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Create a function to read user input
function getUserInput(prompt) {
    return new Promise((resolve) => {
            rl.question(prompt, (answer) => {
            resolve(answer);
        });
    });
}

rsa.generateKeyPair(function(keyPair) {
    // Callback function receives new key pair as a first argument
    var publicKey = keyPair.publicKey;
    var privateKey = keyPair.privateKey;

    main(publicKey,privateKey)
});


// Usage example: reading two user inputs
async function main(publicKey,privateKey) {
    var message = await getUserInput('Enter the message : ');

    // Encryption with one public RSA key
    var encrypted = crypt.encrypt(publicKey, message);
    var result = JSON.parse(encrypted);

    console.log("\n******Encrypted data******\n");
    console.log("Encrypted cipher using AES Key : ",result.cipher);
    console.log("encrypted AES key : ",result.keys);

    var decrypted = crypt.decrypt(privateKey, encrypted);

    // Get decrypted message
    console.log("\n******Decrypted data******\n")
    var result = decrypted.message;
    console.log("Decrpyed message : ",result)
    rl.close();
}


