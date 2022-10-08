import define1 from "./fee23113512aa91a@110.js";

function _1(md){return(
md`# It's Hip to be Square

An introduction to basic Observable features using SVG squares.`
)}

function _rot(Scrubber){return(
Scrubber([0, 10], {step: 0.05, value: 4, alternate: true, label: 'Rotation', format: x => x.toFixed(2)})
)}

function _sep(Scrubber){return(
Scrubber([1, 100], {step: 1, value: 4, alternate: true, label: 'Separation'})
)}

function _4(svg,width,size,pad,d3,sep,rot,color){return(
svg`<svg width="${width}" height="${2*size+pad}" viewBox="0 0 ${width} ${2*size+pad}">
  ${d3.range(0, Math.ceil((width + 4*size) / sep)).map(i => {
    const a = (i * rot) % 360;
    return svg`<rect
      transform="translate(${i*sep-2*size-1}, ${pad/2}) rotate(${-a}, ${size}, ${size})"
      width="${2*size}" height="${2*size}"
      fill="none" stroke="${color(a)}"></rect>`;
  })}
  </svg>`
)}

function _size(Inputs){return(
Inputs.range([1, 50], { value: 25, step: 1 })
)}

function _pad(size){return(
2 * size
)}

function _color(d3){return(
d3.scaleSequential(d3.interpolateRainbow).domain([360, 0])
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof rot")).define("viewof rot", ["Scrubber"], _rot);
  main.variable(observer("rot")).define("rot", ["Generators", "viewof rot"], (G, _) => G.input(_));
  main.variable(observer("viewof sep")).define("viewof sep", ["Scrubber"], _sep);
  main.variable(observer("sep")).define("sep", ["Generators", "viewof sep"], (G, _) => G.input(_));
  main.variable(observer()).define(["svg","width","size","pad","d3","sep","rot","color"], _4);
  main.variable(observer("viewof size")).define("viewof size", ["Inputs"], _size);
  main.variable(observer("size")).define("size", ["Generators", "viewof size"], (G, _) => G.input(_));
  main.variable(observer("pad")).define("pad", ["size"], _pad);
  main.variable(observer("color")).define("color", ["d3"], _color);
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  return main;
}
