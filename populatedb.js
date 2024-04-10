#! /usr/bin/env node

console.log(
  'This script populates some test items and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
)

// Get arguments passed on command line
const userArgs = process.argv.slice(2)

const Item = require("./models/item")
const Category = require("./models/category")

const categories = []
const items = []

const mongoose = require("mongoose")
mongoose.set("strictQuery", false)

const mongoDB = userArgs[0]

main().catch((err) => console.log(err))

async function main() {
  console.log("Debug: About to connect")
  await mongoose.connect(mongoDB)
  console.log("Debug: Should be connected?")
  await createCategories()
  await createItems()
  console.log("Debug: Closing mongoose")
  mongoose.connection.close()
}

async function categoryCreate(index, name, description) {
  const category = new Category({ name, description })
  await category.save()
  categories[index] = category
  console.log(`Added category: ${name}`)
}

async function itemCreate(
  index,
  name,
  description,
  category,
  price,
  number_in_stock
) {
  const item = new Item({
    name,
    description,
    category,
    price,
    number_in_stock,
  })

  await item.save()
  items[index] = item
  console.log(`Added item: ${name}`)
}

async function createCategories() {
  console.log("Adding Categories")
  await Promise.all([
    categoryCreate(
      0,
      "Warship",
      "A warship or combatant ship is a ship that is built and primarily intended for space warfare. Usually they belong to the armed forces of a nation. As well as being armed, warships are designed to withstand damage and are typically faster and more maneuverable than other ships."
    ),
    categoryCreate(
      1,
      "Research Vessel",
      "A space research vessel is a specialized craft equipped with advanced scientific instruments, laboratories, and observation facilities, enabling it to conduct in-depth studies and exploration of celestial bodies and phenomena."
    ),
    categoryCreate(
      2,
      "Auxillary Space Vessel",
      "An auxiliary space vessel is a secondary craft accompanying a main spacecraft, providing support functions such as resupply, repair, or reconnaissance during missions in space."
    ),
  ])
}

async function createItems() {
  console.log("Adding Items")
  await Promise.all([
    itemCreate(
      0,
      "Dreadnought",
      "A dreadnought warship is a colossal vessel designed for domination in interstellar conflicts. Its imposing frame bristles with heavy weaponry, shield generators, and advanced armor plating. Command centers coordinate tactical maneuvers while vast hangars deploy fighters and troops. Dreadnoughts serve as symbols of power and deterrence in galactic warfare.",
      categories[0],
      5500,
      1
    ),
    itemCreate(
      1,
      "Battleship",
      "A battleship is a formidable warship renowned for its imposing size and firepower. Dominating space, it boasts heavy armor, massive gun batteries, and advanced propulsion systems. Designed for space warfare, battleships serve as the backbone of fleets, projecting power and intimidating adversaries with their sheer might and resilience.",
      categories[0],
      1800,
      12
    ),
    itemCreate(
      2,
      "Frigate",
      "A space frigate is a versatile craft for military and exploration missions, balancing firepower, speed, and maneuverability. Equipped with advanced sensors and weapons, it defends against threats and projects power across distant star systems.",
      categories[0],
      3350,
      3
    ),
    itemCreate(
      3,
      "Scout Ship",
      "Sleek and agile, the scout ship ventures into the cosmos, equipped with advanced propulsion and sensor systems for exploration.",
      categories[1],
      1200,
      15
    ),
    itemCreate(
      4,
      "Science Vessel",
      "A science vessel is a specialized spacecraft equipped for research and exploration. It typically features advanced sensor arrays, laboratories, and observation decks. With a focus on scientific discovery, it conducts experiments, gathers data on celestial phenomena, and analyzes samples from various environments, contributing to our understanding of the universe.",
      categories[1],
      1600,
      6
    ),
    itemCreate(
      5,
      "Escape Pod",
      "An escape pod is a small, self-contained emergency craft designed to evacuate individuals from a larger spacecraft in case of danger. Typically cylindrical or pod-shaped, it contains life support systems, propulsion, and communication equipment, ensuring survival during transit to a safe location.",
      categories[2],
      350,
      30
    ),
    itemCreate(
      6,
      "Long Range Shuttle",
      "A long-range space shuttle is built for extended voyages, equipped with advanced life support, propulsion, and navigation systems for interstellar exploration.",
      categories[2],
      600,
      20
    ),
  ])
}
