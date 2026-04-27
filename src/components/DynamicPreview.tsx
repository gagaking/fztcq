import React, { useState, useRef } from 'react';
import { Download, Camera } from 'lucide-react';
import { AppState } from '../types';
import html2canvas from 'html2canvas';

const MODEL_IMAGE_URL = '/model.png';

export function DynamicPreview({ store }: { store: AppState }) {
  const [modelType, setModelType] = useState<'male' | 'female'>('male');
  const previewRef = useRef<HTMLDivElement>(null);
  const [showModel, setShowModel] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [debugBases, setDebugBases] = useState({
    male: { '肩部': 40, '肘部': 70, '手腕': 93, '臀部': 95, '大腿中部': 120, '脚踝': 76, '鞋面': 80 },
    female: { '肩部': 46, '肘部': 75, '手腕': 97, '臀部': 94, '大腿中部': 120, '脚踝': 76, '鞋面': 80 }
  });

  const exportImage = async () => {
    if (!previewRef.current) return;
    try {
      const canvas = await html2canvas(previewRef.current, { backgroundColor: '#f0f2f5', scale: 2, useCORS: true });
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `vibe-code-preview-${Date.now()}.png`;
      link.href = url;
      link.click();
    } catch (e) {
      console.error('Export failed', e);
      alert('导出失败 (Export failed)');
    }
  };

  const getSleeveY = () => {
    const base = debugBases[modelType][store.topAnchor.reference as keyof typeof debugBases['male']] || 37;
    return base - store.topAnchor.offset;
  };

  const getLengthY = () => {
    const base = debugBases[modelType][store.bottomAnchor.reference as keyof typeof debugBases['male']] || 85;
    return base - store.bottomAnchor.offset;
  };

  const getPantsLengthY = () => {
    const base = debugBases[modelType][store.pantsLengthAnchor.reference as keyof typeof debugBases['male']] || 90;
    return base - store.pantsLengthAnchor.offset;
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between shrink-0">
        <h3 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2">
           实时预览 Preview 
        </h3>
        <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs">
               <button onClick={() => setModelType('male')} className={`px-3 py-1 outline-none rounded-md transition-all ${modelType === 'male' ? 'bg-white shadow-sm font-medium text-indigo-700' : 'text-gray-500'}`}>男模</button>
               <button onClick={() => setModelType('female')} className={`px-3 py-1 outline-none rounded-md transition-all ${modelType === 'female' ? 'bg-white shadow-sm font-medium text-pink-700' : 'text-gray-500'}`}>女模</button>
            </div>
        </div>
      </div>

      <div 
        ref={previewRef}
        className="relative w-full flex-1 min-h-[300px] flex items-center justify-center bg-[#f0f2f5] rounded-xl border border-gray-200 overflow-hidden"
      >
        <div className="relative h-full max-w-full overflow-hidden shrink-0" style={{ aspectRatio: '3/4' }}>
          {/* Model Background */}
          {showModel && (
            <div className="absolute inset-0 z-0">
              <img 
                src={MODEL_IMAGE_URL} 
                alt="model" 
                className="absolute max-w-none transition-all duration-700 ease-in-out opacity-95"
                style={{
                  width: '240%',
                  left: modelType === 'male' ? '-130%' : '-10%',
                  top: store.category === 'top' ? '-5%' : '-90%',
                }}
              />
            </div>
          )}

          {/* Model Toggle Button & Debug Mode */}
          <div className="absolute top-4 left-4 z-40 flex flex-col gap-2" data-html2canvas-ignore>
            <button 
              onClick={() => setDebugMode(!debugMode)}
              className={`px-3 py-2 ${debugMode ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-700 shadow-sm border border-gray-200/50'} rounded-md backdrop-blur-sm text-[11px] font-medium transition-colors`}
            >
              调试模式 (Debug)
            </button>

            {debugMode && (
               <div className="bg-black/80 p-3 rounded-lg shadow-xl text-white text-[11px] flex flex-col gap-2 min-w-[150px]">
                 <div className="text-amber-400 font-bold mb-1 border-b border-white/20 pb-1">基准坐标 ({modelType === 'male' ? '男模' : '女模'})</div>
                 {Object.entries(debugBases[modelType]).map(([key, val]) => (
                   <div key={key} className="flex items-center justify-between gap-2">
                      <span>{key}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setDebugBases(p => ({...p, [modelType]: {...p[modelType], [key]: (val as number) - 1}}))} className="bg-white/20 hover:bg-white/30 w-5 h-5 rounded flex items-center justify-center">-</button>
                        <span className="w-6 text-center font-mono">{val as number}</span>
                        <button onClick={() => setDebugBases(p => ({...p, [modelType]: {...p[modelType], [key]: (val as number) + 1}}))} className="bg-white/20 hover:bg-white/30 w-5 h-5 rounded flex items-center justify-center">+</button>
                      </div>
                   </div>
                 ))}
                 <div className="text-[10px] text-gray-400 mt-1 leading-tight">在此调整的值仅作临时参考，确定好每个锚点的数值后找我固化默认值。</div>
               </div>
            )}
          </div>

          {/* Anchor Lines */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {store.category === 'top' && (
              <>
              <AnchorLine 
                y={getSleeveY()} 
                label={`肩基准: ${store.topAnchor.reference}(${store.topAnchor.offset > 0 ? '+'+store.topAnchor.offset : store.topAnchor.offset})`} 
                color="text-amber-600"
                borderColor="border-amber-400"
                bgColor="bg-amber-50"
                debug={debugMode}
              />
              <AnchorLine 
                y={getLengthY()} 
                label={`摆基准: ${store.bottomAnchor.reference}(${store.bottomAnchor.offset > 0 ? '+'+store.bottomAnchor.offset : store.bottomAnchor.offset})`} 
                color="text-indigo-600"
                borderColor="border-indigo-400"
                bgColor="bg-indigo-50"
                debug={debugMode}
              />
            </>
          )}
          
          {store.category === 'bottom' && (
            <AnchorLine 
              y={getPantsLengthY()} 
              label={`裤长: ${store.pantsLengthAnchor.reference}(${store.pantsLengthAnchor.offset > 0 ? '+'+store.pantsLengthAnchor.offset : store.pantsLengthAnchor.offset})`} 
              color="text-emerald-700"
              borderColor="border-emerald-500"
              bgColor="bg-emerald-50"
              debug={debugMode}
            />
          )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 shrink-0">
        <button 
          onClick={exportImage} 
          className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 px-4 py-2.5 rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" /> 合并浮标图层导出图像
        </button>
      </div>

    </div>
  );
}

function AnchorLine({ y, label, color, borderColor, bgColor, debug }: { y: number, label: string, color: string, borderColor: string, bgColor: string, debug?: boolean }) {
  return (
    <div className={`absolute left-0 right-0 z-20 transition-all duration-300 ease-out`} style={{ top: `${y}%` }}>
      <div className={`w-full border-t-[1.5px] border-dashed ${borderColor}`}></div>
      <div className={`absolute right-2 -translate-y-1/2 px-2.5 py-1 rounded-md shadow-sm border border-gray-200/60 text-xs font-bold ${color} ${bgColor} backdrop-blur-sm shadow-black/5 whitespace-nowrap flex items-center gap-1`}>
        <span>{label}</span>
        {debug && <span className="text-black/40 font-mono text-[10px] ml-1">y={y}%</span>}
      </div>
    </div>
  );
}


