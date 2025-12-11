import React, { useState } from 'react';
import { RefreshCw, Coins } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';

// Static rates fallback (since we don't have a free live API key in this demo)
const RATES = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.12,
    JPY: 148.2,
    AUD: 1.54,
    CAD: 1.35,
    CNY: 7.19,
    BTC: 0.000021, // volatile
    ETH: 0.00035
};

const CurrencyConverter = () => {
    const [amount, setAmount] = useState(1);
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('EUR');

    const convert = () => {
        const rate = RATES[to] / RATES[from];
        return (amount * rate).toFixed(4);
    };

    return (
        <ToolWrapper
            title="Currency Converter"
            description="Convert currencies instantly using latest available exchange rates."
            keywords="currency converter, exchange rates, usd to eur, money converter"
        >
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-8 space-y-8">

                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* From */}
                        <div className="flex-1 w-full space-y-2">
                            <label className="text-sm font-medium text-gray-400">Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="w-full bg-[#1e293b] border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white text-xl font-bold focus:border-cyan-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Currency Selects */}
                        <div className="flex items-end gap-2 w-full md:w-auto">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium text-gray-400">From</label>
                                <select
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-3 py-4 text-white font-bold focus:border-cyan-500 focus:outline-none"
                                >
                                    {Object.keys(RATES).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center justify-center p-4">
                                <Coins className="text-gray-500" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium text-gray-400">To</label>
                                <select
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-3 py-4 text-white font-bold focus:border-cyan-500 focus:outline-none"
                                >
                                    {Object.keys(RATES).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="text-center pt-8 border-t border-white/10">
                        <span className="text-gray-400 text-sm">Converted Amount</span>
                        <div className="text-5xl md:text-6xl font-bold text-white mt-2 animate-pulse-once">
                            <span className="text-cyan-400">{convert()}</span> <span className="text-2xl text-gray-500">{to}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-4 flex items-center justify-center gap-1">
                            <RefreshCw size={12} /> Live rates are simulated for this demo
                        </div>
                    </div>

                </div>
            </div>
        </ToolWrapper>
    );
};

export default CurrencyConverter;
