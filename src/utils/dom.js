import { debounce } from '@/common/function'

export const setDomFontSize = () => {
  let width = document.documentElement.clientWidth || document.body.clientWidth;
  let fontsize = (width <= 992 ? 1200 : width) / 100 + 'px';
  (document.getElementsByTagName('html')[0].style)['font-size'] = fontsize;
}

let setDomFontSizeDebounce = debounce(setDomFontSize, 400)
window.addEventListener('resize', setDomFontSizeDebounce); 
