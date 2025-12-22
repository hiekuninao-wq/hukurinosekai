
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SimulationResult } from '../types';
import { formatCurrency } from '../services/calculator';

interface ResultScreenProps {
  result: SimulationResult;
  onBack: () => void;
  onModify: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onBack, onModify }) => {
  const chartData = result.yearlyData.map(d => ({
    name: `${d.year}年`,
    principal: d.totalPrincipal,
    profit: d.totalProfit,
    total: d.totalAmount
  }));

  const handleShare = async () => {
    try {
      const url = window.location.origin;
      await navigator.clipboard.writeText(url);
      alert('アプリのURLをコピーしました！\nSNSなどでシェアして使ってください。');
    } catch (err) {
      console.error('Failed to copy URL: ', err);
    }
  };

  const formatYAxis = (value: number) => {
    if (value >= 100000000) return `${(value / 100000000).toFixed(1)}億円`;
    if (value >= 10000000) return `${(value / 10000000).toFixed(0)}千万`;
    if (value >= 10000) return `${(value / 10000).toFixed(0)}万`;
    return value.toString();
  };

  const getDisplayYears = () => {
    const total = result.params.durationYears;
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    
    const step = (total - 1) / 4;
    const years = [
      1,
      Math.round(1 + step),
      Math.round(1 + step * 2),
      Math.round(1 + step * 3),
      total
    ];
    return Array.from(new Set(years)).sort((a, b) => a - b);
  };

  const displayYears = getDisplayYears();

  return (
    <div className="bg-background-light text-text-main min-h-screen flex flex-col mx-auto max-w-md shadow-2xl relative">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors text-text-main"
          >
            <span className="material-symbols-outlined text-2xl font-bold">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight text-text-main font-display">シミュレーション結果</h1>
          <button 
            onClick={handleShare}
            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors text-text-main"
          >
            <span className="material-symbols-outlined text-2xl font-bold">share</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden pb-12 animate-fade-in bg-background-light">
        {/* Main Hero Card */}
        <div className="px-6 pt-10 pb-10 text-center bg-white border-b border-gray-100 shadow-sm">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-200 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-text-muted text-xs font-black tracking-widest uppercase">{result.params.durationYears}年後の合計金額</span>
          </div>
          
          <h2 className="text-[42px] font-black tracking-tighter text-text-main mb-10 font-display leading-none">
            {formatCurrency(result.finalAmount)}
          </h2>

          {/* Info Grid */}
          <div className="flex items-start justify-between gap-2 max-w-sm mx-auto mb-10">
            <div className="flex-1 flex flex-col items-center justify-center py-2">
              <div className="flex items-center gap-1 mb-2">
                <span className="material-symbols-outlined text-sm font-bold text-primary">payments</span>
                <span className="text-[11px] font-black text-primary uppercase tracking-widest">毎月の金額</span>
              </div>
              <span className="text-base font-black text-text-main font-display leading-none">{formatCurrency(result.params.monthlyAmount)}</span>
            </div>

            <div className="flex-[1.2] flex flex-col items-center justify-center gap-1.5 text-emerald-800 bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-200/50 shadow-sm">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base font-bold">trending_up</span>
                <span className="font-black text-lg leading-none">+{result.profitPercent}%</span>
              </div>
              <span className="text-[10px] text-emerald-700/80 font-black uppercase tracking-widest whitespace-nowrap text-balance">元本比の収益率</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-2">
              <div className="flex items-center gap-1 mb-2">
                <span className="material-symbols-outlined text-sm font-bold text-primary">savings</span>
                <span className="text-[11px] font-black text-primary uppercase tracking-widest">初期資産</span>
              </div>
              <span className="text-base font-black text-text-main font-display leading-none">{formatCurrency(result.params.initialAmount)}</span>
            </div>
          </div>

          {/* Detail Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-stone-50 p-5 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="material-symbols-outlined text-lg text-text-muted">account_balance_wallet</span>
                <span className="text-xs font-black text-text-muted uppercase tracking-widest">累計積立元本</span>
              </div>
              <p className="text-lg font-black tracking-tight text-text-main font-display leading-none">
                {formatCurrency(result.totalPrincipal)}
              </p>
            </div>

            <div className="bg-primary/5 p-5 rounded-[2rem] border border-primary/10 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 mb-3 text-primary">
                <span className="material-symbols-outlined text-lg">monetization_on</span>
                <span className="text-xs font-black uppercase tracking-widest">運用収益合計</span>
              </div>
              <p className="text-lg font-black tracking-tight text-primary font-display leading-none">
                +{formatCurrency(result.totalProfit)}
              </p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="px-6 mt-10 mb-8">
          <div className="bg-white rounded-[2.5rem] pt-7 pb-2 px-0 shadow-soft border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between mb-8 px-7">
              <h3 className="font-black text-text-main flex items-center gap-2 text-sm uppercase tracking-widest">
                <span className="material-symbols-outlined text-text-muted text-xl">analytics</span>
                <span>資産推移グラフ</span>
              </h3>
              <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-300"></span>
                  <span className="text-text-muted">元金</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  <span className="text-primary">収益</span>
                </div>
              </div>
            </div>
            
            <div className="w-full h-[260px] relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0369a1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0369a1" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7A736B" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#7A736B" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#7A736B', fontWeight: 900 }}
                    interval={Math.floor(chartData.length / 4)}
                  />
                  <YAxis 
                    tickFormatter={formatYAxis} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#7A736B', fontWeight: 900 }}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', fontSize: '14px', fontWeight: '900' }}
                  />
                  <Area name="元金" type="monotone" dataKey="principal" stackId="1" stroke="#7A736B" fill="url(#colorPrincipal)" strokeWidth={2} isAnimationActive={false} />
                  <Area name="収益" type="monotone" dataKey="profit" stackId="1" stroke="#0369a1" fill="url(#colorProfit)" strokeWidth={3} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Details Table */}
        <div className="px-6 mb-8">
          <h3 className="font-black text-text-main mb-4 text-sm uppercase tracking-widest flex items-center gap-2 px-1">
            <span className="w-2.5 h-2.5 bg-primary rounded-full shadow-glow"></span>
            年次シミュレーション詳細
          </h3>
          
          <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-soft">
            <div className="grid grid-cols-12 gap-1 px-5 py-2.5 bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-text-muted uppercase tracking-[0.1em]">
              <div className="col-span-2">年数</div>
              <div className="col-span-6 text-right">資産合計</div>
              <div className="col-span-4 text-right">運用収益</div>
            </div>

            <div className="divide-y divide-gray-50">
              {displayYears.map((y) => {
                const data = result.yearlyData.find(d => d.year === y);
                if (!data) return null;
                const isLast = y === result.params.durationYears;
                
                return (
                  <div 
                    key={y} 
                    className={`grid grid-cols-12 gap-1 px-5 py-2 items-center transition-colors hover:bg-gray-50/30 ${isLast ? 'bg-primary/5' : ''}`}
                  >
                    <div className="col-span-2">
                      <span className={`text-[12px] font-black px-1.5 py-0.5 rounded-md border-2 transition-all inline-block min-w-[44px] text-center ${
                        isLast ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-text-muted border-gray-100'
                      }`}>
                        {y}年
                      </span>
                    </div>
                    <div className="col-span-6 text-right">
                      <span className="text-[21px] font-black font-display text-text-main tracking-tighter leading-none">
                        {formatCurrency(data.totalAmount)}
                      </span>
                    </div>
                    <div className="col-span-4 text-right">
                      <span className={`text-[15px] font-black font-display tracking-tight leading-none ${isLast ? 'text-primary' : 'text-emerald-600'}`}>
                        +{formatCurrency(data.totalProfit)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Buttons at end of content */}
        <div className="flex gap-4 px-6 mb-12">
           <button 
              onClick={onModify}
              className="flex-1 py-5 px-4 rounded-2xl border-2 border-gray-100 font-black text-text-muted bg-white hover:bg-gray-50 active:scale-[0.98] transition-all text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              条件を修正
            </button>
            <a 
              href="https://pmam.co.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-5 px-4 rounded-2xl bg-btn-primary hover:bg-btn-primary-hover text-button-text font-black shadow-xl shadow-btn-primary/30 active:scale-[0.98] transition-all text-[10px] sm:text-xs flex flex-col items-center justify-center leading-tight text-center"
            >
              パリミキアセット
              <span className="block">マネジメントへ</span>
            </a>
        </div>
      </main>
    </div>
  );
};

export default ResultScreen;
