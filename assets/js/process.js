(() => {
  'use strict';
  const process = document.querySelector('.response-process');
  if (process) {
    const buttons = [...process.querySelectorAll('.process-button')];
    const defaultWidths = [374, 380, 380, 372, 351];
    const defaultPositions = [0, 300, 604, 911, 1215];
    const defaultCenters = [161.9,191.2,191.2,187.4,198.9];
    const compactWidths = [203, 203, 202, 199, 187];
    // Figma -9 and -10 use separate wide SVGs, never stretched compact arrows.
    const middleLayouts = {
      1: {widths:[238,816,238,234,220], positions:[0,192,963,1155,1346], roles:['first','active','middle','penultimate','last']},
      2: {widths:[238,238,816,234,220], positions:[0,192,384,1155,1346], roles:['first','middle','active','penultimate','last']},
      3: {widths:[238,238,234,816,220], positions:[0,192,384,575,1346], roles:['first','middle','penultimate','active','last']}
    };
    const lastShapes = ['first', 'second', 'third', 'fourth', 'active'];
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let active = -1;

    function render(animate = true) {
      buttons.forEach((button,index)=>{
        const title=button.getAttribute('aria-label');
        button.querySelector('.process-label').textContent=index===active?title:title.split(' ').at(-1);
      });
      if(innerWidth<=1200){
        process.dataset.active=String(active);
        buttons.forEach((button,index)=>{
          const selected=index===active,label=button.querySelector('.process-label'),description=button.querySelector('.process-description');
          gsap.killTweensOf([button,label,description,...button.querySelectorAll('.process-shape')]);
          gsap.set([button,label,description,...button.querySelectorAll('.process-shape')],{clearProps:'transform,opacity,width,height'});
          button.setAttribute('aria-expanded',String(selected));description.hidden=!selected;
          if(selected){button.setAttribute('aria-describedby',description.id);if(animate&&!preference.matches)gsap.fromTo(description,{opacity:0,y:6},{opacity:1,y:0,duration:.28,ease:'expo.out',clearProps:'transform'});}else button.removeAttribute('aria-describedby');
        });return;
      }
      const unit = innerWidth / 1728;
      const duration = animate && !preference.matches ? .48 : 0;
      const widths = active < 0 ? [...defaultWidths] : [...compactWidths];
      if (active === 0) widths[0] = 914;
      else if (active === 4) widths.splice(0, 5, 221, 225, 226, 220, 845);
      else if (active > 0) widths.splice(0,5,...middleLayouts[active].widths);
      let position = active < 0 ? 0 : 9;
      if (active > 0) position = 0;
      process.dataset.active = String(active);
      buttons.forEach((button, index) => {
        const selected = index === active;
        const shapes = [...button.querySelectorAll('.process-shape')];
        const previousWidths = shapes.map(shape => shape.getBoundingClientRect().width);
        const label = button.querySelector('.process-label');
        const description = button.querySelector('.process-description');
        const x = active < 0 ? defaultPositions[index] : active === 4 ? [0,178,357,540,721][index] : active > 0 ? middleLayouts[active].positions[index] : position;
        const center = active < 0 ? defaultCenters[index] : selected ? (active === 0 ? 427.5 : active === 4 ? 425.5 : 409.5) : widths[index] / 2;
        const expanded = shapes[1];
        if (active > 0 && active < 4) {
          const role = middleLayouts[active].roles[index];
          expanded.style.setProperty('--arrow-state', `var(--arrow-middle-${role})`);
        } else if (active === 4) expanded.style.setProperty('--arrow-state', `var(--arrow-last-${lastShapes[index]})`);
        else expanded.style.setProperty('--arrow-state', 'var(--arrow-expanded)');
        button.style.width = `${widths[index] * unit}px`;
        button.style.height = `${(active < 0 ? 139 : [139,138,138,138,137][index]) * unit}px`;
        button.setAttribute('aria-expanded', String(selected));
        if (selected) button.setAttribute('aria-describedby', description.id);
        else button.removeAttribute('aria-describedby');
        description.hidden = !selected;
        const options = {duration, ease:'expo.out', overwrite:true};
        gsap.to(button, {...options, x:x * unit, y:(active >= 0 && index >= 3 ? 1 : 0) * unit});
        shapes.forEach((shape, shapeIndex) => {
          gsap.killTweensOf(shape);
          gsap.set(shape, {scaleX:previousWidths[shapeIndex] / (widths[index] * unit)});
          gsap.to(shape, {...options, scaleX:1, opacity:shapeIndex === (active < 0 ? 0 : 1) ? 1 : 0});
        });
        gsap.to(label, {...options, x:center * unit, xPercent:-50, opacity:active < 0 || selected ? 1 : 0});
        gsap.set(description, {x:center * unit, xPercent:-50});
        if (selected) gsap.fromTo(description, {opacity:0}, {...options, opacity:1, duration:duration ? .3 : 0});
        position += widths[index] - 38;
      });
    }
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {active = active === index ? -1 : index; render();});
    });
    process.addEventListener('keydown', event => {
      if (event.key === 'Escape' && active >= 0) {event.preventDefault(); active = -1; render();}
    });
    addEventListener('resize', () => render(false));
    preference.addEventListener('change', () => render(false));
    render(false);
  }

  document.querySelector('[data-template-placeholder]')?.addEventListener('click', () => {
    document.querySelector('#template-status').textContent = 'Report template coming soon.';
  });
})();
