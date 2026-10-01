import { experienceContent } from '@/content/site-content';

export function GiantType() {
  return <section className="giant-type x-section" data-theme="light" data-ambient="warm" id="manifiesto" aria-label="Design, technology, strategy"><div aria-hidden="true">{experienceContent.giant.map((word, index) => <div className={'giant-line giant-line-' + index} key={word}><span>{word}</span><i>×</i><span>{word}</span><i>×</i></div>)}</div></section>;
}
