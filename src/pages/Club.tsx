import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const TIERS = [
  { name: 'Glam', range: '0-499', bg: 'bg-primary/10', text: 'text-primary' },
  { name: 'Luxe', range: '500-1499', bg: 'bg-amber-50', text: 'text-amber-600' },
  { name: 'Icon', range: '1500+', bg: 'bg-zinc-900', text: 'text-white' },
];

const REWARDS = [
  { pts: 500, title: 'R10 Discount', desc: 'On your next order' },
  { pts: 1500, title: 'Free Lip Balm', desc: 'Any flavor' },
  { pts: 3000, title: 'Free Lashes', desc: '3D Mink Lashes' },
  { pts: 5000, title: 'VIP Hair Gift', desc: 'Premium hairpiece' },
];

export default function Club() {
  const navigate = useNavigate();
  const currentPoints = 2450;

  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-zinc-50/80 backdrop-blur-xl px-5 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-all">
          <span className="material-symbols-outlined text-zinc-900">arrow_back</span>
        </button>
        <h1 className="font-black text-xl text-zinc-900 tracking-tight">Plug Rewards</h1>
      </header>

      <div className="px-5 space-y-6">
        {/* Hero Card */}
        <div className="bg-zinc-900 rounded-[44px] p-8 relative overflow-hidden shadow-xl">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-primary/30 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] block mb-2">NUL Member Balance</span>
            <div className="text-6xl font-black text-primary mb-6 tracking-tighter">
              {currentPoints}
            </div>
            
            <div className="w-full bg-zinc-800 rounded-full h-2 mb-3 overflow-hidden">
              <div className="bg-primary h-full rounded-full w-[80%]"></div>
            </div>
            <p className="text-xs text-zinc-400 font-medium">
              <strong className="text-white">550 pts</strong> away from Icon tier
            </p>
          </div>
        </div>

        {/* Tiers */}
        <div>
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3">Membership Tiers</h3>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {TIERS.map(tier => (
              <div key={tier.name} className={clsx("min-w-[120px] rounded-[28px] p-5 border border-zinc-100 shadow-sm", tier.bg)}>
                <h4 className={clsx("font-black text-lg mb-1", tier.text)}>{tier.name}</h4>
                <span className={clsx("text-xs font-bold opacity-70", tier.text)}>{tier.range} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards List */}
        <div>
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3">Milestone Rewards</h3>
          <div className="space-y-3">
            {REWARDS.map(reward => {
              const isUnlocked = currentPoints >= reward.pts;
              return (
                <div key={reward.pts} className={clsx(
                  "bg-white rounded-[32px] p-5 flex items-center justify-between border border-zinc-100 transition-all",
                  !isUnlocked && "opacity-60 grayscale"
                )}>
                  <div className="flex items-center gap-4">
                    <div className={clsx(
                      "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs",
                      isUnlocked ? "bg-primary/10 text-primary" : "bg-zinc-100 text-zinc-400"
                    )}>
                      {reward.pts}
                    </div>
                    <div>
                      <h4 className="font-black text-zinc-900 text-sm mb-0.5">{reward.title}</h4>
                      <p className="text-xs text-zinc-500">{reward.desc}</p>
                    </div>
                  </div>
                  {isUnlocked ? (
                    <button className="bg-zinc-900 hover:bg-primary text-white text-xs font-black px-4 py-2 rounded-xl active:scale-95 transition-all uppercase tracking-wider">
                      Redeem
                    </button>
                  ) : (
                    <span className="material-symbols-outlined text-zinc-300">lock</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Perks Info */}
        <div className="bg-primary/5 border border-primary/10 rounded-[32px] p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-primary">verified</span>
            <h4 className="font-black text-zinc-900">How to earn points</h4>
          </div>
          <ul className="space-y-2 text-sm text-zinc-600 font-medium">
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> 10 pts for every M1 spent</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> 500 pts for referring a friend</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> 1000 pts on your birthday</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
