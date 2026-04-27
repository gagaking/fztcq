import { AppState } from '../types';
import { TOP_EN_MAP, BOTTOM_EN_MAP } from '../constants';

function getEn(zh: string, map: Record<string, string>) {
  if (!zh || zh === '常规' || zh === '常规袖口' || zh === '常规模口') return '';
  return map[zh] || zh;
}

export function generatePrompt(state: AppState) {
  const { category, topAttributes, bottomAttributes, topAnchor, bottomAnchor, pantsLengthAnchor } = state;
  let zhKeywords: string[] = [];
  let enKeywords: string[] = [];
  let zhAnchors: string[] = [];
  let enAnchors: string[] = [];

  const addKeyword = (zh: string, map: Record<string, string>) => {
    if (zh && zh !== '常规' && zh !== '') {
      zhKeywords.push(zh);
      const en = getEn(zh, map);
      if (en) enKeywords.push(en);
    }
  };

  if (category === 'top') {
    addKeyword(topAttributes.shoulder, TOP_EN_MAP);
    addKeyword(topAttributes.fit, TOP_EN_MAP);
    addKeyword(topAttributes.itemType, TOP_EN_MAP);
    addKeyword(topAttributes.sleeveLength, TOP_EN_MAP);
    addKeyword(topAttributes.sleeveType, TOP_EN_MAP);
    addKeyword(topAttributes.cuff, TOP_EN_MAP);
    addKeyword(topAttributes.length, TOP_EN_MAP);
    addKeyword(topAttributes.hem, TOP_EN_MAP);
    addKeyword(topAttributes.collar, TOP_EN_MAP);

    if (topAttributes.sleeveLength !== '无袖') {
      const { text: zh, en } = translateAnchor(topAnchor, '肩部控制', {
        '肩部': 'shoulder',
        '上臂中段': 'mid upper arm',
        '肘部': 'elbow',
        '手腕': 'wrist'
      });
      if (zh) zhAnchors.push(zh);
      if (en) enAnchors.push(`top edge starts ${en}`);
    }

    const { text: lZh, en: lEn } = translateAnchor(bottomAnchor, '下摆控制', {
        '腰部': 'waist',
        '臀部': 'hips',
        '大腿中部': 'mid-thigh'
    });
    if (lZh) zhAnchors.push(lZh);
    if (lEn) enAnchors.push(`hem is positioned ${lEn}`);

  } else {
    addKeyword(bottomAttributes.fit, BOTTOM_EN_MAP);
    addKeyword(bottomAttributes.rise, BOTTOM_EN_MAP);
    addKeyword(bottomAttributes.itemType, BOTTOM_EN_MAP);
    addKeyword(bottomAttributes.length, BOTTOM_EN_MAP);
    addKeyword(bottomAttributes.cuff, BOTTOM_EN_MAP);
    bottomAttributes.details.forEach(d => addKeyword(d, BOTTOM_EN_MAP));

    const { text: pZh, en: pEn } = translateAnchor(pantsLengthAnchor, '裤脚', {
      '脚踝': 'ankle',
      '鞋面': 'shoe vamp'
    });
    if (pZh) zhAnchors.push(pZh);
    if (pEn) enAnchors.push(`pants leg ends ${pEn}`);
  }

  const enStruct = enKeywords.join(', ');
  const zhStruct = zhKeywords.join('、');
  
  const zhAnchorStr = zhAnchors.join('，');
  const enAnchorStr = enAnchors.join(', ');

  const zhFull = `模特穿着${zhStruct}。配置细节：${zhAnchorStr}。`;
  const enFull = `Model wearing ${enStruct}. ${enAnchorStr}. Highly detailed, clothing photography.`;

  return {
    zhKeywords: zhStruct,
    enKeywords: enStruct,
    zhAnchors: zhAnchorStr,
    enAnchors: enAnchorStr,
    zhFull,
    enFull
  };
}

function translateAnchor(anchor: { reference: string, offset: number }, subject: string, refEnMap: Record<string, string>) {
  const { reference, offset } = anchor;
  const refEn = refEnMap[reference] || reference;
  
  if (offset >= 5) {
    return {
      text: `${subject}明显在${reference}上方`,
      en: `clearly above the ${refEn}`
    };
  } else if (offset > 0 && offset < 5) {
    return {
      text: `${subject}略微在${reference}上方`,
      en: `slightly above the ${refEn}`
    };
  } else if (offset === 0) {
    return {
      text: `${subject}正好在${reference}处`,
      en: `exactly at the ${refEn}`
    };
  } else if (offset < 0 && offset > -5) {
    return {
      text: `${subject}略微在${reference}下方`,
      en: `slightly below the ${refEn}`
    };
  } else {
    return {
      text: `${subject}覆盖${reference}下方`,
      en: `covering below the ${refEn}`
    };
  }
}
