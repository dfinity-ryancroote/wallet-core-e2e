import { initWasm } from "../dist";


(async () => {
    const mnemonic =
        "shoot island position soft burden budget tooth cruel issue economy destroy above";
    const core = await initWasm();

    const wallet = core.HDWallet.createWithMnemonic(mnemonic, "");
    const privateKey = wallet.getKeyForCoin(core.CoinType.bitcoin);
    const address = wallet.getAddressForCoin(core.CoinType.internetComputer);

    console.info(address == "b9a13d974ee9db036d5abc5b66ace23e513cb5676f3996626c7717c339a3ee87");
})();