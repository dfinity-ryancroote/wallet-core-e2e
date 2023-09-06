import assert from "assert";
import { initWasm, TW } from "../dist";
import axios from "axios";
const Long = require("long");
const now = require("nano-time");

const TARGET_ADDRESS: string = "943d12e762f43806782f524b8f90297298a6d79e4749b41b585ec427409c826a";
const WALLET_ADDRESS: string = "b9a13d974ee9db036d5abc5b66ace23e513cb5676f3996626c7717c339a3ee87";
const url = (path: string) => `http://localhost:9000${path}`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type GetBalance = (address: string) => Promise<string>;
type SubmitTransaction = (signedTransaction: string) => Promise<string>;
type IsTransactionSynced = (transactionHash: string) => Promise<boolean>;

const getBalance: GetBalance = async (address: string) => {
    const data = {
        "network_identifier": {
            "blockchain": "Internet Computer",
            "network": "00000000000000020101"
        },
        "account_identifier": {
            "address": address,
            "sub_account": null,
            "metdata": {}
        }
    };
    const response = await axios.post(url("/account/balance"), data).catch((error) => {
        return error.response;
    });

    if (response.status !== 200) {
        throw new Error(`Failed to get balance for ${address}`);
    }

    return response.data.balances[0].value;
};

const submitTransaction: SubmitTransaction = async (signedTransaction: string) => {
    const data = JSON.stringify({
        network_identifier: {
            blockchain: "Internet Computer",
            network: "00000000000000020101"
        },
        signed_transaction: signedTransaction
    });
    const response = await axios.post(url("/construction/submit"), data, {
        headers: {
            "Content-Type": "application/json"
        }
    }).catch((error) => {
        return error.response;
    });

    if (response.status !== 200) {
        console.dir(response.data.details, { depth: null, colors: true });
    }

    return response.data.transaction_identifier.hash;
};

const isTransactionSynced: IsTransactionSynced = async (transactionHash: string) => {
    const lookupTransaction = async (transactionHash: string) => {
        const data = JSON.stringify({
            network_identifier: {
                blockchain: "Internet Computer",
                network: "00000000000000020101"
            },
            transaction_identifier: {
                hash: transactionHash
            },
        });

        const response = await axios.post(url("/search/transactions"), data, {
            headers: {
                "Content-Type": "application/json"
            }
        }).catch((error) => {
            return error.response;
        });

        return response;
    };

    let found = false;
    let attempts = 100;
    while (attempts >= 0) {
        const response = await lookupTransaction(transactionHash);
        if (response.status === 200 && response.data.total_count > 0) {
            found = true;
            break;
        }

        console.dir(response.data, { depth: null, colors: true });

        attempts -= 1;
        await sleep(1000);
    }

    return found;
};

(async () => {
    const mnemonic =
        "shoot island position soft burden budget tooth cruel issue economy destroy above";
    const core = await initWasm();

    const wallet = core.HDWallet.createWithMnemonic(mnemonic, "");
    const privateKey = wallet.getKeyForCoin(core.CoinType.internetComputer);
    const privateKeyBytes = privateKey.data();
    const address = wallet.getAddressForCoin(core.CoinType.internetComputer);

    assert.equal(address, WALLET_ADDRESS, "Expected wallet address does not match");

    const balance = await getBalance(address);

    assert.equal(balance, "5000000000", "Wallet balance does not match");

    const currentTimestampNanos = Long.fromString(now());
    const input = TW.InternetComputer.Proto.SigningInput.create({
        transaction: TW.InternetComputer.Proto.Transaction.create({
            transfer: TW.InternetComputer.Proto.Transaction.Transfer.create({
                toAccountIdentifier: TARGET_ADDRESS,
                amount: new Long(100000000),
                memo: new Long(0),
                currentTimestampNanos
            })
        }),
        privateKey: privateKeyBytes
    });

    const encoded = TW.InternetComputer.Proto.SigningInput.encode(input).finish();

    const outputData = core.AnySigner.sign(encoded, core.CoinType.internetComputer);
    const output = TW.InternetComputer.Proto.SigningOutput.decode(outputData);
    const signedTransaction = core.HexCoding.encode(output.signedTransaction);

    const transactionHash = await submitTransaction(signedTransaction.split("0x")[1]);

    const synced = await isTransactionSynced(transactionHash);
    assert.ok(synced, "Transaction is not synced");

    const targetBalance = await getBalance(TARGET_ADDRESS);

    assert.equal(targetBalance, "100000000", "Target balance does not match");
})();