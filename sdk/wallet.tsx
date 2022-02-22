import Ripemd160 from 'ripemd160';
import bs58 from "bs58";
const EC = require("elliptic-expo").ec;
const { sha256 } = require("js-sha256");
import { Buffer } from 'buffer';

global.Buffer = Buffer;
process.nextTick = setImmediate;

const ec = new EC('p256');

const version = 0x90;
const addressChecksumLen = 1

const bytesToHex = function(bytes) {
	let hex = [];
	let i = 0;
	for (; i < bytes.length; i++) {
		hex.push((bytes[i] >>> 4).toString(16));
		hex.push((bytes[i] & 0xF).toString(16));
	}
	return hex.join("");
};

const hexToBytes = function (hex) {
	let bytes = [];
	let c = 0;
	hex = hex.toString(16);

	for (; c < hex.length; c += 2)
		bytes.push(parseInt(hex.substr(c, 2), 16));
	return bytes;
};

function checksum(bytes){
	let firstSHA = sha256.create().update(bytes)

	let secondSHA = sha256.create().update(new Uint8Array(firstSHA.arrayBuffer()))

	let newArrayBufferBytes = new Uint8Array(secondSHA.arrayBuffer())

	return newArrayBufferBytes.slice(0, addressChecksumLen)
}

function getAddress(bytes){
	const pubKeyHash = HashPubKey(bytes)
	const versionedPayload = new Uint8Array([version, ...pubKeyHash])

	const check = checksum(versionedPayload)

	const fullPayload = Array.from( new Uint8Array([...versionedPayload, ...check]) )

	return bs58.encode(fullPayload)
}

function HashPubKey(bytes){
	const hash = sha256.create();
	hash.update(bytes);

	const ripemd160stream = new Ripemd160();
	ripemd160stream.end(new Uint8Array(hash.arrayBuffer()));

	return new Uint8Array(ripemd160stream.read());
}


export function createWallet() {
	try {
		const privatePair = ec.genKeyPair();

		const publicKeyBytes = privatePair.getPublic();

		const pubKey = Array.from(new Uint8Array([...publicKeyBytes.getX().toArray(), ...publicKeyBytes.getY().toArray()]));
		const pubKeyToHex = bytesToHex(pubKey)

		const privateKeyToHex = bytesToHex(new Uint8Array(privatePair.getPrivate().toArray()));
		const address = getAddress(pubKey);

		return {
			//publicKeyBytes: pubKey,
			publicKey: pubKeyToHex,
			address: address,
			//privateKeyBytes: privatePair.getPrivate().toArray(),
			privateKey: privateKeyToHex
		};
	} catch (e) {
		console.error("e", e);
		throw e;
	}
}

export function importWalletPrivateKey(pKeyHex){
	const bytesPKey = hexToBytes(pKeyHex)

	const publicKey = ec.keyFromPrivate(bytesPKey).getPublic()

	const pubKey = Array.from(new Uint8Array([...publicKey.getX().toArray(), ...publicKey.getY().toArray()]))

	return {
		publicKey: bytesToHex(pubKey),
		address: getAddress(pubKey),
		privateKey: pKeyHex
	}
}

export function validateAddress(address){
	try {
		let pubKeyHash = bs58.decode(address)

		const arrayBytesAddress = Array.from(new Uint8Array(pubKeyHash))

		const actualChecksum = arrayBytesAddress.slice(arrayBytesAddress.length -addressChecksumLen)

		const version = arrayBytesAddress[0]

		pubKeyHash = pubKeyHash.slice(1, arrayBytesAddress.length -addressChecksumLen)

		const targetChecksum = Array.from(checksum(new Uint8Array([version, ...pubKeyHash])))

		const targetBuffer = Buffer.from(targetChecksum);
		const actualBuffer = Buffer.from(actualChecksum);

		return Buffer.compare(targetBuffer, actualBuffer) === 0
	} catch (e) {
		console.error(e);
	}
}
