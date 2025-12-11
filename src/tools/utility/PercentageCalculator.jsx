import React, { useState } from 'react';
import { Percent, ArrowRight } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';

const PercentageCalculator = () => {
    const [values, setValues] = useState({
        metric1_a: '', metric1_b: '',
        metric2_a: '', metric2_b: '',
        metric3_a: '', metric3_b: ''
    });

    const [results, setResults] = useState({
        metric1: null,
        metric2: null,
        metric3: null
    });

    const handleChange = (field, e) => {
        const val = e.target.value;
        const newValues = { ...values, [field]: val };
        setValues(newValues);
        calculate(field.split('_')[0], newValues);
    };

    const calculate = (metric, vals) => {
        let res = null;
        const a = parseFloat(vals[`${metric}_a`]);
        const b = parseFloat(vals[`${metric}_b`]);

        if (!isNaN(a) && !isNaN(b)) {
            if (metric === 'metric1') res = (a / 100) * b; // What is X% of Y?
            if (metric === 'metric2') res = (a / b) * 100; // X is what % of Y?
            if (metric === 'metric3') res = ((b - a) / a) * 100; // % Change from X to Y
        }
        setResults(prev => ({ ...prev, [metric]: res }));
    };

    return (
        <ToolWrapper
            title="Percentage Calculator"
            description="Easily calculate percentages, percentage difference, and percentage increase/decrease."
            keywords="percentage calculator, percent change, what percentage, math tools"
        >
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Metric 1: What is X% of Y? */}
                <div className="bg-[#0b1120]/50 p-6 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-colors">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-lg">
                        <span className="text-gray-300">What is</span>
                        <div className="relative w-24">
                            <input
                                type="number"
                                value={values.metric1_a}
                                onChange={(e) => handleChange('metric1_a', e)}
                                className="w-full bg-[#1e293b] border border-white/20 rounded-lg py-2 px-3 text-white text-center focus:border-cyan-500 focus:outline-none"
                                placeholder="X"
                            />
                            <Percent className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                        </div>
                        <span className="text-gray-300">of</span>
                        <input
                            type="number"
                            value={values.metric1_b}
                            onChange={(e) => handleChange('metric1_b', e)}
                            className="w-24 bg-[#1e293b] border border-white/20 rounded-lg py-2 px-3 text-white text-center focus:border-cyan-500 focus:outline-none"
                            placeholder="Y"
                        />
                        <span className="text-gray-300">?</span>

                        <div className="flex-1 text-right mt-4 md:mt-0">
                            {results.metric1 !== null && (
                                <span className="text-2xl font-bold text-cyan-400 animate-fade-in">
                                    {results.metric1.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Metric 2: X is what % of Y? */}
                <div className="bg-[#0b1120]/50 p-6 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-colors">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-lg">
                        <input
                            type="number"
                            value={values.metric2_a}
                            onChange={(e) => handleChange('metric2_a', e)}
                            className="w-24 bg-[#1e293b] border border-white/20 rounded-lg py-2 px-3 text-white text-center focus:border-cyan-500 focus:outline-none"
                            placeholder="X"
                        />
                        <span className="text-gray-300">is what % of</span>
                        <input
                            type="number"
                            value={values.metric2_b}
                            onChange={(e) => handleChange('metric2_b', e)}
                            className="w-24 bg-[#1e293b] border border-white/20 rounded-lg py-2 px-3 text-white text-center focus:border-cyan-500 focus:outline-none"
                            placeholder="Y"
                        />
                        <span className="text-gray-300">?</span>

                        <div className="flex-1 text-right mt-4 md:mt-0">
                            {results.metric2 !== null && (
                                <span className="text-2xl font-bold text-cyan-400 animate-fade-in">
                                    {results.metric2.toFixed(2)}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Metric 3: Percentage Change */}
                <div className="bg-[#0b1120]/50 p-6 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-colors">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-lg">
                        <span className="text-gray-300">Change from</span>
                        <input
                            type="number"
                            value={values.metric3_a}
                            onChange={(e) => handleChange('metric3_a', e)}
                            className="w-24 bg-[#1e293b] border border-white/20 rounded-lg py-2 px-3 text-white text-center focus:border-cyan-500 focus:outline-none"
                            placeholder="Start"
                        />
                        <span className="text-gray-300">to</span>
                        <input
                            type="number"
                            value={values.metric3_b}
                            onChange={(e) => handleChange('metric3_b', e)}
                            className="w-24 bg-[#1e293b] border border-white/20 rounded-lg py-2 px-3 text-white text-center focus:border-cyan-500 focus:outline-none"
                            placeholder="End"
                        />
                        <span className="text-gray-300">?</span>

                        <div className="flex-1 text-right mt-4 md:mt-0">
                            {results.metric3 !== null && (
                                <div className="flex items-center justify-end gap-2 animate-fade-in">
                                    <span className={`text-2xl font-bold ${results.metric3 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {results.metric3 > 0 ? '+' : ''}{results.metric3.toFixed(2)}%
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ToolWrapper>
    );
};

export default PercentageCalculator;
