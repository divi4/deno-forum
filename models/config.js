// Need to place password in config file
const config = {
  secretKey: await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"],
  ),
  jwtAlgorithm: "HS512",
};

export { config };
