// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

// get the Cat model
const { Cat } = models;
const { Dog } = models;
// default fake data so that we have something to work with until we make a real Cat
const defaultData = {
  name: 'unknown',
  bedsOwned: 0,
};
/*
const defaultDataDog = {
  name: 'unknown',
  breed: 'unknown',
  age: 0,
}; */
// object for us to keep track of the last Cat we made and dynamically update it sometimes
let lastAdded = new Cat(defaultData);

//const lastAddedDog = new Dog(defaultDataDog);

// Function to handle rendering the index page.
const hostIndex = (req, res) => {

  res.render('index', {
    currentName: lastAdded.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

// Function for rendering the page1 template
// Page1 has a loop that iterates over an array of cats
const hostPage1 = async (req, res) => {

  try {

    const docs = await Cat.find({}).lean().exec();

    // Once we get back the docs array, we can send it to page1.
    return res.render('page1', { cats: docs });
  } catch (err) {

    console.log(err); //eslint-disable-line
    return res.status(500).json({ error: 'failed to find cats' });
  }
};

// Function to render the untemplated page2.
const hostPage2 = (req, res) => {
  res.render('page2');
};

// Function to render the untemplated page3.
const hostPage3 = (req, res) => {
  res.render('page3');
};

const hostPage4 = async (req, res) => {
  try {
  const docs = await Dog.find({}).lean().exec();

  return res.render('page4', { dogs: docs });
} catch (err) {
  console.log(err); //eslint-disable-line
  return res.status(500).json({ error: 'failed to find dogs' });
}
}

const getName = (req, res) => res.json({ name: lastAdded.name });

const setNameDog = async (req, res) => {
  if (!req.body.name || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'All fields required!' });
  }

  const dogData = {
    name: `${req.body.name}`,
    breed: `${req.body.breed}`,
    age: `${req.body.age}`,
  };

  const newDog = new Dog(dogData);

  try {
    await newDog.save();
    lastAdded = newDog;
    return res.json({
      name: lastAdded.name,
      breed: lastAdded.breed,
      age: lastAdded.age,
    });
  } catch (err) {
    console.log(err) //eslint-disable-line
    return res.status(500).json({ error: 'failed to create dog' });
  }
};
// Function to create a new cat in the database
const setName = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    // If they are missing data, send back an error.
    return res.status(400).json({ error: 'firstname, lastname and beds are all required' });
  }

  const catData = {
    name: `${req.body.firstname} ${req.body.lastname}`,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);

  try {
    await newCat.save();

    lastAdded = newCat;
    return res.json({
      name: lastAdded.name,
      beds: lastAdded.bedsOwned,
    });
  } catch (err) {
    console.log(err); //eslint-disable-line
    return res.status(500).json({ error: 'failed to create cat' });
  }
};

// Function to handle searching a cat by name.
const searchName = async (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  try {
    const doc = await Cat.findOne({ name: req.query.name }).exec();

    if (!doc) {
      return res.json({ error: 'No cats found' });
    }

    return res.json({ name: doc.name, beds: doc.bedsOwned });
  } catch (err) {
    console.log(err); //eslint-disable-line
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const searchNameDog = async (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({error: 'Name is required to perform a search'});
  }

  try {
    const doc = await Dog.findOne({ name: req.query.name}).exec();

    if (!doc) {
      return res.json({error: 'No dogs found'});
    }
    doc.age++;
    return res.json({name: doc.name, breed: doc.breed, age: doc.age});
  } catch (err) {
    console.log(err); //eslint-disable-line
    return res.status(500).json({error: 'Something went wrong'});
  }
}

const updateLast = (req, res) => {
    lastAdded.bedsOwned++;
    const savePromise = lastAdded.save();

    // If we successfully save/update them in the database, send back the cat's info.
    savePromise.then(() => res.json({
      name: lastAdded.name,
      beds: lastAdded.bedsOwned,
    }));

    savePromise.catch((err) => {
      console.log(err);
      return res.status(500).json({ error: 'Something went wrong' });
    });
 
};

// A function to send back the 404 page.
const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

// export the relevant public controller functions
module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  getName,
  setName,
  setNameDog,
  updateLast,
  searchName,
  searchNameDog,
  notFound,
};
