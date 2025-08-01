import { CodeBlockEvent, Component, PropTypes } from "horizon/core";
import { arrayUtils } from "UtilArray_Func";

const getNewQuestion = new CodeBlockEvent<[]>('getNewQuestion', []);
const questionMessage = new CodeBlockEvent<[question: string, answers: string[]]>('questionMessage', [PropTypes.String, PropTypes.StringArray]);

class GetQuestionData extends Component<typeof GetQuestionData> {
  static propsDefinition = {
    receiver: { type: PropTypes.Entity },
  };

  preStart() {
    this.connectCodeBlockEvent(this.entity, getNewQuestion, this.sendBackQuestion.bind(this));
  }

  start() {
    
  }
  
  sendBackQuestion() {
    const curQuestion = arrayUtils.getRandomItemFromArray(questionData);
    
    //This makes sure the receiver has been filled out on the properties panel and the curQuestion is not empty
    if (this.props.receiver && curQuestion) {

      //The codeblock event is "questionMessage" and has a string parameter, and a string list parameter
      this.sendCodeBlockEvent(this.props.receiver, questionMessage, curQuestion.question, curQuestion.answers);
    }
  }
}
Component.register(GetQuestionData);


const questionData: QuestionData[] = [
  { question: 'some Q', answers: ['answer1', 'answer2', 'answer3', 'answer4'] },
  { question: 'some Q', answers: ['answer1', 'answer2', 'answer3', 'answer4'] },
];

type QuestionData = {
  question: string;
  answers: string[];
}
