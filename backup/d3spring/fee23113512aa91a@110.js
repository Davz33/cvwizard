// https://observablehq.com/@jheer/scrubber@110
function _1(md){return(
md`# Scrubber

A range input with playback functionality, with options similar to \`Inputs.range\`.
Adapted from [@mbostock/scrubber](https://observablehq.com/@mbostock/scrubber).`
)}

function _2(md){return(
md`To use in your notebook:

~~~js
import {Scrubber} from "@jheer/scrubber"
~~~`
)}

function _3(md){return(
md`## Example`
)}

function _rot(Scrubber){return(
Scrubber([0, 360], { step: 0.5, value: 45, delay: 100, label: 'Rotation', format: x => x.toFixed(1) })
)}

function _5(rot,md){return(
md`The current value of \`rot\` is _${rot.toFixed(1)}_.`
)}

function _6(md){return(
md`## Code`
)}

function _Scrubber(Inputs,d3,html){return(
function Scrubber(extent, {
  format = Inputs.formatTrim,
  value = extent[0],
  delay = 30,
  step = 1,
  autoplay = false,
  loop = true,
  loopDelay = null,
  alternate = false,
  label = null,
  labelWidth = '100px'
} = {}) {
  const values = d3.range(extent[0], extent[1] + step, step);
  const form = html`<form style="font: 12px var(--sans-serif); font-variant-numeric: tabular-nums; display: flex; height: 33px; align-items: center;">
  ${label ? html`<span style="margin-right: 0.5em; width: ${labelWidth};">${label}</span>` : ''}
  <button name=b type=button style="cursor: pointer; width: 2em; margin-right: 0.5em; border: none; background: none;"></button>
  <label style="display: flex; align-items: center;">
    <input name=i type=range min=0 max=${values.length - 1} value=${valuesIndex(value)} step=1 style="width: 180px;">
    <output name=o style="margin-left: 0.4em;"></output>
  </label>
</form>`;
  let frame = null;
  let timer = null;
  let interval = null;
  let direction = 1;
  function start() {
    form.b.innerHTML = '<img alt="Pause" src="//upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Octicons-playback-pause.svg/16px-Octicons-playback-pause.svg.png" width="10" height="20">'
    if (delay === null) frame = requestAnimationFrame(tick);
    else interval = setInterval(tick, delay);
  }
  function stop() {
    form.b.innerHTML = '<img alt="Play" src="//upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Octicons-playback-play.svg/16px-Octicons-playback-play.svg.png" width="10" height="20">';
    if (frame !== null) cancelAnimationFrame(frame), frame = null;
    if (timer !== null) clearTimeout(timer), timer = null;
    if (interval !== null) clearInterval(interval), interval = null;
  }
  function running() {
    return frame !== null || timer !== null || interval !== null;
  }
  function tick() {
    if (form.i.valueAsNumber === (direction > 0 ? values.length - 1 : direction < 0 ? 0 : NaN)) {
      if (!loop) return stop();
      if (alternate) direction = -direction;
      if (loopDelay !== null) {
        if (frame !== null) cancelAnimationFrame(frame), frame = null;
        if (interval !== null) clearInterval(interval), interval = null;
        timer = setTimeout(() => (update(), start()), loopDelay);
        return;
      }
    }
    if (delay === null) frame = requestAnimationFrame(tick);
    update();
  }
  function update() {
    form.i.valueAsNumber = (form.i.valueAsNumber + direction + values.length) % values.length;
    form.i.dispatchEvent(new CustomEvent("input", {bubbles: true}));
  }
  function valuesIndex(v) {
    return d3.bisectLeft(values, v);
  }
  Object.defineProperty(form, 'value', {
    get() {
      return value;
    },
    set(v) {
      if (isFinite(v)) {
        value = v;
        form.i.valueAsNumber = valuesIndex(v);
        form.o.value = format(form.value, form.i.valueAsNumber, values);
      }
    }
  });
  form.i.oninput = event => {
    if (event && event.isTrusted && running()) stop();
    value = values[form.i.valueAsNumber];
    form.o.value = format(form.value, form.i.valueAsNumber, values);
  };
  form.b.onclick = () => {
    if (running()) return stop();
    direction = alternate && form.i.valueAsNumber === values.length - 1 ? -1 : 1;
    form.i.valueAsNumber = (form.i.valueAsNumber + direction) % values.length;
    form.i.dispatchEvent(new CustomEvent("input", {bubbles: true}));
    start();
  };
  form.i.oninput();
  if (autoplay) start();
  else stop();
  Inputs.disposal(form).then(stop);
  return form;
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("viewof rot")).define("viewof rot", ["Scrubber"], _rot);
  main.variable(observer("rot")).define("rot", ["Generators", "viewof rot"], (G, _) => G.input(_));
  main.variable(observer()).define(["rot","md"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("Scrubber")).define("Scrubber", ["Inputs","d3","html"], _Scrubber);
  return main;
}
