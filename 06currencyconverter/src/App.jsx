// import { useState, useEffect } from 'react';

// export default function App() {
//   const [amount, setAmount] = useState(1);
//   const [from, setFrom] = useState('usd');
//   const [to, setTo] = useState('eur');
//   const [convertedAmount, setConvertedAmount] = useState(0);
//   const [currencies, setCurrencies] = useState([]);
//   const [rates, setRates] = useState({});

//   // Fetch exchange rates from free API
//   useEffect(() => {
//     fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`)
//       .then((res) => res.json())
//       .then((data) => {
//         setRates(data[from]);
//         setCurrencies(Object.keys(data[from]));
//       })
//       .catch((err) => console.error("Error fetching currency data:", err));
//   }, [from]);

//   const convert = () => {
//     if (rates[to]) {
//       setConvertedAmount((amount * rates[to]).toFixed(2));
//     }
//   };

//   const swap = () => {
//     setFrom(to);
//     setTo(from);
//     setAmount(convertedAmount);
//     setConvertedAmount(amount);
//   };

//   return (
//     <div
//       className="w-full h-screen flex justify-center items-center bg-cover bg-no-repeat"
//       style={{
//         backgroundImage: `url('https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
//       }}
//     >
//       <div className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-5 backdrop-blur-sm bg-white/30 shadow-2xl">
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             convert();
//           }}
//         >
//           {/* FROM INPUT BOX */}
//           <div className="bg-white p-3 rounded-lg mb-1 flex justify-between items-center">
//             <div className="w-1/2">
//               <label className="text-black/40 mb-2 inline-block text-sm">From</label>
//               <input
//                 className="outline-none w-full bg-transparent py-1.5 text-black font-semibold"
//                 type="number"
//                 placeholder="Amount"
//                 value={amount}
//                 onChange={(e) => setAmount(Number(e.target.value))}
//               />
//             </div>
//             <div className="w-1/2 flex flex-col items-end">
//               <label className="text-black/40 mb-2 inline-block text-sm">Currency Type</label>
//               <select
//                 className="rounded-lg px-2 py-1 bg-gray-100 cursor-pointer outline-none font-medium text-black uppercase"
//                 value={from}
//                 onChange={(e) => setFrom(e.target.value)}
//               >
//                 {currencies.map((curr) => (
//                   <option key={curr} value={curr}>
//                     {curr}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* SWAP BUTTON */}
//           <div className="relative w-full h-0.5 my-2">
//             <button
//               type="button"
//               className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-3 py-1 text-sm font-semibold hover:bg-blue-700 transition"
//               onClick={swap}
//             >
//               swap
//             </button>
//           </div>

//           {/* TO INPUT BOX */}
//           <div className="bg-white p-3 rounded-lg mt-1 mb-4 flex justify-between items-center">
//             <div className="w-1/2">
//               <label className="text-black/40 mb-2 inline-block text-sm">To</label>
//               <input
//                 className="outline-none w-full bg-transparent py-1.5 text-black font-semibold"
//                 type="number"
//                 placeholder="Amount"
//                 value={convertedAmount}
//                 disabled
//               />
//             </div>
//             <div className="w-1/2 flex flex-col items-end">
//               <label className="text-black/40 mb-2 inline-block text-sm">Currency Type</label>
//               <select
//                 className="rounded-lg px-2 py-1 bg-gray-100 cursor-pointer outline-none font-medium text-black uppercase"
//                 value={to}
//                 onChange={(e) => setTo(e.target.value)}
//               >
//                 {currencies.map((curr) => (
//                   <option key={curr} value={curr}>
//                     {curr}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* CONVERT BUTTON */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-700 transition uppercase tracking-wide"
//           >
//             Convert {from.toUpperCase()} to {to.toUpperCase()}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getCurrencyMetadata } from './utils/currencyMetadata';
import { InputBox } from './components/InputBox';
import useCurrencyInfo from './hooks/useCurrencyInfo';

const HISTORY_KEY = 'currency-converter-history';
const MAX_HISTORY = 5;

export default function App() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState('usd');
  const [to, setTo] = useState('eur');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [refreshToken, setRefreshToken] = useState(0);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
      return [];
    }
  });

  // Quick preset options
  const popularPairs = [
    { from: 'usd', to: 'eur' },
    { from: 'usd', to: 'gbp' },
    { from: 'usd', to: 'inr' },
    { from: 'eur', to: 'usd' },
    { from: 'gbp', to: 'usd' },
  ];

  // Fetch exchange rate data via custom hook
  const { data: currencyRates, loading, error, updatedAt } = useCurrencyInfo(from, refreshToken);

  const options = useMemo(() => {
    return Object.keys(currencyRates || {});
  }, [currencyRates]);

  // Rate calculation logic
  const currentRate = currencyRates ? currencyRates[to] : null;

  const calculateConversion = useCallback(() => {
    if (currentRate && !isNaN(amount) && amount > 0) {
      setConvertedAmount(Number((amount * currentRate).toFixed(4)));
    } else {
      setConvertedAmount(0);
    }
  }, [amount, currentRate]);

  // Real-time calculation on amount or target currency change
  useEffect(() => {
    calculateConversion();
  }, [calculateConversion]);

  // Save a completed conversion to local history
  const recordHistory = (entry) => {
    setHistory((prev) => {
      const next = [entry, ...prev.filter((h) => !(h.from === entry.from && h.to === entry.to))].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleConvertSubmit = () => {
    calculateConversion();
    if (currentRate && amount > 0) {
      recordHistory({ from, to, amount, rate: currentRate, at: Date.now() });
    }
  };

  // Swap handler
  const swap = () => {
    const prevFrom = from;
    const prevTo = to;
    const prevConverted = convertedAmount;

    setFrom(prevTo);
    setTo(prevFrom);
    setAmount(prevConverted || 0);
  };

  // Quick Preset Click
  const handlePresetSelect = (pair) => {
    setFrom(pair.from);
    setTo(pair.to);
  };

  // Reapply a past conversion from history
  const handleHistorySelect = (entry) => {
    setFrom(entry.from);
    setTo(entry.to);
    setAmount(entry.amount);
  };

  const handleRetry = () => setRefreshToken((n) => n + 1);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(convertedAmount));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const secondsAgo = updatedAt ? Math.max(0, Math.round((Date.now() - updatedAt) / 1000)) : null;

  const fromMeta = getCurrencyMetadata(from);
  const toMeta = getCurrencyMetadata(to);

  return (
    <div
      className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 md:p-8 bg-cover bg-center bg-no-repeat relative overflow-x-hidden font-sans"
      style={{
        backgroundImage: `radial-gradient(ellipse at center, rgba(15, 23, 42, 0.75), rgba(2, 6, 23, 0.95)), url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 12v2" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
              Global Exchange
            </h1>
            <p className="text-xs text-slate-400">Real-time dynamic currency conversion</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Live API Data</span>
        </div>
      </header>

      {/* Main Converter Card */}
      {}
      <main className="w-full max-w-xl z-10 my-auto">
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
          
          {/* Card Title & Preset Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>Convert Currencies</span>
            </h2>

            {/* Popular Pair Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[11px] text-slate-400 shrink-0">Pairs:</span>
              {popularPairs.map((pair) => (
                <button
                  key={`${pair.from}-${pair.to}`}
                  type="button"
                  onClick={() => handlePresetSelect(pair)}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium uppercase transition ${
                    from === pair.from && to === pair.to
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {pair.from}/{pair.to}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConvertSubmit();
            }}
          >
            {/* FROM INPUT BOX */}
            <div className="mb-1">
              <InputBox
                label="You Send"
                amount={amount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setFrom(currency)}
                selectCurrency={from}
                onAmountChange={(val) => setAmount(val)}
              />
            </div>

            {/* SWAP BUTTON */}
            <div className="relative h-6 my-1 flex justify-center items-center z-20">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <button
                type="button"
                onClick={swap}
                disabled={loading}
                title="Swap Currencies"
                className="relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-2.5 rounded-full border-2 border-slate-900 shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 group focus:outline-none disabled:opacity-50 disabled:hover:scale-100"
              >
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* TO INPUT BOX */}
            <div className="mb-5">
              <InputBox
                label="You Get"
                amount={convertedAmount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setTo(currency)}
                selectCurrency={to}
                amountDisable
              />
            </div>

            {/* LIVE EXCHANGE RATE INFO */}
            <div className="bg-slate-950/60 rounded-xl p-3 mb-5 border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="text-slate-400">Indicative Exchange Rate</span>
                {secondsAgo !== null && !loading && (
                  <span className="text-[10px] text-slate-500">Updated {secondsAgo}s ago</span>
                )}
              </div>
              <div className="text-slate-200 font-mono font-medium">
                {loading ? (
                  <span className="animate-pulse text-slate-500">Fetching live rates...</span>
                ) : currentRate ? (
                  <span>
                    1 <span className="uppercase text-slate-400">{from}</span> = {currentRate} <span className="uppercase text-slate-400">{to}</span>
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-2">
                    Rate unavailable
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="text-[10px] px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/40 hover:bg-amber-400/20 transition"
                    >
                      Retry
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* CONVERT ACTION BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 transform active:scale-[0.99] uppercase tracking-wider text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>Convert {from.toUpperCase()} to {to.toUpperCase()}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>

          {/* Quick Stats Summary */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span>Status:</span>
              {error ? (
                <span className="text-rose-400 font-medium flex items-center gap-2">
                  API Network Error
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="text-[10px] px-2 py-0.5 rounded bg-rose-400/10 border border-rose-400/40 hover:bg-rose-400/20 transition"
                  >
                    Retry
                  </button>
                </span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Rates Up-to-Date
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span>
                Total: <span className="text-white font-semibold">{toMeta.symbol}{convertedAmount.toLocaleString()}</span>
              </span>
              <button
                type="button"
                onClick={handleCopy}
                title="Copy converted amount"
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 transition text-slate-300"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Recent Conversions History */}
          {history.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-500 mb-2">Recent Conversions</div>
              <div className="flex flex-wrap gap-1.5">
                {history.map((entry) => (
                  <button
                    key={`${entry.from}-${entry.to}-${entry.at}`}
                    type="button"
                    onClick={() => handleHistorySelect(entry)}
                    className="text-[11px] px-2 py-1 rounded-md bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition uppercase"
                  >
                    {entry.amount} {entry.from} → {entry.to}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      {}
      <footer className="w-full max-w-4xl text-center text-xs text-slate-500 mt-6 z-10">
        <p>© 2026 Currency Exchange • Data provided by Open Exchange APIs</p>
      </footer>
    </div>
  );
}