import { CodeBlockEvents, Component, Player, PropTypes, TextGizmo } from "horizon/core";
import { storyFunc } from "Story_Func";
import { arrayUtils } from "UtilArray_Func";

class AdvancedStory extends Component<typeof AdvancedStory> {
  static propsDefinition = {
    text: { type: PropTypes.Entity },
  };

  activePlayers: Player[] = [];

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, this.playerEnterTrigger.bind(this));
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, this.playerEnterWorld.bind(this));
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitWorld, this.playerExitWorld.bind(this));
  }

  start() {
    //Load a default story
    this.updateStory('adventurer');
  }

  playerEnterWorld(player: Player) {
    this.activePlayers.push(player);
  }

  playerExitWorld(player: Player) {
    //Using the Vidyuu arrayUtils library
    arrayUtils.removeItemFromArray(this.activePlayers, player);
  }

  playerEnterTrigger(player: Player) {
    //Imagine this being at the end of a game rather than using from the playerEnterTrigger event
    const randomPlayer = arrayUtils.getRandomItemFromArrayWithFallback(this.activePlayers, player);
    
    this.updateStory(randomPlayer.name.get());
  }

  updateStory(name: string) {
    const story = this.getStory(name);

    this.displayStory(story);
  }

  getStory(name: string): string {
    const randomStoryFunc = arrayUtils.getRandomItemFromArray(storyFunc);

    if (randomStoryFunc) {
      const story = randomStoryFunc(name);
  
      return story;
    }
    else {
      console.log('randomStoryFunc not defined. Story_Func file not found, or storyFunc array is empty ');

      return '';
    }
    
  }

  displayStory(story: string) {
    const textGizmo = this.props.text?.as(TextGizmo);

    if (textGizmo) {
      textGizmo.text.set(story);
    }
    else {
      console.log('textGizmo not defined or referenced correctly on AdvancedStoryTrigger, for story: ' + story);
    }
  }
}
Component.register(AdvancedStory);
