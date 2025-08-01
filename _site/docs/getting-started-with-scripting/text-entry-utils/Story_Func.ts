import { storyData } from "Story_Data";
import { arrayUtils } from "UtilArray_Func";
import { formatting } from "UtilTextGizmo_Func";

export const storyFunc: Array<(name: string) => string> = [
  story1,
  story2,
];

function story1(name: string): string {
  const greeting = arrayUtils.getRandomItemFromArrayWithFallback(storyData.greetings, 'hello');
  const adjective = arrayUtils.getRandomItemFromArrayWithFallback(storyData.adjectives, 'brilliant');
  const verb = arrayUtils.getRandomItemFromArrayWithFallback(storyData.verbs, 'admire');
  const noun = arrayUtils.getRandomItemFromArrayWithFallback(storyData.nouns, 'tree');

  let story = formatting.capitalizeFirst(greeting) + ' ' + name + `, you've found a ` + adjective + ' ' + noun + `! Let's go ` + verb + ' the ' + noun + '.';
  story += formatting.lineBreak + 'Imagine having multiple sentences, and having large libraries of random words.';

  return story;
}

//Create as many story functions as you want, make sure to add them all the the storyFunc array
function story2(name: string): string {
  const greeting = arrayUtils.getRandomItemFromArrayWithFallback(storyData.greetings, 'hello');

  let story = formatting.capitalizeFirst(greeting) + ' ' + name + '!';
  
  return story;
}

