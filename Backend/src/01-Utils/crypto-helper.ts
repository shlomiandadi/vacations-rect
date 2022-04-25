import crypto from "crypto";

function hash(plainText: string) {

    if(!plainText) return null;

    // Hashing with salt:
    const salt = "MakeThingsGoRight"
    return crypto.createHmac("sha512", salt).update(plainText).digest("hex");
}

export default {
    hash
};