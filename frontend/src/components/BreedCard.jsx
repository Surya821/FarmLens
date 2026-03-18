import { breedData } from '../data/breedData';
import { translations } from '../data/translations';

function BreedCard({ breed, breedInfo: propBreedInfo, isDark, onClick, language }) {
  const t = translations[language];
  // Use the passed-in breedInfo (for DB breeds) or fall back to local breedData
  const breedInfo = propBreedInfo || breedData[breed];

  if (!breedInfo) return null;

  const getText = (field) => {
    if (!field) return '';
    return typeof field === 'object' ? field[language] || field.en : field;
  };

  const originText = getText(breedInfo.origin);
  const breedType = breedInfo.type || (language === 'en' ? 'Verified' : 'सत्यापित');

  return (
    <div
      className="group relative bg-[var(--card)] border border-[var(--border)] rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 hover:border-[var(--accent)] hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-600/10"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={breedInfo.image}
          alt={breed}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="px-3 py-1 backdrop-blur-md bg-black/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
            {originText}
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <div className="px-3 py-1 bg-[var(--accent)] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-600/20">
            {breedType}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-black mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-1">{breed}</h3>
        <p className="text-[var(--muted)] text-sm font-medium mb-6 line-clamp-2 leading-relaxed opacity-80">
          {breedInfo.description ? getText(breedInfo.description) : t.exploreBreedInfo}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 max-sm:hidden">
          <div className="bg-[var(--surface)] p-3 rounded-2xl border border-[var(--border)] text-center transition-colors group-hover:border-[var(--accent)]/30">
            <div className="font-black text-[var(--accent)] text-xs mb-0.5">{getText(breedInfo.milkProduction) || '—'}</div>
            <div className="text-[9px] font-black text-[var(--muted)] uppercase tracking-tighter opacity-60">Milk/Day</div>
          </div>
          <div className="bg-[var(--surface)] p-3 rounded-2xl border border-[var(--border)] text-center transition-colors group-hover:border-[var(--accent)]/30">
            <div className="font-black text-[var(--accent)] text-xs mb-0.5">{getText(breedInfo.weight) || '—'}</div>
            <div className="text-[9px] font-black text-[var(--muted)] uppercase tracking-tighter opacity-60">Avg Weight</div>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full py-3 bg-[var(--surface)] border-2 border-[var(--border)] rounded-xl font-black text-xs text-[var(--text)] group-hover:bg-[var(--accent)] group-hover:text-white group-hover:border-[var(--accent)] transition-all flex items-center justify-center gap-2">
          {t.viewDetails}
          <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
        </button>
      </div>
    </div>
  );
}

export default BreedCard;