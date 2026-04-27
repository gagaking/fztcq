import { AppState } from './types';

export const TOP_ITEMS = ['T恤', '卫衣', '连帽卫衣', '运动上衣', '背心', '外套', '运动内衣'];
export const BOTTOM_ITEMS = ['短裤', '长裤', '运动裤', '束脚裤', '阔腿裤', '工装裤'];

export const TOP_OPTIONS = {
  shoulder: ['正常肩', '落肩', '插肩', '蝙蝠袖'],
  fit: ['修身', '合体', '宽松', '超宽'],
  sleeveLength: ['无袖', '短袖', '五分袖', '七分袖', '长袖'],
  sleeveType: ['常规', '宽袖', '收口袖', '灯笼袖'],
  cuff: ['紧缩', '常规', '宽松'],
  length: ['短款', '常规', '中长'],
  hem: ['直下摆', '弧形下摆', '前短后长'],
  collar: ['圆领', 'V领', '高领', '连帽']
};

export const BOTTOM_OPTIONS = {
  fit: ['紧身', '修身', '直筒', '宽松', '阔腿'],
  rise: ['低腰', '中腰', '高腰'],
  length: ['短裤', '五分', '七分', '九分', '长裤', '拖地'],
  cuff: ['收口', '常规', '宽口'],
  details: ['抽绳', '松紧腰', '工装口袋', '拉链'] // These are typically multi-select or single? Let's make it single for simplicity or an array. The prompt says "细节", we'll do an array.
};

export const TOP_EN_MAP: Record<string, string> = {
  'T恤': 't-shirt', '卫衣': 'sweatshirt', '连帽卫衣': 'hoodie', '运动上衣': 'track jacket', '背心': 'tank top', '外套': 'jacket', '运动内衣': 'sports bra',
  '正常肩': 'regular shoulder', '落肩': 'drop shoulder', '插肩': 'raglan sleeve', '蝙蝠袖': 'batwing sleeve',
  '修身': 'slim fit', '合体': 'regular fit', '宽松': 'loose fit', '超宽': 'oversized',
  '无袖': 'sleeveless', '短袖': 'short sleeve', '五分袖': 'half sleeve', '七分袖': 'three-quarter sleeve', '长袖': 'long sleeve',
  '常规': 'regular sleeve', '宽袖': 'wide sleeve', '收口袖': 'cuffed sleeve', '灯笼袖': 'lantern sleeve',
  '紧缩': 'tight cuff', '常规袖口': 'regular cuff', '宽松袖口': 'wide cuff',
  '短款': 'cropped length', '中长': 'mid-length',
  '直下摆': 'straight hem', '弧形下摆': 'curved hem', '前短后长': 'high-low hem',
  '圆领': 'crew neck', 'V领': 'v-neck', '高领': 'turtleneck', '连帽': 'hooded'
};

export const BOTTOM_EN_MAP: Record<string, string> = {
  '短裤': 'shorts', '长裤': 'pants', '运动裤': 'sweatpants', '束脚裤': 'joggers', '阔腿裤': 'wide-leg pants', '工装裤': 'cargo pants',
  '紧身': 'skinny', '直筒': 'straight', 
  '低腰': 'low rise', '中腰': 'mid rise', '高腰': 'high rise',
  '五分': 'knee-length', '七分': 'cropped', '九分': 'ankle-length', '拖地': 'floor length',
  '收口': 'cuffed ankle', '常规模口': 'regular ankle', '宽口': 'wide ankle',
  '抽绳': 'drawstring', '松紧腰': 'elastic waist', '工装口袋': 'cargo pockets', '拉链': 'zip fly'
};

export const DEFAULT_STATE: AppState = {
  category: 'top',
  topAttributes: {
    itemType: 'T恤',
    shoulder: '落肩',
    fit: '宽松',
    sleeveLength: '短袖',
    sleeveType: '常规',
    cuff: '常规',
    length: '常规',
    hem: '直下摆',
    collar: '圆领'
  },
  bottomAttributes: {
    itemType: '长裤',
    fit: '直筒',
    rise: '中腰',
    length: '长裤',
    cuff: '常规',
    details: []
  },
  topAnchor: { reference: '肩部', offset: 0 },
  bottomAnchor: { reference: '臀部', offset: 0 },
  pantsLengthAnchor: { reference: '脚踝', offset: 0 }
};
