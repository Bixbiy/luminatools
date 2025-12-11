import React, { useState } from 'react';
import { Calendar, Cake, Heart, Sparkles } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';
import NeonButton from '../../components/advanced/NeonButton';

const AgeCalculator = () => {
    const [birthDate, setBirthDate] = useState('');
    const [result, setResult] = useState(null);

    const calculateAge = () => {
        if (!birthDate) return;

        const birth = new Date(birthDate);
        const today = new Date();

        // Calculate differences
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        const totalDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = years * 12 + months;
        const hours = totalDays * 24;
        const minutes = hours * 60;

        // Next birthday
        const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
        if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }
        const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

        setResult({
            years,
            months,
            days,
            totalDays,
            totalWeeks,
            totalMonths,
            hours,
            minutes,
            daysUntilBirthday,
            nextBirthday: nextBirthday.toDateString()
        });
    };

    const stats = result ? [
        { label: 'Years', value: result.years, icon: Calendar, color: 'cyan' },
        { label: 'Months', value: result.months, icon: Calendar, color: 'blue' },
        { label: 'Days', value: result.days, icon: Calendar, color: 'purple' },
        { label: 'Total Days', value: result.totalDays.toLocaleString(), icon: Sparkles, color: 'pink' },
        { label: 'Total Weeks', value: result.totalWeeks.toLocaleString(), icon: Heart, color: 'green' },
        { label: 'Total Hours', value: result.hours.toLocaleString(), icon: Sparkles, color: 'yellow' },
    ] : [];

    return (
        <ToolWrapper
            title="Age Calculator"
            description="Calculate your exact age with detailed statistics and milestones"
            keywords="age calculator, calculate age, age in days, birthday calculator"
        >
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Input */}
                <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-8 space-y-6 animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <Cake className="w-8 h-8 text-cyan-400" />
                        <h2 className="text-2xl font-bold text-white">Enter Your Birth Date</h2>
                    </div>

                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-6 py-4 text-white text-lg focus:border-cyan-500 focus:outline-none transition-all"
                    />

                    <NeonButton
                        onClick={calculateAge}
                        disabled={!birthDate}
                        icon={Sparkles}
                        className="w-full"
                    >
                        Calculate My Age
                    </NeonButton>
                </div>

                {/* Results */}
                {result && (
                    <>
                        {/* Main Age Display */}
                        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl border border-cyan-500/30 p-8 text-center animate-bounce-in">
                            <div className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 animate-pulse-glow">
                                {result.years}
                            </div>
                            <div className="text-2xl text-white font-semibold">Years Old</div>
                            <div className="text-gray-400 mt-2">
                                {result.months >= 1 && `${result.months} ${result.months === 1 ? 'month' : 'months'}`}
                                {result.months >= 1 && result.days >= 1 && ' and '}
                                {result.days >= 1 && `${result.days} ${result.days === 1 ? 'day' : 'days'}`}
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {stats.map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className={`bg-[#0b1120] rounded-xl border border-white/10 p-6 hover:border-${stat.color}-500/30 transition-all animate-fade-in`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`p-2 bg-${stat.color}-500/10 rounded-lg`}>
                                            <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                                        </div>
                                        <div className={`text-xs text-gray-500 uppercase`}>{stat.label}</div>
                                    </div>
                                    <div className={`text-3xl font-bold text-${stat.color}-400`}>
                                        {stat.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Next Birthday */}
                        <div className="bg-gradient-to-r from-pink-500/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-6 animate-slide-in-left">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-pink-500/20 rounded-xl">
                                        <Cake className="w-8 h-8 text-pink-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Your Next Birthday</div>
                                        <div className="text-xl font-bold text-white">{result.nextBirthday}</div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-pink-400 animate-pulse-glow">
                                        {result.daysUntilBirthday}
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase">Days to go</div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </ToolWrapper>
    );
};

export default AgeCalculator;
