import React, { useState } from 'react';
import { ArrowLeftRight, Check, Copy } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';

const UnitConverter = () => {
    const [category, setCategory] = useState('length');
    const [value, setValue] = useState('');
    const [fromUnit, setFromUnit] = useState('m');
    const [toUnit, setToUnit] = useState('ft');
    const [result, setResult] = useState('');

    const categories = {
        length: {
            units: { m: 'Meter', km: 'Kilometer', cm: 'Centimeter', mm: 'Millimeter', ft: 'Foot', in: 'Inch', mi: 'Mile', yd: 'Yard' },
            rates: { m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, mi: 1609.34, yd: 0.9144 }
        },
        weight: {
            units: { kg: 'Kilogram', g: 'Gram', mg: 'Milligram', lb: 'Pound', oz: 'Ounce' },
            rates: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 }
        },
        temperature: {
            units: { C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin' }
        }
    };

    const convert = (val, from, to, cat) => {
        if (val === '') {
            setResult('');
            return;
        }
        const num = parseFloat(val);
        if (isNaN(num)) return;

        let res;
        if (cat === 'temperature') {
            // Temp conversion logic
            if (from === to) res = num;
            else if (from === 'C') res = to === 'F' ? (num * 9 / 5) + 32 : num + 273.15;
            else if (from === 'F') res = to === 'C' ? (num - 32) * 5 / 9 : (num - 32) * 5 / 9 + 273.15;
            else if (from === 'K') res = to === 'C' ? num - 273.15 : (num - 273.15) * 9 / 5 + 32;
        } else {
            // Standard linear conversion
            const base = num * categories[cat].rates[from];
            res = base / categories[cat].rates[to];
        }
        setResult(res.toFixed(4).replace(/\.0000$/, '')); // Clean up trailing zeros
    };

    const handleChange = (val) => {
        setValue(val);
        convert(val, fromUnit, toUnit, category);
    };

    const handleCategoryChange = (cat) => {
        setCategory(cat);
        // Reset units to first two
        const units = Object.keys(categories[cat].units);
        setFromUnit(units[0]);
        setToUnit(units[1] || units[0]);
        setValue('');
        setResult('');
    };

    const swapUnits = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
        handleChange(value); // Re-trigger conversion with swapped units
    };

    return (
        <ToolWrapper
            title="Unit Converter"
            description="Convert between different units of measurement for length, weight, and temperature."
            keywords="unit converter, length converter, weight converter, temperature converter"
        >
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Category Tabs */}
                <div className="flex justify-center space-x-2 bg-[#0b1120] p-1.5 rounded-xl border border-white/10 w-fit mx-auto">
                    {Object.keys(categories).map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${category === cat ? 'bg-cyan-500/20 text-cyan-400 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-6 md:p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">

                        {/* From Section */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-400">From</label>
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => handleChange(e.target.value)}
                                placeholder="Enter value"
                                className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 text-2xl text-white font-bold tracking-wide focus:border-cyan-500 focus:outline-none"
                            />
                            <select
                                value={fromUnit}
                                onChange={(e) => { setFromUnit(e.target.value); convert(value, e.target.value, toUnit, category); }}
                                className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 focus:border-cyan-500 focus:outline-none appearance-none"
                            >
                                {Object.entries(categories[category].units).map(([key, label]) => (
                                    <option key={key} value={key}>{label} ({key})</option>
                                ))}
                            </select>
                        </div>

                        {/* Swap Button */}
                        <div className="flex justify-center pt-6 md:pt-0">
                            <button
                                onClick={swapUnits}
                                className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
                            >
                                <ArrowLeftRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                            </button>
                        </div>

                        {/* To Section */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-400">To</label>
                            <div className="w-full bg-[#0f172a] border border-cyan-500/30 rounded-xl px-4 py-3 text-2xl text-cyan-400 font-bold tracking-wide flex items-center h-[58px]">
                                {result || '---'}
                            </div>
                            <select
                                value={toUnit}
                                onChange={(e) => { setToUnit(e.target.value); convert(value, fromUnit, e.target.value, category); }}
                                className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 focus:border-cyan-500 focus:outline-none appearance-none"
                            >
                                {Object.entries(categories[category].units).map(([key, label]) => (
                                    <option key={key} value={key}>{label} ({key})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </ToolWrapper>
    );
};

export default UnitConverter;
