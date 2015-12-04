/**
 * This file illustrates how you may map
 * single routes using an exported object
 */

const EXAMPLES = [
  { id: 1 },
  { id: 2 },
];

function *all(next) {
  this.body = EXAMPLES;
}

function *get(next) {
  let example = EXAMPLES[this.params.index];
  this.body = example;
}

export default {
  'GET /example': all,
  'GET /example/:index': get,
};
