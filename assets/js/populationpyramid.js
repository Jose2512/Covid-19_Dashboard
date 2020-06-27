
// data must be in a format with age, male, and female in each object
var exampleData = [{ age: '0-9', male: 10, female: 12 }, { age: '10-19',
male: 14, female: 15 }, { age: '20-29', male: 15, female: 18 }, { age:
  '30-39', male: 18, female: 18 }, { age: '40-49', male: 21, female: 22 }, {
    age: '50-59', male: 19, female: 24 }, { age: '60-69', male: 15, female: 14 }, {
      age: '70-79', male: 8, female: 10 }, { age: '80-89', male: 4, female: 5 }, {
        age: '90+', male: 2, female: 3 }];

pyramidBuilder(exampleData, '#charMW', {height: 400, width: 500});
