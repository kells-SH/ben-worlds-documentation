import { CodeBlockEvents, Component, Player, PropTypes, TextGizmo } from "horizon/core";
import { storyData } from "Story_Data";
import { arrayUtils } from "UtilArray_Func";
import { formatting } from "UtilTextGizmo_Func";

class EasyStory extends Component<typeof EasyStory> {
  static propsDefinition = {
    text: { type: PropTypes.Entity },
  };

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, this.playerEnterTrigger.bind(this));
  }

  start() {
    //Load a default story
    this.updateStory('adventurer');
  }

  playerEnterTrigger(player: Player) {
    this.updateStory(player.name.get());
  }

  updateStory(name: string) {
    const story = this.getStory(name);

    this.displayStory(story);
  }

  getStory(name: string): string {
    //Using the Vidyuu arrayUtils library
    const greeting = arrayUtils.getRandomItemFromArrayWithFallback(storyData.greetings, 'hello');
    const adjective = arrayUtils.getRandomItemFromArrayWithFallback(storyData.adjectives, 'brilliant');
    const verb = arrayUtils.getRandomItemFromArrayWithFallback(storyData.verbs, 'admire');
    const noun = arrayUtils.getRandomItemFromArrayWithFallback(storyData.nouns, 'tree');

    let story = formatting.capitalizeFirst(greeting) + ' ' + name + `, you've found a ` + adjective + ' ' + noun + `! Let's go ` + verb + ' the ' + noun + '.';
    //This line below writes exactly the same thing as the one above, if you prefer this style, it can take up less space, choose the one you like best.
    story = `${formatting.capitalizeFirst(greeting)} ${name}, you've found a ${adjective} ${noun} ! Let's go ${verb} the ${noun}.`;
    
    story += formatting.lineBreak + 'Imagine having multiple sentences, and having large libraries of random words.';

    return story;
  }

  displayStory(story: string) {
    const textGizmo = this.props.text?.as(TextGizmo);

    if (textGizmo) {
      textGizmo.text.set(story);
    }
    else {
      console.log('textGizmo not defined or referenced correctly on EasyStoryTrigger, for story: ' + story);
    }
  }
}
Component.register(EasyStory);

