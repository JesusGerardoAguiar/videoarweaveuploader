import { useState, useContext, useEffect } from "react";
import {
  balanceStyle,
  bottomFormStyle,
  inputStyle,
  buttonStyle,
  labelStyle,
  container
} from "./style";
import BigNumber from 'bignumber.js'
import { MainContext } from "../../context";

const Funds = () => {
  const { balance, bundlrInstance, fetchBalance } = useContext(MainContext);

  const [amount, setAmount] = useState()

  function parseInput (input) {
    const conv = new BigNumber(input).multipliedBy(bundlrInstance.currencyConfig.base[1])
    if (conv.isLessThan(1)) {
      console.log('error: value too small')
      return
    } else {
      return conv
    }
  }

  async function fundWallet() {
    if (!amount) return
    const amountParsed = parseInput(amount)
    try {
      await bundlrInstance.fund(amountParsed)
      fetchBalance()
    } catch (err) {
      console.log('Error funding wallet: ', err)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [balance])
  return (
    <div className={container}>
      <h3 className={balanceStyle}>
        💰 Balance {Math.round(balance * 100) / 100} MATIC
      </h3>
      <p>In order to upload your class, you must fund your local wallet, this is for Bundlr to upload your content to arweave</p>
      <div className={bottomFormStyle}>
        <p className={labelStyle}>Fund Wallet</p>
        <input
          placeholder="amount"
          className={inputStyle}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className={buttonStyle} onClick={fundWallet}>
          Send transaction
        </button>
      </div>
    </div>
  );
};

export default Funds;
