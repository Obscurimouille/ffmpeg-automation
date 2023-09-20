import { SelectorParent } from "../../classes/selectors/selector-parent";
import { SelectorProject } from "../../classes/selectors/selector-project";
import { SelectorStep } from "../../classes/selectors/selector-step";

describe('stepSelectorRegex', () => {
    const validStepSelector = ['@step-100', '@step-1', '@step-1:', '@step-1:foo'];
    const invalidStepSelector = [' @step-1', 'foo@step-1', '@step-a', '@STEP-1', '@step-1foo', '@step-1step-1'];

    validStepSelector.forEach((input, index) => {
        test(`Valid input test #${index + 1}`, () => {
            expect(input).toMatch(SelectorStep.REGEX);
        });
    });

    invalidStepSelector.forEach((input, index) => {
        test(`Invalid input test #${index + 1}`, () => {
            expect(input).not.toMatch(SelectorStep.REGEX);
        });
    });
});

describe('parentSelectorRegex', () => {
    const validParentSelector = ['@parent', '@parent:', '@parent:foo'];
    const invalidParentSelector = [' @parent', 'foo@parent', '@PARENT', '@parentfoo', '@parent ', '@parentparent'];

    validParentSelector.forEach((input, index) => {
        test(`Valid input test #${index + 1}`, () => {
            expect(input).toMatch(SelectorParent.REGEX);
        });
    });

    invalidParentSelector.forEach((input, index) => {
        test(`Invalid input test #${index + 1}`, () => {
            expect(input).not.toMatch(SelectorParent.REGEX);
        });
    });
});

describe('projectSelectorRegex', () => {
    const validProjectSelector = ['@project'];
    const invalidProjectSelector = ['@project:', '@project:foo', ' @project', 'foo@project', '@PROJECT', '@projectfoo', '@project ', '@projectproject'];

    validProjectSelector.forEach((input, index) => {
        test(`Valid input test #${index + 1}`, () => {
            expect(input).toMatch(SelectorProject.REGEX);
        });
    });

    invalidProjectSelector.forEach((input, index) => {
        test(`Invalid input test #${index + 1}`, () => {
            expect(input).not.toMatch(SelectorProject.REGEX);
        });
    });
});

