import { basic, initSidebar, initTopbar } from './modules/layouts';
import { loadImg, imgPopup, initClipboard, getClapCounts } from './modules/plugins';

basic();
initSidebar();
initTopbar();
loadImg();
imgPopup();
initClipboard();
getClapCounts();
