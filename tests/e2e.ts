import { initWasm } from "../dist";
import axios from "axios";

const WALLET_ADDRESS: string = "b9a13d974ee9db036d5abc5b66ace23e513cb5676f3996626c7717c339a3ee87";
const url = (path: string) => `http://localhost:9000${path}`;

const TRANSACTION: string = "81826b5452414e53414354494f4e81a266757064617465a367636f6e74656e74a66c726571756573745f747970656463616c6c6e696e67726573735f6578706972791b1779c1bd172354986673656e646572581d971cd2ddeecd1cf1b28be914d7a5c43441f6296f1f9966a7c8aff68d026b63616e69737465725f69644a000000000000000201016b6d6574686f645f6e616d656773656e645f706263617267583c0a0012070a050880c2d72f1a0308904e2a1e0a1c62f43806782f524b8f90297298a6d79e4749b41b585ec427409c826a3a0a0898f9eff6f1b5f0bc176d73656e6465725f7075626b65799858183018561830100607182a1886184818ce183d02010605182b188104000a0318420004183d18ab183a182118a81838184d184c187e1852188a187e18dc18d8184418ea18cd18c5189518ac188518b518bc181d188515186318bc18e618ab18d2184318d3187c184f18cd18f018de189b18b5181918dd18ef1889187218e71518c40418d4189718881843187218c611182e18cc18e6186b182118630218356a73656e6465725f73696799019618d918d918f718a318671863186f186e18741865186e187418a7186c1872186518711875186518731874185f1874187918701865186418631861186c186c1865186e186f186e186318651850189c18540b186c18761822186e18aa189718fc181c1858188f18de188718f4186e1869186e18671872186518731873185f186518781870186918721879181b17187918c118af181f1835187618d8186618731865186e1864186518721858181d1897181c18d218dd18ee18cd181c18f118b2188b18e91418d718a518c41834184118f61829186f181f1899186618a718c818af18f6188d02186b18631861186e18691873187418651872185f18691864184a00000000000000020101186b186d186518741868186f1864185f186e1861186d1865186718731865186e1864185f1870186218631861187218671858183c0a0012070a0508188018c218d7182f181a03081890184e182a181e0a181c186218f41838061878182f1852184b188f189018291872189818a618d7189e1847184918b4181b1858185e18c418271840189c1882186a183a0a08189818f918ef18f618f118b518f018bc17186d18731865186e186418651872185f187018751862186b1865187918581858183018561830100607182a1886184818ce183d02010605182b188104000a0318420004183d18ab183a182118a81838184d184c187e1852188a187e18dc18d8184418ea18cd18c5189518ac188518b518bc181d188515186318bc18e618ab18d2184318d3187c184f18cd18f018de189b18b5181918dd18ef1889187218e71518c40418d4189718881843187218c611182e18cc18e6186b18211863021835186a18731865186e186418651872185f1873186918671858184018ca18e918d718d218f6186d15183b183d188e18b618ea185518a718fa1865189018a118e518c418c8187918b218eb18f51852183518ed182b18a718cf182c182c18940f18f618be1837187f187e184318bd18d0186618b318d918d0181f182618f6183a189818e318da18aa188718df18e7185f18fa18fb183415016a726561645f7374617465a367636f6e74656e74a46c726571756573745f747970656a726561645f73746174656e696e67726573735f6578706972791b1779c1bd172354986673656e646572581d971cd2ddeecd1cf1b28be914d7a5c43441f6296f1f9966a7c8aff68d0265706174687381824e726571756573745f7374617475735820fe121a4732ae6ee0d30be9e8e9b421a970fafed0e233cc503a9c07ad0b1d37576d73656e6465725f7075626b65799858183018561830100607182a1886184818ce183d02010605182b188104000a0318420004183d18ab183a182118a81838184d184c187e1852188a187e18dc18d8184418ea18cd18c5189518ac188518b518bc181d188515186318bc18e618ab18d2184318d3187c184f18cd18f018de189b18b5181918dd18ef1889187218e71518c40418d4189718881843187218c611182e18cc18e6186b182118630218356a73656e6465725f73696799015118d918d918f718a318671863186f186e18741865186e187418a4186c1872186518711875186518731874185f1874187918701865186a1872186518611864185f18731874186118741865186e1869186e18671872186518731873185f186518781870186918721879181b17187918c118af181f186118b310186618731865186e1864186518721858181d1897181c18d218dd18ee18cd181c18f118b2188b18e91418d718a518c41834184118f61829186f181f1899186618a718c818af18f6188d0218651870186118741868187318811882184e1872186518711875186518731874185f1873187418611874187518731858182018fe12181a1847183218ae186e18e018d30b18e918e818e918b4182118a9187018fa18fe18d018e2183318cc1850183a189c0718ad0b181d18371857186d18731865186e186418651872185f187018751862186b1865187918581858183018561830100607182a1886184818ce183d02010605182b188104000a0318420004183d18ab183a182118a81838184d184c187e1852188a187e18dc18d8184418ea18cd18c5189518ac188518b518bc181d188515186318bc18e618ab18d2184318d3187c184f18cd18f018de189b18b5181918dd18ef1889187218e71518c40418d4189718881843187218c611182e18cc18e6186b18211863021835186a18731865186e186418651872185f1873186918671858184018b218da18b01845181f18c118af18f91886182818b518d4187518a018341878182e18ff1866188f18a918af18a81861185418cd18f618f80f188a041854050018b318ed18a0188d181f18d018d418cb18a718581850011819188a189f181b18181876182d18e618bc182718c018ec182a1018fb184f187c18d1";

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
    console.log("submitting transaction");
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

    const t = await submitTransaction(TRANSACTION);
    console.log(t);
})();