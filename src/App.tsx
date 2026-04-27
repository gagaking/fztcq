import { useState, useMemo, useEffect } from 'react';
import { Copy, Type, Maximize, Languages, Loader2 } from 'lucide-react';
import { useStore } from './store';
import { TOP_ITEMS, BOTTOM_ITEMS, TOP_OPTIONS, BOTTOM_OPTIONS } from './constants';
import { generatePrompt } from './lib/promptLogic';
import { Card, CardHeader, CardTitle, CardContent, Label, Button, Slider, SelectGrid } from './components/ui';
import { cn } from './lib/utils';
import { DynamicPreview } from './components/DynamicPreview';

export default function App() {
  const store = useStore();
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [dynamicEn, setDynamicEn] = useState<{keywords: string, anchors: string, full: string} | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const { zhKeywords, enKeywords, zhAnchors, enAnchors, zhFull, enFull } = useMemo(() => generatePrompt(store), [store]);

  useEffect(() => {
    setDynamicEn(null);
    if (lang === 'en') setLang('zh');
  }, [zhFull, zhKeywords, zhAnchors]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleTranslateToggle = async () => {
    if (lang === 'zh') {
      if (!dynamicEn) {
        setIsTranslating(true);
        try {
          const [kRes, aRes, fRes] = await Promise.all([
            fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: zhKeywords, targetLang: 'en' }) }).then(r => r.json()),
            fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: zhAnchors, targetLang: 'en' }) }).then(r => r.json()),
            fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: zhFull, targetLang: 'en' }) }).then(r => r.json())
          ]);
          setDynamicEn({
            keywords: kRes.translatedText || enKeywords,
            anchors: aRes.translatedText || enAnchors,
            full: fRes.translatedText || enFull
          });
        } catch (e) {
          console.error(e);
          alert('翻译失败 (Translation API Error)');
        } finally {
          setIsTranslating(false);
        }
      }
      setLang('en');
    } else {
      setLang('zh');
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      <header className="shrink-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <Maximize className="w-5 h-5 " />
          <h1 className="font-semibold text-[15px] tracking-tight text-gray-900">服装版型提示词控制器 <span className="text-gray-400 font-normal ml-2 text-[13px]">滔搏内部平台使用</span></h1>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          V1.0.0
        </div>
      </header>

      <main className="flex-1 w-full max-w-[2000px] mx-auto p-3 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        
        {/* Col 1: Configuration */}
        <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto pr-1 pb-4 custom-scrollbar h-full min-h-0">
          <Card className="border-none shadow-sm bg-white shrink-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-[15px]">单品类型 Item Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                {(['top', 'bottom'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => store.setCategory(cat)}
                    className={cn(
                      "px-5 py-1.5 rounded-lg text-[13px] font-medium transition-all", 
                      store.category === cat ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                    )}
                  >
                    {cat === 'top' ? '上衣 Top' : '下装 Bottom'}
                  </button>
                ))}
              </div>
              
              <div>
                <SelectGrid 
                  options={store.category === 'top' ? TOP_ITEMS : BOTTOM_ITEMS} 
                  value={store.category === 'top' ? store.topAttributes.itemType : store.bottomAttributes.itemType}
                  onChange={(val) => store.category === 'top' ? store.updateTop({ itemType: val }) : store.updateBottom({ itemType: val })}
                />
              </div>
            </CardContent>
          </Card>

          {store.category === 'top' ? (
            <Card className="border-none shadow-sm bg-white shrink-0 flex-1 flex flex-col min-h-0">
              <CardHeader className="pb-3 shrink-0"><CardTitle className="text-[15px]">版型参数 Attributes</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 overflow-y-auto custom-scrollbar flex-1 pb-4">
                <div className="space-y-1.5"><Label className="text-[12px]">肩型 Shoulder</Label><SelectGrid options={TOP_OPTIONS.shoulder} value={store.topAttributes.shoulder} onChange={v => store.updateTop({shoulder: v})} /></div>
                <div className="space-y-1.5"><Label className="text-[12px]">版型 Fit</Label><SelectGrid options={TOP_OPTIONS.fit} value={store.topAttributes.fit} onChange={v => store.updateTop({fit: v})} /></div>
                <div className="space-y-1.5"><Label className="text-[12px]">袖长 Sleeve Length</Label><SelectGrid options={TOP_OPTIONS.sleeveLength} value={store.topAttributes.sleeveLength} onChange={v => store.updateTop({sleeveLength: v})} /></div>
                <div className="space-y-1.5"><Label className="text-[12px]">袖型 Sleeve Type</Label><SelectGrid options={TOP_OPTIONS.sleeveType} value={store.topAttributes.sleeveType} onChange={v => store.updateTop({sleeveType: v})} /></div>
                <div className="space-y-1.5"><Label className="text-[12px]">袖口 Cuff</Label><SelectGrid options={TOP_OPTIONS.cuff} value={store.topAttributes.cuff} onChange={v => store.updateTop({cuff: v})} /></div>
                <div className="space-y-1.5"><Label className="text-[12px]">衣长 Length</Label><SelectGrid options={TOP_OPTIONS.length} value={store.topAttributes.length} onChange={v => store.updateTop({length: v})} /></div>
                <div className="space-y-1.5"><Label className="text-[12px]">下摆 Hem</Label><SelectGrid options={TOP_OPTIONS.hem} value={store.topAttributes.hem} onChange={v => store.updateTop({hem: v})} /></div>
                <div className="space-y-1.5"><Label className="text-[12px]">领型 Collar</Label><SelectGrid options={TOP_OPTIONS.collar} value={store.topAttributes.collar} onChange={v => store.updateTop({collar: v})} /></div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-sm bg-white shrink-0 flex-1 flex flex-col min-h-0">
              <CardHeader className="pb-3 shrink-0"><CardTitle className="text-[15px]">版型参数 Attributes</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 overflow-y-auto custom-scrollbar flex-1 pb-4">
                <div className="space-y-1.5"><Label className="text-[12px]">裤型 Fit</Label><SelectGrid options={BOTTOM_OPTIONS.fit} value={store.bottomAttributes.fit} onChange={v => store.updateBottom({fit: v})} /></div>
                <div className="space-y-1.5"><Label className="text-[12px]">裆高 Rise</Label><SelectGrid options={BOTTOM_OPTIONS.rise} value={store.bottomAttributes.rise} onChange={v => store.updateBottom({rise: v})} /></div>
                <div className="space-y-1.5"><Label className="text-[12px]">裤长 Length</Label><SelectGrid options={BOTTOM_OPTIONS.length} value={store.bottomAttributes.length} onChange={v => store.updateBottom({length: v})} /></div>
                <div className="space-y-1.5"><Label className="text-[12px]">裤口 Cuff</Label><SelectGrid options={BOTTOM_OPTIONS.cuff} value={store.bottomAttributes.cuff} onChange={v => store.updateBottom({cuff: v})} /></div>
                <div className="space-y-1.5"><Label className="text-[12px]">细节 Details</Label><SelectGrid options={BOTTOM_OPTIONS.details} value={store.bottomAttributes.details} onChange={v => store.updateBottom({details: v})} multi /></div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Col 2: Preview ONLY */}
        <div className="lg:col-span-4 flex flex-col gap-3 h-full min-h-0">
          <Card className="border-none shadow-sm bg-white shrink-0 flex-1 flex flex-col min-h-0">
            <CardContent className="p-4 flex-1 flex flex-col min-h-0">
              <DynamicPreview store={store} />
            </CardContent>
          </Card>
        </div>

        {/* Col 3: Output */}
        <div className="lg:col-span-4 flex flex-col gap-3 h-full min-h-0">
          <Card className="border-none shadow-sm bg-white shrink-0">
            <CardHeader className="pb-3"><CardTitle className="text-[15px]">锚点控制 Anchors <span className="text-[10px] font-normal text-amber-600 block mt-0.5 bg-amber-50 rounded px-1.5 py-0.5 w-fit">🚫 Prohibited: cm / absolute units</span></CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-5">
              {store.category === 'top' ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><Label className="text-[12px]">肩线锚点 Shoulder Anchor</Label><span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{store.topAnchor.offset > 0 ? '+' : ''}{store.topAnchor.offset}</span></div>
                    <SelectGrid options={['肩部', '肘部', '手腕']} value={store.topAnchor.reference} onChange={v => store.updateTopAnchor({reference: v})} />
                    <Slider min="-10" max="10" value={store.topAnchor.offset} defaultValue={[0]} onChange={e => store.updateTopAnchor({offset: parseInt(e.target.value)})} className="h-1.5" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><Label className="text-[12px]">下摆锚点 Hem Anchor</Label><span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{store.bottomAnchor.offset > 0 ? '+' : ''}{store.bottomAnchor.offset}</span></div>
                    <SelectGrid options={['臀部', '大腿中部']} value={store.bottomAnchor.reference} onChange={v => store.updateBottomAnchor({reference: v})} />
                    <Slider min="-10" max="10" value={store.bottomAnchor.offset} defaultValue={[0]} onChange={e => store.updateBottomAnchor({offset: parseInt(e.target.value)})} className="h-1.5" />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between"><Label className="text-[12px]">裤长锚点 Pants Length Anchor</Label><span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{store.pantsLengthAnchor.offset > 0 ? '+' : ''}{store.pantsLengthAnchor.offset}</span></div>
                  <SelectGrid options={['脚踝', '鞋面']} value={store.pantsLengthAnchor.reference} onChange={v => store.updatePantsLengthAnchor({reference: v})} />
                  <Slider min="-10" max="10" value={store.pantsLengthAnchor.offset} onChange={e => store.updatePantsLengthAnchor({offset: parseInt(e.target.value)})} className="h-1.5" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white flex flex-col flex-1 min-h-0 overflow-hidden">
             <CardHeader className="pb-3 shrink-0 flex flex-row items-center justify-between space-y-0 relative z-10 bg-white">
                <CardTitle className="text-[15px]">提示词输出 Output</CardTitle>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleTranslateToggle}
                    disabled={isTranslating}
                    className="flex items-center gap-1.5 text-[12px] text-indigo-600 hover:text-indigo-800 transition-colors font-medium bg-indigo-50 px-2.5 py-1.5 rounded-md disabled:opacity-50"
                  >
                    {isTranslating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Type className="w-3.5 h-3.5" />}
                    {lang === 'zh' ? 'EN' : 'ZH'}
                  </button>
                </div>
             </CardHeader>
             <CardContent className="space-y-3 pb-4 flex-1 min-h-0 flex flex-col overflow-y-auto custom-scrollbar">

               <div className="group relative bg-gray-50 rounded-lg p-3 border border-gray-100 font-mono text-[13px] shrink-0">
                  <span className="text-[10px] font-sans font-semibold text-gray-400 mb-1.5 block uppercase tracking-wider">Structure Keywords / 结构关键词</span>
                  <p className="text-gray-800 leading-relaxed font-medium">{lang === 'zh' ? zhKeywords : (dynamicEn?.keywords || enKeywords)}</p>
                  <button onClick={() => copyToClipboard(lang === 'zh' ? zhKeywords : (dynamicEn?.keywords || enKeywords))} className="absolute top-2 right-2 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white rounded-md shadow-sm"><Copy className="w-3.5 h-3.5" /></button>
               </div>

               <div className="group relative bg-amber-50/50 rounded-lg p-3 border border-amber-100/50 font-mono text-[13px] shrink-0">
                  <span className="text-[10px] font-sans font-semibold text-amber-500 mb-1.5 block uppercase tracking-wider flex items-center gap-1">Anchor Prompts / 锚点提示词</span>
                  <p className="text-amber-800 leading-relaxed font-medium">{lang === 'zh' ? zhAnchors : (dynamicEn?.anchors || enAnchors)}</p>
                  <button onClick={() => copyToClipboard(lang === 'zh' ? zhAnchors : (dynamicEn?.anchors || enAnchors))} className="absolute top-2 right-2 text-amber-400 hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white rounded-md shadow-sm border border-amber-100"><Copy className="w-3.5 h-3.5" /></button>
               </div>

               <div className="group relative bg-gray-900 rounded-xl p-4 border border-gray-800 text-[13px] flex flex-col shrink-0 min-h-[140px]">
                  <span className="text-[10px] font-sans font-semibold text-gray-400 mb-1.5 block uppercase tracking-wider shrink-0">Full Prompt / 完整提示词</span>
                  <div className="pb-2 flex-1 overflow-y-auto custom-scrollbar-dark min-h-[60px]"><p className="text-gray-100 leading-relaxed">{lang === 'zh' ? zhFull : (dynamicEn?.full || enFull)}</p></div>
                  
                  <div className="mt-2 pt-3 shrink-0 border-t border-gray-800/50">
                    <Button onClick={() => copyToClipboard(lang === 'zh' ? zhFull : (dynamicEn?.full || enFull))} className="bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20 w-full rounded-xl h-9 text-[13px] font-medium">
                      <Copy className="w-3.5 h-3.5 mr-2" />
                      {lang === 'zh' ? '一键复制 Prompt' : 'Copy Full Prompt'}
                    </Button>
                  </div>
               </div>

             </CardContent>
          </Card>
        </div>

      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 20px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
