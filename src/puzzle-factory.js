import { randomInt, sample } from './helpers.js'

const SHAPES = ["kwadrat", "trojkat", "prostokat", "kolo"]
const COLORABLE = ['background', 'text', 'number', 'shape']

const COLORS = {
    'czarny' : '#000000',
    'bialy' : '#FFFFFF',
    'niebieski' : '#0000ff',
    'czerwony' : '#ff0000',
    'zolty' : '#ffff00',
    'pomaranczowy' : '#ffa500',
    'zielony' : '#ffff00',
    'fioletowy' : '#800080',
}
const QUESTIONS = {
    'kolor tla' : (d) => getKeyByValue(COLORS, d.colors['background']),
    'kolor tekstu' : (d) => getKeyByValue(COLORS, d.colors['text']),
    'kolor numeru' : (d) => getKeyByValue(COLORS, d.colors['number']),
    'kolor ksztaltu' : (d) => getKeyByValue(COLORS, d.colors['shape']),
    'napisany kolor' : (d) => d.text[0],
    'napisany ksztalt' : (d) => d.text[1],
    'ksztalt pod tekstem' : (d) => d.shape
}

class PuzzleData {
    constructor(shape, number, text, colors) {
      this.shape = shape
      this.number = number
      this.text = text
      this.colors = colors
    }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

// generates a random puzzle
export function generateRandomPuzzle(){

    const shape = sample(SHAPES)
    const number = randomInt(9) + 1

    const topText = sample(Object.keys(COLORS))
    const bottomText = sample(SHAPES)

    const colors = COLORABLE.reduce((obj, color) => {obj[color] = sample(Object.values(COLORS)); return obj}, {})

    // ensure shape and background don't blend
    while(colors['shape'] == colors['background'])
        colors['shape'] = sample(Object.values(COLORS))

    // ensure nothing blends with shape
    while(['background', 'text', 'number'].map(i => colors[i]).includes(colors['shape']))
        colors['shape'] = sample(Object.values(COLORS))
    
    return new PuzzleData(shape, number, [topText, bottomText], colors)
}


export function generateQuestionAndAnswer(nums, puzzles){

    const positionOne = randomInt(nums.length)
    let tempPosTwo
    do {tempPosTwo = randomInt(nums.length)} while(positionOne == tempPosTwo) 
    const positionTwo = tempPosTwo
    

    const firstQuestion = sample(Object.keys(QUESTIONS))
    let tempSecondQuestion
    do {tempSecondQuestion = sample(Object.keys(QUESTIONS))} while(tempSecondQuestion == firstQuestion) 
    const secondQuestion = tempSecondQuestion

    

    // this is confusing as hell, but works somehow
    const question =  `${firstQuestion} (${nums[positionOne]}) i ${secondQuestion} (${nums[positionTwo]})`
    const answer = QUESTIONS[firstQuestion](puzzles[positionOne]) + ' ' + QUESTIONS[secondQuestion](puzzles[positionTwo])

    return [question, answer]
}
