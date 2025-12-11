import React, { useState } from 'react';
import { DollarSign, Percent, Calendar } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';

const EmiCalculator = () => {
    const [loanAmount, setLoanAmount] = useState(100000);
    const [interestRate, setInterestRate] = useState(10);
    const [loansTenure, setLoansTenure] = useState(12); // months

    const calculateEMI = () => {
        const principal = parseFloat(loanAmount);
        const calculatedInterest = parseFloat(interestRate) / 100 / 12;
        const calculatedPayments = parseFloat(loansTenure);

        // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
        const x = Math.pow(1 + calculatedInterest, calculatedPayments);
        const monthly = (principal * x * calculatedInterest) / (x - 1);

        if (isFinite(monthly)) {
            const totalPayment = monthly * calculatedPayments;
            const totalInterest = totalPayment - principal;
            return {
                monthly: monthly.toFixed(2),
                total: totalPayment.toFixed(2),
                interest: totalInterest.toFixed(2)
            };
        }
        return { monthly: 0, total: 0, interest: 0 };
    };

    const result = calculateEMI();

    return (
        <ToolWrapper
            title="EMI Calculator"
            description="Estimate your monthly loan payments (EMI) accurately."
            keywords="emi calculator, loan calculator, mortgage calculator, car loan, home loan"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Inputs */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Loan Amount</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="number"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(e.target.value)}
                                className="w-full bg-[#0b1120] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-cyan-500 focus:outline-none"
                            />
                        </div>
                        <input
                            type="range"
                            min="1000" max="10000000" step="1000"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Interest Rate (%)</label>
                        <div className="relative">
                            <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="number"
                                value={interestRate}
                                onChange={(e) => setInterestRate(e.target.value)}
                                className="w-full bg-[#0b1120] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-cyan-500 focus:outline-none"
                            />
                        </div>
                        <input
                            type="range"
                            min="1" max="30" step="0.1"
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Tenure (Months)</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="number"
                                value={loansTenure}
                                onChange={(e) => setLoansTenure(e.target.value)}
                                className="w-full bg-[#0b1120] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-cyan-500 focus:outline-none"
                            />
                        </div>
                        <input
                            type="range"
                            min="6" max="360" step="1"
                            value={loansTenure}
                            onChange={(e) => setLoansTenure(e.target.value)}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-8 flex flex-col justify-center space-y-6">
                    <div className="text-center pb-6 border-b border-white/10">
                        <span className="text-gray-400 text-sm uppercase tracking-wider">Monthly Payment (EMI)</span>
                        <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mt-2">
                            {Number(result.monthly).toLocaleString()}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                            <div className="text-gray-400 text-xs uppercase mb-1">Total Interest</div>
                            <div className="text-xl font-bold text-white">{Number(result.interest).toLocaleString()}</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                            <div className="text-gray-400 text-xs uppercase mb-1">Total Payment</div>
                            <div className="text-xl font-bold text-white">{Number(result.total).toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Simple Chart Bar Visualization */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Principal ({Math.round(loanAmount / result.total * 100)}%)</span>
                            <span>Interest ({Math.round(result.interest / result.total * 100)}%)</span>
                        </div>
                        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
                            <div style={{ width: `${loanAmount / result.total * 100}%` }} className="h-full bg-cyan-500" />
                            <div style={{ width: `${result.interest / result.total * 100}%` }} className="h-full bg-purple-500" />
                        </div>
                    </div>
                </div>
            </div>
        </ToolWrapper>
    );
};

export default EmiCalculator;
