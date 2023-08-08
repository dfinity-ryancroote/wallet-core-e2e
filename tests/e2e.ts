import { initWasm } from "../dist";
import axios from "axios";

const WALLET_ADDRESS: string = "b9a13d974ee9db036d5abc5b66ace23e513cb5676f3996626c7717c339a3ee87";
const url = (path: string) => `http://localhost:9000${path}`;

type GetBalance = (address: string) => Promise<string>;
type SubmitTransaction = (signedTransaction: string) => Promise<string>;

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
        console.log(response.data);
        throw new Error(`Failed to get balance for ${address}`);
    }

    return response.data.balances[0].value;
};

const submitTransaction: SubmitTransaction = async (signedTransaction: string) => {
    const response = await axios.post(url("/construct/submit"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });

    return response.data.transaction;
};


(async () => {
    const mnemonic =
        "shoot island position soft burden budget tooth cruel issue economy destroy above";
    const core = await initWasm();

    const wallet = core.HDWallet.createWithMnemonic(mnemonic, "");
    const privateKey = wallet.getKeyForCoin(core.CoinType.bitcoin);
    const address = wallet.getAddressForCoin(core.CoinType.internetComputer);

    const balance = await getBalance(address);

    console.assert(address == WALLET_ADDRESS, "Address does not match");
    console.assert(balance == "5000000000");
})();