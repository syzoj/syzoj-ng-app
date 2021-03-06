import React from "react";

import style from "../SubmissionPage.module.less";

import { useLocalizer } from "@/utils/hooks";
import { CodeLanguage } from "@/interfaces/CodeLanguage";
import { OmittableAnsiCodeBox, OmittableString } from "@/components/CodeBox";
import { ProblemTypeSubmissionViewProps, ProblemTypeSubmissionViewHelper } from "../common/interface";
import FormattableCodeBox from "../common/FormattableCodeBox";

interface SubmissionTestcaseResultInteraction {
  testcaseInfo: {
    timeLimit: number;
    memoryLimit: number;
    inputFile: string;
    outputFile: string;
  };
  status: string;
  score: number;
  time?: number;
  memory?: number;
  input?: OmittableString;
  userError?: OmittableString;
  interactorMessage?: OmittableString;
  systemMessage?: OmittableString;
}

interface SubmissionContentInteraction {
  language: CodeLanguage;
  code: string;
  compileAndRunOptions: Record<string, string>;
}

type InteractionProblemSubmissionViewProps = ProblemTypeSubmissionViewProps<
  SubmissionTestcaseResultInteraction,
  SubmissionContentInteraction
>;

const InteractionProblemSubmissionView: React.FC<InteractionProblemSubmissionViewProps> = props => {
  const _ = useLocalizer("submission");

  return (
    <>
      <FormattableCodeBox
        code={props.content.code}
        language={props.content.language}
        ref={props.refDefaultCopyCodeBox}
      />
      {props.getCompilationMessage()}
      {props.getSystemMessage()}
      {props.getSubtasksView(testcaseResult => (
        <OmittableAnsiCodeBox
          title={_(".testcase.interactor_message")}
          ansiMessage={testcaseResult.interactorMessage}
        />
      ))}
    </>
  );
};

const helper: ProblemTypeSubmissionViewHelper<SubmissionContentInteraction> = {
  getAnswerInfo(content, _) {
    const entires = Object.entries(content.compileAndRunOptions);
    return entires.length ? (
      <>
        <table className={style.compileAndRunOptions}>
          <tbody>
            {entires.map(([name, value]) => (
              <tr key={name}>
                <td align="right" className={style.compileAndRunOptionsName}>
                  <strong>{_(`code_language.${content.language}.options.${name}.name`)}</strong>
                </td>
                <td>{_(`code_language.${content.language}.options.${name}.values.${value}`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    ) : null;
  },
  getHighlightLanguageList(content) {
    return [content.language];
  }
};

export default Object.assign(InteractionProblemSubmissionView, helper);
