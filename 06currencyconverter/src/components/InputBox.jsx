import { useId, useState, useMemo } from 'react';
import { getCurrencyMetadata } from '../utils/currencyMetadata';

function InputBox({
  label,
  amount,
  onAmountChange,
  onCurrencyChange,
  currencyOptions = [],
  selectCurrency = 'usd',
  amountDisable = false,
  currencyDisable = false,
  className = '',
}) {
  const amountInputId = useId();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedMeta = getCurrencyMetadata(selectCurrency);

  // Filter currency list for search query
  const filteredCurrencies = useMemo(() => {
    if (!searchTerm) return currencyOptions;
    const term = searchTerm.toLowerCase();
    return currencyOptions.filter((curr) => {
      const meta = getCurrencyMetadata(curr);
      return (
        curr.toLowerCase().includes(term) ||
        meta.name.toLowerCase().includes(term)
      );
    });
  }, [currencyOptions, searchTerm]);

  return (
    <div className={`bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/60 shadow-lg text-sm transition-all focus-within:border-blue-500/80 hover:border-slate-600 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={amountInputId} className="text-slate-400 font-medium tracking-wide uppercase text-xs flex items-center gap-1.5">
          <span>{label}</span>
          {amountDisable && <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">Read-Only</span>}
        </label>
        <span className="text-xs text-slate-400 truncate max-w-[180px]">
          {selectedMeta.flag} {selectedMeta.name}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Amount Input Field */}
        <div className="relative flex-1">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-lg pl-1">
            {selectedMeta.symbol}
          </span>
          <input
            id={amountInputId}
            className="w-full bg-transparent pl-7 pr-2 py-1.5 text-xl font-bold text-white placeholder-slate-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
            type="number"
            placeholder="0.00"
            disabled={amountDisable}
            value={amount === '' || isNaN(amount) ? '' : amount}
            onChange={(e) => {
              const val = e.target.value;
              onAmountChange && onAmountChange(val === '' ? '' : Number(val));
            }}
            min="0"
            step="any"
          />
        </div>

        {/* Currency Select Custom Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            disabled={currencyDisable}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-white font-semibold py-2 px-3 rounded-lg border border-slate-700 transition cursor-pointer disabled:cursor-not-allowed text-sm uppercase shadow-inner"
          >
            <span className="text-base">{selectedMeta.flag}</span>
            <span>{selectCurrency}</span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Modal / Searchable Popover Menu */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-64 max-h-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
                {/* Search Bar */}
                <div className="p-2 border-b border-slate-700 bg-slate-850">
                  <input
                    type="text"
                    placeholder="Search currency..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none border border-slate-700 focus:border-blue-500"
                    autoFocus
                  />
                </div>

                {/* Options List */}
                <div className="overflow-y-auto max-h-56 p-1 scrollbar-thin scrollbar-thumb-slate-700">
                  {filteredCurrencies.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-400">No currency found</div>
                  ) : (
                    filteredCurrencies.map((currency) => {
                      const meta = getCurrencyMetadata(currency);
                      const isSelected = currency === selectCurrency;
                      return (
                        <button
                          key={currency}
                          type="button"
                          onClick={() => {
                            onCurrencyChange && onCurrencyChange(currency);
                            setIsDropdownOpen(false);
                            setSearchTerm('');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                            isSelected
                              ? 'bg-blue-600/30 text-blue-400 font-bold border border-blue-500/30'
                              : 'text-slate-200 hover:bg-slate-700/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span>{meta.flag}</span>
                            <span className="uppercase font-semibold">{currency}</span>
                            <span className="text-slate-400 text-[11px] truncate max-w-[110px]">
                              - {meta.name}
                            </span>
                          </div>
                          {isSelected && (
                            <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export { InputBox };