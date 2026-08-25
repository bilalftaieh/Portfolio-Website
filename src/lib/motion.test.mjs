import {
  riseIn,
  slideIn,
  clipUp,
  orchestrate,
  duration,
  stagger,
  spring,
  ease,
  inView,
} from './motion.js'

const fails = []
const ok = (cond, msg) => {
  if (!cond) fails.push(msg)
}

// With motion allowed, hidden must carry the offset that show cancels.
ok(riseIn(false).hidden.y === 20 && riseIn(false).show.y === 0, 'riseIn moves on y')
ok(riseIn(false).hidden.opacity === 0 && riseIn(false).show.opacity === 1, 'riseIn fades')
ok(riseIn(false, { y: 40 }).hidden.y === 40, 'riseIn respects y override')
ok(slideIn(false).hidden.x === -8 && slideIn(false).show.x === 0, 'slideIn moves on x')
ok(clipUp(false).hidden.y === '110%' && clipUp(false).show.y === '0%', 'clipUp clips')

// Reduced motion: no transform offset may survive in hidden, or the element
// would be parked off-position with nothing left to animate it back.
for (const [name, v] of [
  ['riseIn', riseIn(true)],
  ['slideIn', slideIn(true)],
  ['clipUp', clipUp(true)],
]) {
  ok(v.hidden.y === undefined, `${name} reduced: no y in hidden`)
  ok(v.hidden.x === undefined, `${name} reduced: no x in hidden`)
  ok(v.hidden.opacity === 0, `${name} reduced: still fades`)
  ok(v.show.opacity === 1, `${name} reduced: show is visible`)
}

// Every variant must end fully visible, or content silently disappears.
for (const [name, v] of [
  ['riseIn', riseIn(false)],
  ['slideIn', slideIn(false)],
  ['clipUp', clipUp(false)],
]) {
  ok(v.show.opacity === 1, `${name}: show reaches opacity 1`)
  ok(v.show.transition.duration > 0, `${name}: show has a duration`)
}

ok(orchestrate(false, { each: 0.1 }).show.transition.staggerChildren === 0.1, 'orchestrate staggers')
ok(orchestrate(true, { each: 0.1 }).show.transition.staggerChildren === 0, 'orchestrate reduced: no stagger')
ok(orchestrate(true, { delay: 0.5 }).show.transition.delayChildren === 0, 'orchestrate reduced: no delayChildren')

ok(Array.isArray(ease) && ease.length === 4, 'ease is a cubic bezier')
ok(Object.values(duration).every((d) => d > 0 && d < 2), 'durations sane')
ok(Object.values(stagger).every((s) => s > 0 && s < 0.2), 'staggers sane')
ok(spring.pill.type === 'spring' && spring.scroll.type === 'spring', 'springs typed')
ok(inView.once === true, 'reveals fire once')

if (fails.length) {
  console.log('FAILED:')
  fails.forEach((f) => console.log(`  x ${f}`))
  process.exit(1)
}
console.log('all motion-token assertions passed')
