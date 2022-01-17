const { parse } = require('csv-parse')
const fs = require('fs')

const habitablePlanets = []

function isHabitablePlanet(planet) {
  // Conditions for high probability that a planet will support life
  // koi_insol = solar influx; any planet above or below these limits will not hold water
  // koi_prad = planet radius; anyt planet above 1.6 earth radii will likely not support life
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  )
}

fs.createReadStream('kepler_data.csv')
  .pipe(
    parse({
      comment: '#',
      columns: true,
    }),
  )
  .on('data', (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data)
    }
  })
  .on('error', (err) => {
    console.log('Danger, Will Robinson! Danger!')
    console.log(err)
  })
  .on('end', () => {
    console.log(`${habitablePlanets.length} habitable planets were found!`)
    console.log(
      habitablePlanets.map((planet) => {
        return planet['kepler_name']
      }),
    )
  })
