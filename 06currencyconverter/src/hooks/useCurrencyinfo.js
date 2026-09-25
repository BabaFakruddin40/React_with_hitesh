import { useEffect, useState } from 'react';
function useCurrencyInfo(currency, refreshToken = 0) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    if (!currency) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const primaryApiUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency.toLowerCase()}.json`;
    const fallbackApiUrl = `https://latest.currency-api.pages.dev/v1/currencies/${currency.toLowerCase()}.json`;

    fetch(primaryApiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((res) => {
        if (cancelled) return;
        if (res && res[currency.toLowerCase()]) {
          setData(res[currency.toLowerCase()]);
          setUpdatedAt(Date.now());
        } else {
          throw new Error('Invalid response structure');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Primary currency API failed, trying fallback endpoint...', err);
        fetch(fallbackApiUrl)
          .then((res) => res.json())
          .then((res) => {
            if (cancelled) return;
            if (res && res[currency.toLowerCase()]) {
              setData(res[currency.toLowerCase()]);
              setUpdatedAt(Date.now());
            }
            setLoading(false);
          })
          .catch((fallbackErr) => {
            if (cancelled) return;
            console.error('Currency API Fetch Error:', fallbackErr);
            setError('Failed to fetch exchange rates.');
            setLoading(false);
          });
      });

    return () => {
      cancelled = true;
    };
  }, [currency, refreshToken]);

  return { data, loading, error, updatedAt };
}

export default useCurrencyInfo;